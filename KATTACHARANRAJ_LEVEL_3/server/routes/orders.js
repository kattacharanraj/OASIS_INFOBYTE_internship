const express = require('express');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const router = express.Router();

// simple price list (in rupees)
const PRICES = { base: 150, cheese: 40, veggie: 20, meat: 50 };

function calculatePrice(veggies, meat) {
    let total = PRICES.base + PRICES.cheese;
    total += (veggies ? veggies.length : 0) * PRICES.veggie;
    total += (meat ? meat.length : 0) * PRICES.meat;
    return total;
}

// Take 1 from stock for an ingredient. Returns true if it crossed below its threshold.
async function useIngredient(name, category) {
    const item = await Inventory.findOne({ name, category });
    if (!item || item.stock <= 0) {
        throw new Error(`${name} is out of stock`);
    }

    const wasOkBefore = item.stock >= item.threshold;
    item.stock = item.stock - 1;
    await item.save();

    // "just crossed" the threshold with this order
    return wasOkBefore && item.stock < item.threshold;
}

// ---------- PLACE AN ORDER ----------
router.post('/', protect, async (req, res) => {
    try {
        const { base, sauce, cheese, veggies, meat } = req.body;

        if (!base || !sauce || !cheese) {
            return res.status(400).json({ message: 'Please choose a base, sauce and cheese' });
        }

        // take everything from stock (this also checks availability)
        const crossed = [];
        if (await useIngredient(base, 'base')) crossed.push(base);
        if (await useIngredient(sauce, 'sauce')) crossed.push(sauce);
        if (await useIngredient(cheese, 'cheese')) crossed.push(cheese);

        for (const v of veggies || []) {
            if (await useIngredient(v, 'veggie')) crossed.push(v);
        }
        for (const m of meat || []) {
            if (await useIngredient(m, 'meat')) crossed.push(m);
        }

        const price = calculatePrice(veggies, meat);

        const order = await Order.create({
            user: req.user._id,
            customerName: req.user.name,
            base, sauce, cheese,
            veggies: veggies || [],
            meat: meat || [],
            price
        });

        // if any ingredient dropped below its threshold, tell the admin
        if (crossed.length > 0) {
            await sendEmail(
                process.env.ADMIN_EMAIL,
                'Low stock alert - Pizza App',
                `These ingredients just went below their threshold:\n- ${crossed.join('\n- ')}\n\nPlease restock soon.`
            );
        }

        res.status(201).json({ message: 'Order placed!', order });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ---------- MY ORDERS (for the user dashboard) ----------
router.get('/mine', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Could not load your orders', error: err.message });
    }
});

module.exports = router;

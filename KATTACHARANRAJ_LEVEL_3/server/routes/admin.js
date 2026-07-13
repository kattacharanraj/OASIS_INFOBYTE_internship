const express = require('express');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// every route in this file needs a logged-in admin
router.use(protect, adminOnly);

// ---------- INVENTORY ----------

// list all ingredients
router.get('/inventory', async (req, res) => {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(items);
});

// add a new ingredient
router.post('/inventory', async (req, res) => {
    try {
        const { name, category, stock, threshold } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }
        const item = await Inventory.create({ name, category, stock, threshold });
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update stock or threshold
router.put('/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete an ingredient
router.delete('/inventory/:id', async (req, res) => {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// ---------- ORDERS ----------

// all orders (newest first)
router.get('/orders', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// change an order's delivery status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Not a valid status' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ---------- DASHBOARD STATS ----------
router.get('/stats', async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const lowStock = await Inventory.find({ $expr: { $lt: ['$stock', '$threshold'] } });
    res.json({ totalOrders, lowStock });
});

module.exports = router;

const express = require('express');
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Give the pizza builder the ingredients that are still in stock,
// grouped by category.
router.get('/options', protect, async (req, res) => {
    try {
        const items = await Inventory.find({ stock: { $gt: 0 } });

        const options = { base: [], sauce: [], cheese: [], veggie: [], meat: [] };
        items.forEach(item => {
            if (options[item.category]) {
                options[item.category].push(item.name);
            }
        });

        res.json(options);
    } catch (err) {
        res.status(500).json({ message: 'Could not load options', error: err.message });
    }
});

module.exports = router;

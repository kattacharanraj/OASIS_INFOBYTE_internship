const mongoose = require('mongoose');

// One document = one ingredient (a base, a sauce, a cheese, a veggie or a meat)
const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // 'base', 'sauce', 'cheese', 'veggie', 'meat'
    stock: { type: Number, default: 0 },        // how many we have left
    threshold: { type: Number, default: 20 }    // notify admin when stock goes below this
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);

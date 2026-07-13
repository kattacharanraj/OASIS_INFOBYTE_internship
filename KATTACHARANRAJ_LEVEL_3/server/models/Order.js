const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: String,

    // the pizza the user built
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String],
    meat: [String],

    price: Number,
    paymentStatus: { type: String, default: 'Paid' },

    // the delivery status the admin controls
    // "Order Received" -> "In the Kitchen" -> "Sent to Delivery" -> "Delivered"
    status: { type: String, default: 'Order Received' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

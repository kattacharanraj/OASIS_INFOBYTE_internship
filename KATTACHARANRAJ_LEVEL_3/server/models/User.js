const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // 'user' or 'admin'
    isVerified: { type: Boolean, default: false },

    // used for the email verification link
    verifyToken: String,

    // used for the forgot-password link
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

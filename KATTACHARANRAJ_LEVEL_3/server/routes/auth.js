const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const router = express.Router();

// helper: make a login token
function makeToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}

// helper: make a random string for email/reset links
function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}

// ---------- REGISTER ----------
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = randomToken();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verifyToken
        });

        // send the verification link
        const link = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
        await sendEmail(
            email,
            'Verify your Pizza App account',
            `Hi ${name}, please verify your account by opening this link:\n${link}`
        );

        res.status(201).json({ message: 'Registered! Please check your email to verify your account.' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// ---------- VERIFY EMAIL ----------
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verifyToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or already used verification link' });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        await user.save();

        res.json({ message: 'Email verified! You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        const token = makeToken(user);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// ---------- FORGOT PASSWORD ----------
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Always reply the same way so people can't guess which emails exist
        if (user) {
            user.resetToken = randomToken();
            user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes
            await user.save();

            const link = `${process.env.CLIENT_URL}/reset/${user.resetToken}`;
            await sendEmail(
                email,
                'Reset your Pizza App password',
                `Open this link to set a new password (valid 30 minutes):\n${link}`
            );
        }

        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// ---------- RESET PASSWORD ----------
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }

        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or expired' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password updated! You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// ---------- WHO AM I (used by frontend to check login) ----------
router.get('/me', protect, async (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;

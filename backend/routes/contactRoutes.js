const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route  POST /api/contact
// @desc   Submit a contact message
// @access Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill in all fields' });
        }

        const contact = await Contact.create({ name, email, message });

        res.status(201).json({
            success: true,
            message: `Thank you, ${name}! Your message has been received. We'll get back to you soon.`,
        });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ success: false, message: 'Server error submitting message' });
    }
});

// @route  GET /api/contact
// @desc   Get all contact messages (Admin only)
// @access Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, count: messages.length, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

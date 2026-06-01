const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, event: savedEvent });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, event: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- ADD THIS BLOCK ---
// Get single event details by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ----------------------
// --- ADD THIS REGISTRATION ROUTE ---
router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'You are already registered for this event!' });
        }

        // Add user to the event's registeredUsers array
        event.registeredUsers.push(req.user._id);
        await event.save();

        // Add event to the user's registeredEvents array
        req.user.registeredEvents.push(event._id);
        await req.user.save();

        res.json({ success: true, message: 'Successfully registered for ' + event.title });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ------------------------------------


module.exports = router;
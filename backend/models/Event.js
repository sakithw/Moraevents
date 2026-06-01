const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Tech', 'Sports', 'Cultural', 'Academic', 'Other'],
    },
    date: {
        type: String,
        required: [true, 'Event date is required'],
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true,
    },
    img: {
        type: String,
        default: 'https://via.placeholder.com/400x200?text=Campus+Event',
    },
    description: {
        type: String,
        default: 'Join us for this exciting campus event. Bring your Student ID for entry.',
    },
    time: {
        type: String,
        default: '09:00 AM',
    },
    registeredUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes    = require('./routes/authRoutes');
const eventRoutes   = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');

connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend')));


app.use('/api/auth',    authRoutes);
app.use('/api/events',  eventRoutes);
app.use('/api/contact', contactRoutes);


app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'UniEvents API is running ✅' });
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 UniEvents server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`📂 Frontend served at http://localhost:${PORT}\n`);
});

module.exports = app;


require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Event = require('./models/Event');
const User = require('./models/User');

const sampleEvents = [
    {
        title: 'Tech-Fest Hackathon',
        category: 'Tech',
        date: 'Oct 15',
        venue: 'IT Faculty Lab',
        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
        description: 'Join us for the annual Tech-Fest Hackathon. This event brings together students from all faculties to innovate, compete, and network. 24-hour coding challenge with amazing prizes.',
        time: '09:00 AM',
    },
    {
        title: 'Annual Cricket Match',
        category: 'Sports',
        date: 'Oct 20',
        venue: 'Main Ground',
        img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
        description: 'The annual inter-faculty cricket championship is back! Cheer for your faculty and enjoy a full day of exciting cricket action.',
        time: '08:00 AM',
    },
    {
        title: 'Web Dev Workshop',
        category: 'Tech',
        date: 'Oct 22',
        venue: 'Seminar Hall',
        img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        description: 'A hands-on workshop covering modern web development with HTML, CSS, JavaScript, and React. Laptops required. All skill levels welcome.',
        time: '10:00 AM',
    },
    {
        title: 'Music Night 2026',
        category: 'Cultural',
        date: 'Nov 05',
        venue: 'Auditorium',
        img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        description: 'Experience a magical evening of live music performances by the university\'s most talented students. Bands, solo acts, and a great atmosphere.',
        time: '06:00 PM',
    },
    {
        title: 'Badminton Tournament',
        category: 'Sports',
        date: 'Nov 12',
        venue: 'Indoor Stadium',
        img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
        description: 'Open singles and doubles badminton tournament. Register as an individual or a pair. Prizes for top 3 in each category.',
        time: '09:00 AM',
    },
];

const seedDB = async () => {
    await connectDB();
    try {
        await Event.deleteMany();
        console.log('🗑️  Existing events cleared');

        await Event.insertMany(sampleEvents);
        console.log(`✅ ${sampleEvents.length} sample events seeded`);

        
        const adminExists = await User.findOne({ email: 'admin@unievents.lk' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@unievents.lk',
                password: 'admin123',
                role: 'admin',
            });
            console.log('✅ Admin account created: admin@unievents.lk / admin123');
        }

        console.log('\n🎉 Database seeded successfully! Run: npm run dev\n');
        process.exit();
    } catch (error) {
        console.error('❌ Seeder Error:', error);
        process.exit(1);
    }
};

seedDB();

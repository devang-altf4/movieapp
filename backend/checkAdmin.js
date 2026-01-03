const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const check = async () => {
    await connectDB();
    const count = await User.countDocuments({ role: 'admin' });
    console.log(`Admin count: ${count}`);
    if (count === 0) {
        console.log('Creating Admin...');
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin created.');
    }
    process.exit();
};

check();

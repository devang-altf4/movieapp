const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const verify = async () => {
    await connectDB();
    try {
        const user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            console.log('User not found');
        } else {
            const isMatch = await user.matchPassword('adminpassword');
            console.log(`User found. Password match: ${isMatch}`);
            console.log(`Stored Hash: ${user.password}`);
        }
    } catch (e) {
        console.log(e);
    }
    process.exit();
};

verify();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED');

        await User.deleteMany({ email: 'admin@example.com' });
        console.log('DELETED OLD');

        const u = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'pass',
            role: 'admin'
        });
        await u.save();
        console.log('SAVED');
    } catch (err) {
        console.log('ERROR: ' + err.message);
    }
    process.exit();
};

run();

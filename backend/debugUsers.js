const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const debug = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users in the database.`);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

    } catch (e) {
        console.error('Error:', e);
    }
    process.exit();
};

debug();

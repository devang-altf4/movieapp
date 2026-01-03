const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const debug = async () => {
    try {
        await connectDB();
        const users = await User.find({});
        const log = `Found ${users.length} users.\n` + users.map(u => `- ${u.email} (${u.role})`).join('\n');
        fs.writeFileSync('debug_output.txt', log);
        console.log('Done writing to file.');
    } catch (e) {
        fs.writeFileSync('debug_output.txt', `Error: ${e.message}`);
    }
    process.exit();
};

debug();

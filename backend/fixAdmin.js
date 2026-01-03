const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const fix = async () => {
    await connectDB();
    console.log(`Connected to database: ${mongoose.connection.name}`);
    try {
        await User.deleteMany({ email: 'admin@example.com' });
        console.log('Deleted old admin if exists');

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });
        const createdUser = await adminUser.save();
        console.log(`Admin created successfully with ID: ${createdUser._id}`);

        // Immediate verification
        const check = await User.findById(createdUser._id);
        console.log(`Verification: Found user ${check.email} in DB.`);

    } catch (e) {
        console.log(e);
    }
    process.exit();
};

fix();

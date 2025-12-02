const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Create admin user if doesn't exist
        await createAdminUser();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createAdminUser = async () => {
    const User = require('../models/User');
    
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
        await User.create({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            fullName: 'Admin User',
            mobileNumber: '9999999999',
            isAdmin: true
        });
        console.log('Admin user created');
    }
};

module.exports = connectDB;
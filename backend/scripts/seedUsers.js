const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@cabbook.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Test Customer',
    email: 'customer@cabbook.com',
    password: 'Customer@123',
    role: 'customer',
    isVerified: true,
  },
  {
    name: 'Test Driver',
    email: 'driver@cabbook.com',
    password: 'Driver@123',
    role: 'driver',
    isVerified: true,
    isOnline: false,
  },
];

const seedUsers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is required for seeding users.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isVerified: userData.isVerified,
      });

      console.log(`Created default user: ${userData.email}`);
    }

    console.log('Default users seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();

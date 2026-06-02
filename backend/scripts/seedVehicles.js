const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('../models/Vehicle');

dotenv.config();

const vehicles = [
  {
    name: 'Sedan (5-Seater)',
    type: '5-Seater',
    baseFare: 100,
    ratePerKm: 15,
    localPackageFare: 1800,
    packageTimeLimit: 8,
    packageDistanceLimit: 80,
    extraKmRate: 12,
    extraHourRate: 200,
    capacity: 4,
    description: 'Comfortable 4-seater sedan for city travel.',
  },
  {
    name: 'Innova Crysta',
    type: 'Innova Crysta',
    baseFare: 250,
    ratePerKm: 25,
    localPackageFare: 2800,
    packageTimeLimit: 8,
    packageDistanceLimit: 80,
    extraKmRate: 18,
    extraHourRate: 300,
    capacity: 7,
    description: 'Premium MUV for family trips and long drives.',
  },
  {
    name: 'Tempo Traveller',
    type: 'Tempo Traveller',
    baseFare: 500,
    ratePerKm: 40,
    localPackageFare: 4500,
    packageTimeLimit: 8,
    packageDistanceLimit: 80,
    extraKmRate: 25,
    extraHourRate: 400,
    capacity: 12,
    description: 'Large van for groups of up to 12 people.',
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is required for seeding.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await Vehicle.deleteMany({});
    await Vehicle.insertMany(vehicles);

    console.log('Database seeded with vehicles! ✅');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Cab Booking API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

// Since we may not have a MongoDB URI immediately, we wrap the connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ No MONGO_URI provided. Skipping database connection for now.');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

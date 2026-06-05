const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: ['customer', 'driver', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    driverPhoto: {
      type: String,
      trim: true,
    },
    vehicle: {
      number: {
        type: String,
        trim: true,
        sparse: true,
      },
      type: {
        type: String,
        enum: ['5-Seater', 'Innova Crysta', 'Tempo Traveller', 'Bike', 'Mini'],
      },
      model: {
        type: String,
        trim: true,
      },
      capacity: {
        type: Number,
      },
      photo: {
        type: String,
        trim: true,
      },
    },
    // Production v2.0 Additions
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isBusy: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
// `unique: true` on email already creates a unique index, so keep this schema clean.
userSchema.index({ location: '2dsphere' }); // Critical for driver matching
userSchema.index({ 'vehicle.number': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);

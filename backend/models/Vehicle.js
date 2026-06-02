const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['5-Seater', 'Innova Crysta', 'Tempo Traveller'],
      required: true,
    },
    // Regular ride pricing
    baseFare: {
      type: Number,
      required: true,
    },
    ratePerKm: {
      type: Number,
      required: true,
    },
    // Local package pricing
    localPackageFare: {
      type: Number,
      default: 0,
    },
    packageTimeLimit: {
      type: Number, // in hours
      default: 8,
    },
    packageDistanceLimit: {
      type: Number, // in km
      default: 80,
    },
    extraKmRate: {
      type: Number, // ₹ per extra km
      default: 12,
    },
    extraHourRate: {
      type: Number, // ₹ per extra hour
      default: 200,
    },
    capacity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // URL to vehicle image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

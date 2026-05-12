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
    baseFare: {
      type: Number,
      required: true,
    },
    ratePerKm: {
      type: Number,
      required: true,
    },
    localPackageFare: {
      type: Number,
      default: 0,
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

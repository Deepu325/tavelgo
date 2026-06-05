const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingType: {
      type: String,
      enum: ['local', 'trip'],
      default: 'local',
      required: true,
    },
    tripType: {
      type: String,
      enum: ['one-way', 'round-trip'],
    },
    startDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    isLocalPackage: {
      type: Boolean,
      default: false,
    },
    localPackageDuration: {
      type: String,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number, // in km
      required: true,
    },
    otp: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for geo-queries if needed later
rideSchema.index({ status: 1, customer: 1 });
rideSchema.index({ status: 1, driver: 1 });

module.exports = mongoose.model('Ride', rideSchema);

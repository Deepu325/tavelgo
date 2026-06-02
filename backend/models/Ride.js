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
    // Package booking details
    isPackageBooking: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      timeLimit: { type: Number }, // in hours
      distanceLimit: { type: Number }, // in km
      extraKmRate: { type: Number },
      extraHourRate: { type: Number },
    },
    // Actual ride metrics
    actualDistance: {
      type: Number, // in km - updated when ride completes
    },
    actualDuration: {
      type: Number, // in hours - updated when ride completes
    },
    // Extra charges
    extraKmCharge: {
      type: Number,
      default: 0,
    },
    extraTimeCharge: {
      type: Number,
      default: 0,
    },
    finalFare: {
      type: Number, // base fare + extra charges
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

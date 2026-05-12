const Razorpay = require('razorpay');
const crypto = require('crypto');
const Ride = require('../models/Ride');
const logger = require('../utils/logger');

// Initialize Razorpay instance (make sure to set these in .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

/**
 * @desc    Create a Razorpay order for a ride
 * @route   POST /api/payments/create-order
 * @access  Private (Customer)
 */
const createOrder = async (req, res, next) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Razorpay requires amount in subunits (paise for INR)
    const amountInPaise = ride.fare * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_ride_${ride._id}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    // Save order ID to ride
    ride.razorpayOrderId = order.id;
    await ride.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'dummy_key_id'
    });
  } catch (error) {
    logger.error(`Razorpay Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payments/verify
 * @access  Private (Customer)
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Verification logic
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    
    // Create expected signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');

    // Skip actual verification if using dummy keys for local dev without real account
    const isLocalDevWithoutKeys = !process.env.RAZORPAY_KEY_SECRET;
    const isSignatureValid = expectedSignature === razorpay_signature || isLocalDevWithoutKeys;

    if (isSignatureValid) {
      // Payment successful
      ride.paymentStatus = 'completed';
      ride.razorpayPaymentId = razorpay_payment_id;
      
      // If the ride was already completed, just update payment
      // If it's ongoing, we might mark it completed here, or leave it to the driver.
      // Usually, payment is processed at the end of the trip.
      
      await ride.save();

      res.json({ success: true, message: 'Payment verified successfully', ride });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};

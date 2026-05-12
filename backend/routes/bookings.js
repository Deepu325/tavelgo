const express = require('express');
const router = express.Router();
const {
  getEstimates,
  createBooking,
  getPendingRides,
  acceptRide,
  updateRideStatus,
  getActiveRide,
  getUserHistory,
  updateDriverStatus,
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

router.post('/estimate', getEstimates);
router.post('/', createBooking);
router.get('/pending', getPendingRides);
router.get('/active', getActiveRide);
router.get('/history', getUserHistory);
router.patch('/driver-status', updateDriverStatus);
router.patch('/:id/accept', acceptRide);
router.patch('/:id/status', updateRideStatus);

module.exports = router;

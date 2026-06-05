const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getSummary,
  getUsers,
  blockUser,
  unblockUser,
  getDrivers,
  approveDriver,
  rejectDriver,
  deleteDriver,
  getBookings,
  updateBookingStatus,
  getVehicles,
  updateVehiclePricing,
  createVehiclePricing,
  assignBookingDriver,
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(roleCheck('admin'));

router.get('/summary', getSummary);
router.get('/users', getUsers);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);

router.get('/drivers', getDrivers);
router.patch('/drivers/:id/approve', approveDriver);
router.patch('/drivers/:id/reject', rejectDriver);
router.delete('/drivers/:id', deleteDriver);

router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

router.get('/vehicles', getVehicles);
router.post('/vehicles', createVehiclePricing);
router.patch('/vehicles/:id', updateVehiclePricing);

router.patch('/bookings/:id/assign', assignBookingDriver);

module.exports = router;

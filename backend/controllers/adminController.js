const User = require('../models/User');
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');

const getSummary = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalBookings = await Ride.countDocuments();
    const completedRidesAgg = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$fare' } } },
    ]);
    const pendingRides = await Ride.countDocuments({ status: 'pending' });
    const totalRevenue = completedRidesAgg[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalDrivers,
      totalBookings,
      pendingRides,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

const approveDriver = async (req, res, next) => {
  try {
    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    res.json(driver);
  } catch (error) {
    next(error);
  }
};

const rejectDriver = async (req, res, next) => {
  try {
    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false, isOnline: false },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    res.json(driver);
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const driver = await User.findOneAndDelete({ _id: req.params.id, role: 'driver' });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    res.json({ success: true, message: 'Driver removed successfully.' });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Ride.find()
      .populate('customer', 'name email')
      .populate('driver', 'name email')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const booking = await Ride.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: `Booking is already ${booking.status}.` });
    }

    booking.status = status;

    if (status === 'completed') {
      booking.endTime = new Date();
      if (booking.driver) {
        await User.findByIdAndUpdate(booking.driver, { isBusy: false });
      }
    }

    if (status === 'cancelled') {
      if (booking.driver) {
        await User.findByIdAndUpdate(booking.driver, { isBusy: false });
      }
    }

    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

const updateVehiclePricing = async (req, res, next) => {
  try {
    const { baseFare, ratePerKm, localPackageFare } = req.body;
    const updateData = {};

    if (baseFare !== undefined) updateData.baseFare = baseFare;
    if (ratePerKm !== undefined) updateData.ratePerKm = ratePerKm;
    if (localPackageFare !== undefined) updateData.localPackageFare = localPackageFare;

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

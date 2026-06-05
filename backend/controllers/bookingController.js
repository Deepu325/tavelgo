const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const logger = require('../utils/logger');
const { Client } = require('@googlemaps/google-maps-services-js');
const googleMapsClient = new Client({});

/**
 * @desc    Get fare estimates based on locations
 * @route   POST /api/bookings/estimate
 * @access  Private (Customer)
 */
const getEstimates = async (req, res, next) => {
  try {
    const { pickup, destination, bookingType = 'local' } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({ message: 'Pickup and destination are required.' });
    }

    // Calculate distance using Google Maps Distance Matrix API
    let distance = 5; // Fallback distance
    if (process.env.GOOGLE_MAPS_API_KEY) {
      const distanceMatrixResponse = await googleMapsClient.distancematrix({
        params: {
          origins: [pickup],
          destinations: [destination],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const element = distanceMatrixResponse.data.rows[0]?.elements[0];
      if (element && element.status === 'OK') {
        // Distance is returned in meters, convert to km
        distance = parseFloat((element.distance.value / 1000).toFixed(2));
      } else {
        logger.warn(`Google Maps API could not calculate distance: ${element?.status}`);
        distance = parseFloat((Math.random() * 25 + 5).toFixed(2));
      }
    } else {
       logger.warn('⚠️ GOOGLE_MAPS_API_KEY is not set. Using mock distance.');
       distance = parseFloat((Math.random() * 25 + 5).toFixed(2));
    }

    const vehicles = await Vehicle.find();

    const estimates = vehicles
      .filter((v) => {
        const hasLocal = v.localPackageFare && Number(v.localPackageFare) > 0;
        return bookingType === 'local' ? hasLocal : true;
      })
      .map((v) => {
        // Standard per-km fare
        const standardFare = Math.round(v.baseFare + distance * v.ratePerKm);

        // Local package info (optional)
        const hasLocal = v.localPackageFare && Number(v.localPackageFare) > 0;
        const localPackage = hasLocal
          ? {
              fare: Number(v.localPackageFare),
              // allow admin to set duration in hours via `localPackageDurationHours`, fallback to 8h
              duration: v.localPackageDurationHours ? `${v.localPackageDurationHours} hours` : '8 hours',
              info: v.localPackageInfo || v.description || '',
            }
          : null;

        return {
          vehicleId: v._id,
          name: v.name,
          type: v.type,
          capacity: v.capacity,
          description: v.description,
          distance: distance,
          fare: bookingType === 'local' && localPackage ? localPackage.fare : standardFare,
          localPackage,
        };
      });

    res.json({
      pickup,
      destination,
      distance,
      estimates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new booking and notify nearby drivers
 * @route   POST /api/bookings
 * @access  Private (Customer)
 */
const createBooking = async (req, res, next) => {
  try {
        const {
      pickupLocation,
      destination,
      vehicleType,
      fare,
      distance,
      pickupCoordinates,
      bookingType = 'local',
      tripType,
      startDate,
      returnDate,
      isLocalPackage = false,
      localPackageDuration,
    } = req.body;

    if (!pickupLocation || !destination) {
      return res.status(400).json({ message: 'Pickup and destination are required.' });
    }

    if (!vehicleType || fare === undefined || distance === undefined) {
      return res.status(400).json({ message: 'Vehicle type, fare, and distance are required.' });
    }

    if (bookingType === 'trip' && tripType === 'round-trip' && !returnDate) {
      return res.status(400).json({ message: 'Return date is required for round-trip bookings.' });
    }

    const ride = await Ride.create({
      customer: req.user.id,
      bookingType,
      tripType,
      startDate: startDate ? new Date(startDate) : undefined,
      returnDate: returnDate ? new Date(returnDate) : undefined,
      isLocalPackage,
      localPackageDuration,
      pickupLocation: {
        address: pickupLocation,
        coordinates: pickupCoordinates || { lat: 0, lng: 0 }, // Default for now
      },
      destination: { address: destination },
      vehicleType,
      fare,
      distance,
      status: 'pending',
    });

    console.log('SAVED RIDE');
    console.log({
      pickup: ride.pickupLocation,
      destination: ride.destination
    });

    // FIND NEARBY DRIVERS (Geospatial Match)
    // For now, let's look for online and not busy drivers within 10km
    // Note: In real app, pickupCoordinates would be real [lng, lat]
    const nearbyDrivers = await User.find({
      role: 'driver',
      isVerified: true,
      isOnline: true,
      isBusy: false,
      location: {
        $near: {
          $geometry: { 
            type: 'Point', 
            coordinates: [pickupCoordinates?.lng || 0, pickupCoordinates?.lat || 0] 
          },
          $maxDistance: 10000, // 10km in meters
        },
      },
    });

    // Notify drivers via Socket.IO
    const io = req.app.get('io');
    nearbyDrivers.forEach((driver) => {
      io.to(driver._id.toString()).emit('new-ride-available', ride);
    });

    res.status(201).json({
      success: true,
      ride,
      notifiedDrivers: nearbyDrivers.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept a ride (Driver)
 * @route   PATCH /api/bookings/:id/accept
 * @access  Private (Driver)
 */
const acceptRide = async (req, res, next) => {
  try {
    // Atomic update to ensure only one driver accepts
    const ride = await Ride.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { 
        status: 'accepted', 
        driver: req.user.id,
        startTime: new Date()
      },
      { new: true }
    ).populate('customer', 'name phone');

    if (!ride) {
      return res.status(400).json({ message: 'Ride no longer available or already accepted.' });
    }

    // Update driver status
    await User.findByIdAndUpdate(req.user.id, { isBusy: true });

    // Notify Customer via Socket.IO
    const io = req.app.get('io');
    io.to(ride.customer._id.toString()).emit('ride-accepted', {
      rideId: ride._id,
      driverName: req.user.name,
      status: 'accepted'
    });

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update ride status (ongoing, completed, cancelled)
 * @route   PATCH /api/bookings/:id/status
 * @access  Private
 */
const updateRideStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['ongoing', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    // State validation
    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ message: `Ride is already ${ride.status}` });
    }
    
    if (status === 'cancelled' && ride.status !== 'pending' && ride.status !== 'accepted') {
      return res.status(400).json({ message: 'Cannot cancel an ongoing ride' });
    }

    ride.status = status;
    if (status === 'completed') {
      ride.endTime = new Date();
      // Free the driver
      await User.findByIdAndUpdate(ride.driver, { isBusy: false });
    }
    if (status === 'cancelled') {
      await User.findByIdAndUpdate(ride.driver, { isBusy: false });
    }
    
    await ride.save();

    // Notify the other party via Socket.IO
    const io = req.app.get('io');
    const targetRoom = req.user.role === 'driver' ? ride.customer.toString() : ride.driver.toString();
    io.to(targetRoom).emit('ride-status-updated', { rideId: ride._id, status });

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Driver Location & Status
 * @route   PATCH /api/bookings/driver-status
 * @access  Private (Driver)
 */
const updateDriverStatus = async (req, res, next) => {
  try {
    const { lat, lng, isOnline } = req.body;
    
    const updateData = {};
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (lat !== undefined && lng !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.json({ success: true, isOnline: user.isOnline, location: user.location });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending rides (for drivers) - Fallback if socket misses
 */
const getPendingRides = async (req, res, next) => {
  try {
    // In production, we'd only show rides near the driver
    // For now, show all pending for simplicity in testing
    const rides = await Ride.find({ status: 'pending' })
      .populate('customer', 'name phone')
      .sort('-createdAt');
    res.json(rides);
  } catch (error) {
    next(error);
  }
};

const getActiveRide = async (req, res, next) => {
  try {
    const query = req.user.role === 'driver' 
      ? { driver: req.user.id, status: { $in: ['accepted', 'ongoing'] } }
      : { 
          customer: req.user.id, 
          $or: [
            { status: { $in: ['pending', 'accepted', 'ongoing'] } },
            { status: 'completed', paymentStatus: 'pending' }
          ]
        };

    const ride = await Ride.findOne(query)
      .populate('driver', 'name phone location')
      .populate('customer', 'name phone');

    console.log('ACTIVE RIDE RESPONSE');
    console.log({
      pickup: ride?.pickupLocation,
      destination: ride?.destination
    });

    res.json(ride || null);
  } catch (error) {
    next(error);
  }
};

const getUserHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'driver' 
      ? { driver: req.user.id, status: 'completed' }
      : { customer: req.user.id };

    const rides = await Ride.find(query)
      .populate('driver', 'name')
      .populate('customer', 'name')
      .sort('-createdAt');

    res.json(rides);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEstimates,
  createBooking,
  getPendingRides,
  acceptRide,
  updateRideStatus,
  getActiveRide,
  getUserHistory,
  updateDriverStatus
};

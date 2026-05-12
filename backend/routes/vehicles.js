const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// @route   GET /api/vehicles
// @desc    Get all available vehicle types
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

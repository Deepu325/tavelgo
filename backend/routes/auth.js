const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });
const registerUpload = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    upload.fields([
      { name: 'driverPhoto', maxCount: 1 },
      { name: 'vehiclePhoto', maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return next(err);
      }
      register(req, res, next);
    });
  } else {
    register(req, res, next);
  }
};

// @route   POST /api/auth/register
router.post('/register', registerUpload);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me (protected)
router.get('/me', authMiddleware, getMe);

module.exports = router;

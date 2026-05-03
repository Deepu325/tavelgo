const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    jwt.sign(payload, secret, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    jwt.sign(payload, secret, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

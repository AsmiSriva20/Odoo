const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash: hash });
    await newUser.save();

    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const authMiddleware = require('../middleware/authMiddleware');

const Product = require('../models/Product'); // ✅ Add this at the top

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const listings = await Product.find({ userId: req.user.id });

    res.json({
      name: user.name,
      points: user.points || 0,
      listings, // ✅ send back listings array
      swaps: user.swaps || [], // optional, if swaps are stored in user
    });
  } catch (err) {
    console.error('Profile route error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;

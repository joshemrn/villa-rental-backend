const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Admin middleware check
router.use(auth, adminOnly);

// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify property
router.put('/properties/:id/verify', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { verified: true, updatedAt: Date.now() },
      { new: true }
    );
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('propertyId guestId ownerId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

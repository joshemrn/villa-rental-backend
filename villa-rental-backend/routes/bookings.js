const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

const router = express.Router();

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    const totalPrice = numberOfNights * property.pricePerNight;
    const serviceFee = totalPrice * 0.1; // 10% service fee
    const taxes = (totalPrice + serviceFee) * 0.07; // 7% tax

    const booking = new Booking({
      propertyId,
      guestId: req.user.id,
      ownerId: property.owner,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice: totalPrice + serviceFee + taxes,
      pricePerNight: property.pricePerNight,
      numberOfNights,
      serviceFee,
      taxes,
      specialRequests
    });

    await booking.save();
    const populated = await booking.populate('propertyId guestId ownerId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings (guest)
router.get('/guest/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { guestId: req.user.id };

    if (status) {
      filter.status = status;
    }

    const normalizedPage = parsePositiveInt(page, 1);
    const normalizedLimit = Math.min(parsePositiveInt(limit, 20), 100);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .populate('propertyId ownerId'),
      Booking.countDocuments(filter)
    ]);

    res.json({
      data: bookings,
      pagination: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: Math.ceil(total / normalizedLimit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings (owner)
router.get('/owner/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { ownerId: req.user.id };

    if (status) {
      filter.status = status;
    }

    const normalizedPage = parsePositiveInt(page, 1);
    const normalizedLimit = Math.min(parsePositiveInt(limit, 20), 100);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .populate('propertyId guestId'),
      Booking.countDocuments(filter)
    ]);

    res.json({
      data: bookings,
      pagination: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: Math.ceil(total / normalizedLimit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId guestId ownerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (
      booking.ownerId.toString() !== req.user.id &&
      booking.guestId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.ownerId.toString() !== req.user.id && booking.guestId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.guestId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.updatedAt = Date.now();
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

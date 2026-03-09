const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

const router = express.Router();

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

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId guestId ownerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings (guest)
router.get('/guest/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.user.id }).populate('propertyId ownerId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings (owner)
router.get('/owner/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id }).populate('propertyId guestId');
    res.json(bookings);
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

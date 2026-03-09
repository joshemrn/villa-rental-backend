const express = require('express');
const Review = require('../models/Review');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, bookingId, rating, title, comment, cleanliness, communication, checkIn, accuracy, location, value } = req.body;

    const review = new Review({
      propertyId,
      guestId: req.user.id,
      bookingId,
      rating,
      title,
      comment,
      cleanliness,
      communication,
      checkIn,
      accuracy,
      location,
      value
    });

    await review.save();

    // Update property rating
    const allReviews = await Review.find({ propertyId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Property.findByIdAndUpdate(propertyId, {
      rating: avgRating,
      totalReviews: allReviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .populate('guestId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

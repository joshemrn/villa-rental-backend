const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: { type: String, default: 'Orlando' },
    state: { type: String, default: 'FL' },
    zipCode: String,
    latitude: Number,
    longitude: Number
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  rules: [String],
  cancellationPolicy: String,
  rating: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availability: [{
    startDate: Date,
    endDate: Date,
    available: Boolean
  }],
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);

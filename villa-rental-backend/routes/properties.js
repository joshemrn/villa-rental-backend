const express = require('express');
const Property = require('../models/Property');
const { auth, ownerOnly } = require('../middleware/auth');

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, sort } = req.query;
    let filter = { active: true, verified: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice) filter.pricePerNight = { $gte: parseInt(minPrice) };
    if (maxPrice) {
      filter.pricePerNight = filter.pricePerNight || {};
      filter.pricePerNight.$lte = parseInt(maxPrice);
    }
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };

    let query = Property.find(filter);

    if (sort === 'price-low') query = query.sort({ pricePerNight: 1 });
    else if (sort === 'price-high') query = query.sort({ pricePerNight: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });

    const properties = await query.populate('owner', 'firstName lastName profilePhoto');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create property (owner only)
router.post('/', auth, ownerOnly, async (req, res) => {
  try {
    const { title, description, location, pricePerNight, bedrooms, bathrooms, maxGuests, amenities, images, rules, cancellationPolicy } = req.body;

    const property = new Property({
      owner: req.user.id,
      title,
      description,
      location: {
        ...location,
        city: location.city || 'Orlando',
        state: location.state || 'FL'
      },
      pricePerNight,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      images,
      rules,
      cancellationPolicy
    });

    await property.save();
    const populated = await property.populate('owner');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update property (owner only)
router.put('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(property, req.body);
    property.updatedAt = Date.now();
    await property.save();

    const updated = await property.populate('owner');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete property (owner only)
router.delete('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.deleteOne({ _id: req.params.id });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get owner's properties
router.get('/owner/my-properties', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

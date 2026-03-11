const express = require('express');
const Property = require('../models/Property');
const { auth, ownerOnly } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_HOME_FEATURED_LIMIT = 6;

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const buildPropertySort = (sort) => {
  const sortMap = {
    'price-low': { pricePerNight: 1 },
    'price-high': { pricePerNight: -1 },
    rating: { rating: -1, reviewCount: -1 },
    newest: { createdAt: -1 }
  };

  return sortMap[sort] || { createdAt: -1 };
};

// Homepage featured properties
router.get('/homepage/featured', async (req, res) => {
  try {
    const limit = parsePositiveInt(req.query.limit, DEFAULT_HOME_FEATURED_LIMIT);

    const featuredProperties = await Property.find({
      active: true,
      verified: true,
      featured: true
    })
      .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
      .limit(limit)
      .populate('owner', 'firstName lastName profilePhoto');

    res.json(featuredProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      maxGuests,
      featured,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const filter = { active: true, verified: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms, 10) };
    if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms, 10) };
    if (maxGuests) filter.maxGuests = { $gte: parseInt(maxGuests, 10) };
    if (featured === 'true') filter.featured = true;

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseInt(minPrice, 10);
      if (maxPrice) filter.pricePerNight.$lte = parseInt(maxPrice, 10);
    }

    const normalizedPage = parsePositiveInt(page, 1);
    const normalizedLimit = Math.min(parsePositiveInt(limit, 20), 100);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort(buildPropertySort(sort))
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .populate('owner', 'firstName lastName profilePhoto'),
      Property.countDocuments(filter)
    ]);

    res.json({
      data: properties,
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

// Get owner's properties
router.get('/owner/my-properties', auth, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });
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
    const {
      title,
      description,
      location,
      pricePerNight,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      images,
      rules,
      cancellationPolicy,
      featured
    } = req.body;

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
      cancellationPolicy,
      featured: Boolean(featured)
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

module.exports = router;

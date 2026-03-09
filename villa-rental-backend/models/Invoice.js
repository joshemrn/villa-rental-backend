const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  subtotal: Number,
  taxes: Number,
  serviceFee: Number,
  total: Number,
  issuedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid'],
    default: 'draft'
  },
  pdfUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);

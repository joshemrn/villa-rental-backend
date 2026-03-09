const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  contractNumber: {
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
  terms: {
    type: String,
    required: true
  },
  cancellationPolicy: String,
  customTerms: String,
  signature: {
    guestSignature: String,
    guestSignatureDate: Date,
    ownerSignature: String,
    ownerSignatureDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'guest-signed', 'owner-signed', 'fully-signed', 'rejected'],
    default: 'pending'
  },
  pdfUrl: String,
  signatureLink: String,
  expiryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contract', contractSchema);

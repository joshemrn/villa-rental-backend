const express = require('express');
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { generateInvoicePDF } = require('../services/pdfService');
const { sendInvoiceEmail } = require('../services/emailService');

const router = express.Router();

// Create and send invoice
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('propertyId guestId ownerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.ownerId._id.toString() !== req.user.id && booking.guestId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const invoiceNumber = `INV-${Date.now()}-${booking._id.toString().slice(-4)}`;

    const invoiceData = {
      bookingId,
      invoiceNumber,
      guestId: booking.guestId._id,
      ownerId: booking.ownerId._id,
      propertyId: booking.propertyId._id,
      items: [
        {
          description: `${booking.propertyId.title} - ${booking.numberOfNights} nights`,
          quantity: booking.numberOfNights,
          unitPrice: booking.pricePerNight,
          total: booking.numberOfNights * booking.pricePerNight
        },
        {
          description: 'Service Fee',
          quantity: 1,
          unitPrice: booking.serviceFee,
          total: booking.serviceFee
        }
      ],
      subtotal: booking.numberOfNights * booking.pricePerNight,
      serviceFee: booking.serviceFee,
      taxes: booking.taxes,
      total: booking.totalPrice,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'sent'
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // Generate PDF
    const pdfPath = await generateInvoicePDF(invoice, booking);
    invoice.pdfUrl = pdfPath;
    await invoice.save();

    // Send email
    await sendInvoiceEmail(booking.guestId.email, invoice, pdfPath);

    booking.invoiceSent = true;
    booking.invoiceSentDate = Date.now();
    await booking.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({
      $or: [
        { guestId: req.user.id },
        { ownerId: req.user.id }
      ]
    }).populate('bookingId propertyId guestId ownerId');

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('bookingId propertyId guestId ownerId');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.status = 'viewed';
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

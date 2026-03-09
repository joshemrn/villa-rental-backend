const express = require('express');
const Contract = require('../models/Contract');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { generateContractPDF } = require('../services/pdfService');
const { sendContractEmail } = require('../services/emailService');

const router = express.Router();

// Create and send contract
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, customTerms } = req.body;

    const booking = await Booking.findById(bookingId).populate('propertyId guestId ownerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can send contracts' });
    }

    const contractNumber = `CONTRACT-${Date.now()}-${booking._id.toString().slice(-4)}`;

    const defaultTerms = `
Rental Agreement for ${booking.propertyId.title}

Check-in Date: ${new Date(booking.checkInDate).toLocaleDateString()}
Check-Out Date: ${new Date(booking.checkOutDate).toLocaleDateString()}
Number of Guests: ${booking.numberOfGuests}
Total Price: $${booking.totalPrice}

Terms and Conditions:
1. Guest agrees to abide by all house rules
2. Guest is responsible for any damage to the property
3. Quiet hours from 10 PM to 8 AM
4. No parties or large gatherings
5. Smoking is strictly prohibited
6. Pets are not allowed (unless specified)
`;

    const contractData = {
      bookingId,
      contractNumber,
      guestId: booking.guestId._id,
      ownerId: booking.ownerId._id,
      propertyId: booking.propertyId._id,
      terms: defaultTerms,
      cancellationPolicy: booking.propertyId.cancellationPolicy,
      customTerms,
      status: 'sent',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    const contract = new Contract(contractData);
    await contract.save();

    // Generate PDF
    const pdfPath = await generateContractPDF(contract, booking);
    contract.pdfUrl = pdfPath;
    contract.signatureLink = `${process.env.FRONTEND_URL}/sign-contract/${contract._id}`;
    await contract.save();

    // Send email
    await sendContractEmail(booking.guestId.email, contract, pdfPath);

    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contracts
router.get('/', auth, async (req, res) => {
  try {
    const contracts = await Contract.find({
      $or: [
        { guestId: req.user.id },
        { ownerId: req.user.id }
      ]
    }).populate('bookingId propertyId guestId ownerId');

    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contract by ID
router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('bookingId propertyId guestId ownerId');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sign contract
router.post('/:id/sign', async (req, res) => {
  try {
    const { signature, signedBy } = req.body; // signedBy: 'guest' or 'owner'

    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (signedBy === 'guest') {
      contract.signature.guestSignature = signature;
      contract.signature.guestSignatureDate = Date.now();
      contract.status = contract.signature.ownerSignature ? 'fully-signed' : 'guest-signed';
    } else if (signedBy === 'owner') {
      contract.signature.ownerSignature = signature;
      contract.signature.ownerSignatureDate = Date.now();
      contract.status = contract.signature.guestSignature ? 'fully-signed' : 'owner-signed';
    }

    if (contract.status === 'fully-signed') {
      const booking = await Booking.findById(contract.bookingId);
      booking.contractSigned = true;
      booking.contractSignedDate = Date.now();
      await booking.save();
    }

    await contract.save();
    res.json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

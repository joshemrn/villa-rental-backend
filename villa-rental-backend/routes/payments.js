const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.guestId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: { bookingId: bookingId.toString() }
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      booking.paymentStatus = 'completed';
      booking.stripePaymentIntentId = paymentIntentId;
      booking.status = 'confirmed';
      await booking.save();

      res.json({
        message: 'Payment successful',
        booking,
        paymentStatus: 'completed'
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Webhook for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const booking = await Booking.findById(paymentIntent.metadata.bookingId);

      if (booking) {
        booking.paymentStatus = 'completed';
        booking.status = 'confirmed';
        await booking.save();
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

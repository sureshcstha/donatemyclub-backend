const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');

// Stripe webhook route
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const existing = await Donation.findOne({ paymentIntentId: pi.id });

    if (!existing) {
      const donation = new Donation({
          clubId: pi.metadata.clubId,
          donorFirstName: pi.metadata.donorFirstName,
          donorLastName: pi.metadata.donorLastName,
          donorEmail: pi.metadata.donorEmail,
          amount: pi.amount / 100,
          date: new Date(),
          paymentIntentId: pi.id,
      });

      try {
        await donation.save();
      } catch (err) {
        console.error('Error saving donation:', err);
      }
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;

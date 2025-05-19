const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Club = require('../models/Club');
const Donation = require('../models/Donation');

// Create payment intent
exports.createDonationIntent = async (req, res) => {
  const { clubId } = req.params;
  const { amount, donorFirstName, donorLastName, donorEmail } = req.body;

  const club = await Club.findOne({ id: clubId });
  if (!club) return res.status(404).json({ error: 'Club not found' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: {
        clubId,
        donorFirstName,
        donorLastName,
        donorEmail,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe error' });
  }
};

// Get donations for a club
exports.getDonationsForClub = async (req, res) => {
  const clubId = req.params.clubId;

  try {
    const donations = await Donation.find({ clubId });
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      totalAmount,
      donationCount: donations.length,
      donations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

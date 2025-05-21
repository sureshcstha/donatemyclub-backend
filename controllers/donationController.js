const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Club = require('../models/Club');
const Donation = require('../models/Donation');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

// Function to sanitize inputs
const sanitizeInput = (input) => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

// Create payment intent
exports.createDonationIntent = async (req, res) => {
  // Sanitize clubId from params
  const clubId = sanitizeInput(req.params.clubId);
    
  // Sanitize body inputs
  const amountRaw = req.body.amount;
  const donorFirstName = sanitizeInput(req.body.donorFirstName);
  const donorLastName = sanitizeInput(req.body.donorLastName);
  const donorEmail = sanitizeInput(req.body.donorEmail);

  // Validate amount
  if (!amountRaw || !validator.isFloat(amountRaw.toString(), { gt: 0 })) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  // Limit to 2 decimal places
  const amount = parseFloat(parseFloat(amountRaw).toFixed(2));

  // Validate email format
  if (!donorEmail || !validator.isEmail(donorEmail)) {
    return res.status(400).json({ error: 'Invalid donor email' });
  }

  const club = await Club.findOne({ id: clubId });
  if (!club) return res.status(404).json({ error: 'Club not found' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents and ensure the result is an integer
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
    const donations = await Donation.find({ clubId }).sort({ date: -1 });
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

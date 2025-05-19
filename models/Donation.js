const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  clubId: String,
  donorFirstName: { type: String, maxlength: 50 },
  donorLastName: { type: String, maxlength: 50 },
  donorEmail: String,
  amount: Number,
  date: Date,
  paymentIntentId: String,
});

module.exports = mongoose.model('Donation', DonationSchema);

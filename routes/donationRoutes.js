const express = require('express');
const router = express.Router();
const {
  createDonationIntent,
  getDonationsForClub
} = require('../controllers/donationController');

router.post('/:clubId/donate', createDonationIntent);
router.get('/:clubId/donations', getDonationsForClub);

module.exports = router;

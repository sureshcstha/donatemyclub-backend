const express = require('express');
const router = express.Router();
const {
  createDonationIntent,
  getDonationsForClub
} = require('../controllers/donationController');
const authenticateApiKey = require("../middleware/authenticateApiKey");
const authorize = require("../middleware/authorize");

router.post('/:clubId/donate', authenticateApiKey, authorize(["admin", "superadmin"]), createDonationIntent);
router.get('/:clubId/donations', authenticateApiKey, authorize(["admin", "superadmin"]), getDonationsForClub);

module.exports = router;

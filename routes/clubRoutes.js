const express = require('express');
const router = express.Router();
const {
  createClub,
  getAllClubs,
  getClubById,
  searchClubs,
  updateClub,
  deleteClub
} = require('../controllers/clubController');
const authenticateApiKey = require("../middleware/authenticateApiKey");
const authorize = require("../middleware/authorize");

router.post('/', authenticateApiKey, authorize(["superadmin"]), createClub);
router.get('/search', authenticateApiKey, authorize(["admin", "superadmin"]),  searchClubs);
router.get('/', authenticateApiKey, authorize(["admin", "superadmin"]), getAllClubs);
router.get('/:clubId', authenticateApiKey, authorize(["admin", "superadmin"]), getClubById);
router.put('/:clubId', authenticateApiKey, authorize(["superadmin"]), updateClub);
router.delete('/:clubId', authenticateApiKey, authorize(["superadmin"]), deleteClub);

module.exports = router;

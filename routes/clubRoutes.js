const express = require('express');
const router = express.Router();
const {
  createClub,
  getAllClubs,
  getClubById,
  searchClubs
} = require('../controllers/clubController');

router.post('/', createClub);
router.get('/search', searchClubs);
router.get('/', getAllClubs);
router.get('/:clubId', getClubById);

module.exports = router;

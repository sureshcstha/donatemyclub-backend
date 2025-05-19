const express = require('express');
const router = express.Router();
const {
  createClub,
  getAllClubs,
  getClubById
} = require('../controllers/clubController');

router.post('/', createClub);
router.get('/', getAllClubs);
router.get('/:clubId', getClubById);

module.exports = router;

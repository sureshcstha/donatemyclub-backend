const Club = require('../models/Club');
const sanitizeHtml = require('sanitize-html');

// Function to sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
};

// Create a club
exports.createClub = async (req, res) => {
  let { id, name, description } = req.body;

  id = sanitizeInput(id);
  name = sanitizeInput(name);
  description = sanitizeInput(description);

  try {
    const existing = await Club.findOne({ id });
    if (existing) return res.status(400).json({ error: 'Club ID already exists' });

    const newClub = new Club({ id, name, description });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (err) {
    console.error('Error creating club:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// List all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get single club info
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findOne({ id: req.params.clubId });
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

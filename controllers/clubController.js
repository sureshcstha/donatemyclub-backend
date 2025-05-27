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

// Search clubs by name or description
exports.searchClubs = async (req, res) => {
  try {
    let { query } = req.query;  // search query is passed as a query param `?query=...`
    query = sanitizeInput(query);

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // case-insensitive regex search on name and description fields
    const regex = new RegExp(query, 'i');
    const clubs = await Club.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    });

    res.json(clubs);
  } catch (err) {
    console.error('Error searching clubs:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update a club by ID
exports.updateClub = async (req, res) => {
  let { id: newId, name, description } = req.body;

  newId = sanitizeInput(newId);
  name = sanitizeInput(name);
  description = sanitizeInput(description);

  try {
    const club = await Club.findOne({ id: req.params.clubId });
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    // If the new ID is different, check for uniqueness
    if (newId && newId !== club.id) {
      const idExists = await Club.findOne({ id: newId });
      if (idExists) {
        return res.status(400).json({ error: 'New Club ID already exists' });
      }
      club.id = newId;
    }

    // Update name and description
    if (name) club.name = name;
    if (description) club.description = description;

    await club.save();

    res.json({
      message: 'Club updated successfully',
      club
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a club by ID
exports.deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClub = await Club.findOneAndDelete(id);

    if (!deletedClub) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json({ message: 'Club deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  id: { type: String, maxlength: 50, required: true, unique: true },
  name: { type: String, maxlength: 50 },
  description: { type: String, maxlength: 1000 },
});

module.exports = mongoose.model('Club', ClubSchema);

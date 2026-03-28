const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completion: { type: Date, required: true },
  description: { type: String, default: '', trim: true },
});

module.exports = mongoose.model('Project', projectSchema);

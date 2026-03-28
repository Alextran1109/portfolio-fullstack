const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  position: { type: String, default: '', trim: true },
  company: { type: String, default: '', trim: true },
});

module.exports = mongoose.model('Reference', referenceSchema);

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  source: String,
  link: String,
  relevance: String,
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema); 
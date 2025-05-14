const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  forbidden: [{ type: String, required: true }],
  color: { type: String, default: '#e2e8f0' },
  talim: { type: String, default: '' }
});

const cardSetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  cards: [cardSchema],
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CardSet', cardSetSchema); 
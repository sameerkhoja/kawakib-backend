const express = require('express');
const router = express.Router();
const CardSet = require('../models/CardSet');

// Get all card sets
router.get('/', async (req, res) => {
  try {
    const cardSets = await CardSet.find();
    res.json(cardSets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get active card set
router.get('/active', async (req, res) => {
  try {
    const activeSet = await CardSet.findOne({ isActive: true });
    res.json(activeSet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new card set
router.post('/', async (req, res) => {
  const cardSet = new CardSet({
    name: req.body.name,
    description: req.body.description,
    cards: req.body.cards
  });

  try {
    const newCardSet = await cardSet.save();
    res.status(201).json(newCardSet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a card set
router.put('/:id', async (req, res) => {
  try {
    const cardSet = await CardSet.findById(req.params.id);
    if (!cardSet) {
      return res.status(404).json({ message: 'Card set not found' });
    }

    if (req.body.name) cardSet.name = req.body.name;
    if (req.body.description) cardSet.description = req.body.description;
    if (req.body.cards) cardSet.cards = req.body.cards;
    if (req.body.isActive !== undefined) {
      if (req.body.isActive) {
        // Deactivate all other sets
        await CardSet.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
      }
      cardSet.isActive = req.body.isActive;
    }

    cardSet.updatedAt = Date.now();
    const updatedCardSet = await cardSet.save();
    res.json(updatedCardSet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a card set
router.delete('/:id', async (req, res) => {
  try {
    const cardSet = await CardSet.findById(req.params.id);
    if (!cardSet) {
      return res.status(404).json({ message: 'Card set not found' });
    }

    await cardSet.remove();
    res.json({ message: 'Card set deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 
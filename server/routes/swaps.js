const express = require('express');
const SwapCreate = require('../models/SwapCreate');
const SwapAccept = require('../models/SwapAccept');
// const authMiddleware = require('../middleware/authMiddleware'); // Uncomment to protect routes
const router = express.Router();

// Get all swaps
router.get('/', async (req, res) => {
  try {
    const swaps = await SwapCreate.find();
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get swap by ID
router.get('/:id', async (req, res) => {
  try {
    const swap = await SwapCreate.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create swap
router.post('/', /*authMiddleware,*/ async (req, res) => {
  try {
    const newSwap = new SwapCreate(req.body);
    await newSwap.save();
    res.status(201).json(newSwap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept swap
router.post('/:id/accept', /*authMiddleware,*/ async (req, res) => {
  try {
    const swap = await SwapCreate.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });
    const accept = new SwapAccept({ ...req.body, swapId: swap._id });
    await accept.save();
    res.status(201).json(accept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
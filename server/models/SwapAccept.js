// models/SwapAccept.js
const mongoose = require('mongoose');
const SwapCreate = require('./SwapCreate'); // Import SwapCreate model
const SwapAcceptSchema = new mongoose.Schema({
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapCreate',
    required: true,
    unique: true,
  },
  isResponded: {
    type: Boolean,
    default: false,
  },
  accepted: {
    type: Boolean, // true for accepted, false for rejected
  },
  respondedAt: {
    type: Date,
  },
  notes: {
    type: String,
  }
});

module.exports = mongoose.model('SwapAccept', SwapAcceptSchema);
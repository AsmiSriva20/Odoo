const mongoose = require('mongoose');
const User = require('./User'); // Import User model    
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    default: 1000
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Product', ProductSchema);
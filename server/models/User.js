const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  isAdmin: { type: Boolean, default: false },
  points: { type: Number, default: 100 }
});

module.exports = mongoose.model('User', UserSchema);

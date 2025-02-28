const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  openid: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
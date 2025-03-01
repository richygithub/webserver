const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  openid: { type: String, required: true, unique: true },
  realName: String,
  idCard: String,
  phone: String,
  nickname: String,
  travelers: [{
    name: String,
    idCard: String
  }]
});

module.exports = mongoose.model('User', UserSchema);
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  openid: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
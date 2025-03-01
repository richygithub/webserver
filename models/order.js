// models/order.js
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: String,
    travelers: [{
      name: String,
      idCard: String
    }],
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'expired'], default: 'pending' },
    expireAt: { type: Date, expires: 1800 } // 30分钟过期
  });

  module.exports = mongoose.model('Order', OrderSchema);
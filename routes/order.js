const express = require('express');
//const Course = require('../models/');
const router = express.Router();

// 获取课程列表
// routes/order.js
router.post('/orders', async (req, res) => {
  try {
    const { courseId, travelers, openid } = req.body;
    
    // 1. 验证用户
    const user = await User.findOne({ openid });
    if (!user) return res.status(403).json({ code: 403 });

    // 2. 创建订单
    const newOrder = new Order({
      userId: user._id,
      courseId,
      travelers,
      amount: await getCoursePrice(courseId),
      expireAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    // 3. 微信支付预处理
    const paymentParams = await wxpay.createOrder({
      amount: newOrder.amount,
      description: `课程购买：${courseId}`
    });

    await newOrder.save();
    res.json({ ...paymentParams, orderId: newOrder._id });
  } catch (err) {
    handleError(res, err);
  }
});
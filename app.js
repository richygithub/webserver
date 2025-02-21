const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 连接 MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 路由
app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
app.use('/payment', require('./routes/payment'));

// 启动服务
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
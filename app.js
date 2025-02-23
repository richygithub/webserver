const express = require('express');
const mongoose = require('mongoose');
const https = require('https')
const fs = require('fs')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('./key_unencrypted.pem'),
  cert: fs.readFileSync('./cert.pem')
};

// 中间件
app.use(express.json());

const dburl="mongodb://127.0.0.1:27017"
// 连接 MongoDB
mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 路由
app.use('/login', require('./routes/login'));
app.use('/courses', require('./routes/courses'));
app.use('/pay', require('./routes/pay'));

// 启动服务
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
https.createServer(options,app).listen(443,()=>{
  console.log("HttpServer running 443")
})
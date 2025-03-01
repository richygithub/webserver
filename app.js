const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const https = require('https')
const fs = require('fs')
require('dotenv').config();
console.log(process.env.WX_APPID)

const tokenManager = require('./models/accessToken');
//import tokenManager from './models/accessToken';

const app = express();
const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('./key_unencrypted.pem'),
  cert: fs.readFileSync('./cert.pem')
};

app.use(cors()) // 解决跨域问题
app.use(express.json()) // 解析JSON请求体
app.use(express.urlencoded({ extended: true })) // 解析表单数据


app.get('/', (req, res) => {
  res.status(200).json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})


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
app.use('/order', require('./routes/order'));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
})

// 启动服务
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
https.createServer(options,app).listen(443,()=>{
  console.log("HttpServer running 443")
})
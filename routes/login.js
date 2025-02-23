const express = require('express');
const Course = require('../models/login');
//const User = require('../models/user');


const router = express.Router();


// import User from './User.js';

// export const wechatLogin = async (req, res) => {
//   const { code, encryptedData, iv } = req.body;
  
//   // 获取 session_key
//   const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WX_APPID}&secret=${process.env.WX_SECRET}&js_code=${code}&grant_type=authorization_code`);
//   const { openid, session_key } = await wxRes.json();

//   // 解密手机号
//   const decoded = decryptData(encryptedData, iv, session_key);
  
//   // 保存用户
//   const user = await User.findOneAndUpdate(
//     { openid },
//     { phone: decoded.phoneNumber },
//     { upsert: true, new: true }
//   );

//   res.json({ openid: user.openid });
// };

// 获取课程列表

const APPID = "wx3fe83214ac530667"
const AppSecret="f5d03a4c0c77db2a591c93b1c8994a9d"

router.post('/', async (req, res) => {
    console.log(" login -- ");
    console.log(req.body)
    const { code, encryptedData, iv } = req.body;
    
    // 获取 session_key
    const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`);
    const { openid, session_key } = await wxRes.json();

    //access_token
    const res_token = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${AppSecret}`);
    const res_json = await res_token.json();
    // 解密手机号
    //const decoded = decryptData(encryptedData, iv, session_key);
    console.log("receive openId:",openid)
    console.log("receive sessionkey:",session_key)
    console.log("access_token",res_json) 
    // 保存用户
    // const user = await User.findOneAndUpdate(
    //   { openid },
    //   { phone: decoded.phoneNumber },
    //   { upsert: true, new: true }
    // );
  
    res.json({ data:1});
});

module.exports = router;
const User = require('./user')

module.exports= async (req, res) => {
  const { code, encryptedData, iv } = req.body;
  
  // 获取 session_key
  const wxRes = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WX_APPID}&secret=${process.env.WX_SECRET}&js_code=${code}&grant_type=authorization_code`);
  const { openid, session_key } = await wxRes.json();

  // 解密手机号
  const decoded = decryptData(encryptedData, iv, session_key);
  
  // 保存用户
  const user = await User.findOneAndUpdate(
    { openid },
    { phone: decoded.phoneNumber },
    { upsert: true, new: true }
  );

  res.json({ openid: user.openid });
};
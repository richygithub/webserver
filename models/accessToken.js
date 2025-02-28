
// utils/wechatTokenManager.js
//import mongoose from 'mongoose';
//import axios from 'axios';
const mongoose = require('mongoose');
const axios = require('axios')

// 定义 MongoDB 数据模型
const TokenSchema = new mongoose.Schema({
  appId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const AccessToken = mongoose.model('AccessToken', TokenSchema);

class WechatTokenManager {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.accessToken = null;
    this.expiresAt = null;
    this.refreshLock = null; // 刷新锁防止并发请求
    this.refreshMargin = 300; // 提前5分钟刷新
  }

  // 主入口：获取有效 token
  async getAccessToken() {
    // 首次运行或内存中没有 token
    if (!this.accessToken || !this.expiresAt) {
      await this.initializeFromDB();
    }

    // 检查 token 是否即将过期
    if (Date.now() >= this.expiresAt - this.refreshMargin * 1000) {
      await this.refreshToken();
    }

    return this.accessToken;
  }

  // 初始化：从数据库加载
  async initializeFromDB() {
    try {
      const tokenDoc = await AccessToken.findOne({ appId: this.appId });
      if (tokenDoc && tokenDoc.expiresAt > new Date()) {
        this.accessToken = tokenDoc.accessToken;
        this.expiresAt = tokenDoc.expiresAt.getTime();
        console.log('Loaded token from DB');
      } else {
        await this.refreshToken();
      }
    } catch (error) {
      console.error('DB初始化失败，重新获取Token:', error);
      await this.refreshToken();
    }
  }

  // 刷新 Token 核心逻辑
  async refreshToken() {
    // 加锁防止并发请求
    if (this.refreshLock) {
      return this.refreshLock;
    }

    try {
      this.refreshLock = new Promise(async (resolve, reject) => {
        try {
          console.log('正在刷新微信AccessToken...');
          
          // 请求微信接口
          const response = await axios.get(
            'https://api.weixin.qq.com/cgi-bin/token',
            {
              params: {
                grant_type: 'client_credential',
                appid: this.appId,
                secret: this.appSecret
              }
            }
          );

          if (response.data.errcode) {
            throw new Error(`微信接口错误: ${response.data.errmsg}`);
          }

          // 更新内存状态
          this.accessToken = response.data.access_token;
          this.expiresAt = Date.now() + (response.data.expires_in * 1000);

          // 持久化到数据库
          await this.saveToDB();

          console.log('Token刷新成功');
          resolve();
        } catch (error) {
          console.error('Token刷新失败:', error);
          reject(error);
        } finally {
          this.refreshLock = null;
        }
      });

      return this.refreshLock;
    } catch (error) {
      this.refreshLock = null;
      throw error;
    }
  }

  // 保存到数据库
  async saveToDB() {
    try {
      await AccessToken.updateOne(
        { appId: this.appId },
        {
          appId: this.appId,
          accessToken: this.accessToken,
          expiresAt: new Date(this.expiresAt)
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('保存Token到数据库失败:', error);
      throw error;
    }
  }

  // 定时刷新检查（可选）
  startAutoRefresh() {
    setInterval(() => {
      if (Date.now() >= this.expiresAt - this.refreshMargin * 1000) {
        this.refreshToken();
      }
    }, 60000); // 每分钟检查一次
  }
}

// 单例模式使用示例
const tokenManager = new WechatTokenManager(
  process.env.WX_APPID,
  process.env.WX_SECRET
);

// 启动时自动初始化
tokenManager.getAccessToken().catch(console.error);

// 可选：启动定时检查
tokenManager.startAutoRefresh();

module.exports = tokenManager
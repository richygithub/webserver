const express = require('express');
//const Course = require('../models/');
const router = express.Router();

// 获取课程列表
router.get('/', async (req, res) => {
  try {
    
    res.json({});
  } catch (err) {
    res.status(500).json({ error: '获取课程失败' });
  }
});

module.exports = router;
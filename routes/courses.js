const express = require('express');
const Course = require('../models/course');
const router = express.Router();

// 获取课程列表
router.get('/courses', async (req, res) => {
  try {
    // const courses = await Course.find();
    // res.json(courses);

    const camps = [
      {
        id: 1,
        image: 'https://example.com/image1.jpg',
        title: '广州市铁一中学番禺校区高三11班 鼎湖山春季研学营',
        description: '问鼎征途 • 决战高考'
      },
      {
        id: 2,
        image: 'https://example.com/image2.jpg',
        title: '广州市铁一中学番禺校区高三12班 鼎湖山春季研学营',
        description: '问鼎征途 • 决战高考'
      },
      // ... 更多研学营信息
    ];
    res.json(camps);

  } catch (err) {
    res.status(500).json({ error: '获取课程失败' });
  }
});

module.exports = router;
const express = require('express');
const Course = require('../models/course');
const QRCode = require('qrcode')
const baseUrl = process.env.BASE_URL

const fs = require('fs')

const [briefData,detailData,courseDict] = LoadFile('./data/courses.json')
// const [brief,detail]= Object.entries(courseData).map(([id, value]) => {
//   const { detail, ...rest } = value; // 解构去除detail属性
//   return { id, ...rest },{id,...value};            // 重组对象包含id及其他属性
// });
console.log(courseDict);
console.log("????????????")



const router = express.Router();

function LoadFile(path) {
  try {
    const rawData = fs.readFileSync(path, 'utf8');
    const jsonData = JSON.parse(rawData);
    let brief = Object.entries(jsonData).map(([id, value]) => {
      const { detail, ...rest } = value; // 解构去除detail属性
      return { id, ...rest };            // 重组对象包含id及其他属性
    });
    let detail = Object.entries(jsonData).map(([id, value]) => {
      const { detail, ...rest } = value; // 解构去除detail属性
      return {id,...rest,...detail};            // 重组对象包含id及其他属性
    });
    console.log("---------------")

    console.log(brief);
    console.log("---------------")
    const dict = detail.reduce((acc, { id, ...rest }) => {
      acc[id] = { ...rest };
      return acc;
    }, {});
    return [brief, detail,dict]

  } catch (err) {
    console.error('读取失败：', err);
    return []
  }
}

let count=0;
// 获取课程列表
router.get('/', async (req, res) => {
  try {
    count+=1;
    console.log("connect ... ",count)
    // const courses = await Course.find();
    // res.json(courses);

    // const camps = [
    //   {
    //     id: 1,
    //     image: 'https://example.com/image1.jpg',
    //     title: '广州市铁一中学番禺校区高三11班 鼎湖山春季研学营',
    //     description: '问鼎征途 • 决战高考'
    //   },
    //   {
    //     id: 2,
    //     image: 'https://example.com/image2.jpg',
    //     title: '广州市铁一中学番禺校区高三12班 鼎湖山春季研学营',
    //     description: '问鼎征途 • 决战高考'
    //   },
    //   // ... 更多研学营信息
    // ];
    res.json(courseData);

  } catch (err) {
    res.status(500).json({ error: '获取课程失败' });
  }
});

// 获取单个课程详情
router.get('/:id', async (req, res) => {
  try {
    const course = courseDict[req.params.id] // await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ code: 404, message: '课程不存在' })
    }
    res.json({ code: 0, data: course })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

router.get('/:id/qrcode', async (req, res) => {
  const courseId = req.params.id
  const url = `${process.env.BASE_URL}/${courseId}` // 生成跳转URL
  
  try {
    const qrBuffer = await QRCode.toBuffer(url, {
      width: 400,
      errorCorrectionLevel: 'H'
    })
    
    res.set('Content-Type', 'image/png')
    res.send(qrBuffer)
  } catch (err) {
    res.status(500).json({ code: 500, message: '二维码生成失败' })
  }
})


module.exports = router;
const express = require('express');
const path = require('path'); // เพิ่มการ import path
const router = express.Router();

// หน้าแรก (Home page)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public", 'index.html'));  // ส่งไฟล์ index.html
});

// หน้า watch video
router.get('/watch-video', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public",'watch_video.html'));  // ส่งไฟล์ watch_video.html
});

router.get('/watch-video-v2', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public",'watch_video_storj.html'));  // ส่งไฟล์ watch_video.html
});

// หน้า subscriptions
router.get('/subscriptions', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public",'subscriptions.html'));  // ส่งไฟล์ subscriptions.html
});

router.get('/admin/upload', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public","admin/upload.html"));
});

router.get('/admin/map-video', (req, res) => {
  res.sendFile(path.join(__dirname, "..","public","admin/map-video.html"));
});

module.exports = router;

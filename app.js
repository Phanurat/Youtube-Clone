require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const app = express();

// เชื่อมต่อ MongoDB
// connectDB();

// เสิร์ฟไฟล์ static (CSS, รูปภาพ, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ใช้ routes จาก routes.js
const pageRoutes = require('./routes/routes');  // แก้เป็น './routes/routes' แทน './routes/router'
app.use('/', pageRoutes);

// เริ่มต้น server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

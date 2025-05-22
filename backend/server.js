import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import File from './models/File.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Configure S3 (Storj)
const s3 = new S3Client({
  region: 'ap-southeast-1',
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const title = req.body.title;

  // ตรวจสอบว่าไฟล์และ title ถูกส่งมาหรือไม่
  if (!file || !title) {
    return res.status(400).json({ error: 'File and title are required' });
  }

  const params = {
    Bucket: process.env.STORJ_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // อัพโหลดไฟล์ไปยัง Storj (S3)
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // สร้างไฟล์ใหม่ในฐานข้อมูล MongoDB
    const newFile = new File({
      filename: file.originalname, // ใช้ originalname จากไฟล์
      title: title, // ใช้ title จาก body ของ request
    });

    // บันทึกข้อมูลลง MongoDB
    await newFile.save();
    console.log('✅ File uploaded and saved to DB!');

    // ส่ง response ยืนยันว่าไฟล์ถูกอัพโหลดและบันทึก
    res.json({ message: '✅ File uploaded and saved to DB!' });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

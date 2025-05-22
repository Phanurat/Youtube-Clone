import mongoose from 'mongoose';
import File from './models/File.js'; // นำเข้าโมเดล File

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ฟังก์ชันเพื่อดึงข้อมูลทั้งหมดจาก collection
async function getAllFiles() {
  try {
    // ใช้ find() เพื่อดึงข้อมูลทั้งหมดจาก collection "files"
    const files = await File.find();
    console.log('All Files:', files);
  } catch (err) {
    console.error('Error fetching files:', err);
  }
}

getAllFiles();

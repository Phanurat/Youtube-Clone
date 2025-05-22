import mongoose from 'mongoose';
import File from './models/File.js';

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/video_app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// การบันทึกไฟล์
async function uploadFile() {
  const newFile = new File({
    filename: 'video2.mp4',
    title: 'My First001 Video',
  });

  await newFile.save();
  console.log('File uploaded and saved!');
}

uploadFile();

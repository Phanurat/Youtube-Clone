import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { saveFileMetadata } from './models/file.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer - memory storage
const upload = multer({ storage: multer.memoryStorage() });

// S3 Client (Storj)
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
    // Upload to Storj
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Save metadata to PostgreSQL
    const savedFile = await saveFileMetadata(file.originalname, title);

    res.json({ message: '✅ File uploaded and saved to DB!', file: savedFile });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

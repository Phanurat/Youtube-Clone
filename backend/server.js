import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { saveFileMetadata, getAllFiles, updateFileMapId } from './models/file.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
    region: 'ap-southeast-1',
    endpoint: process.env.STORJ_ENDPOINT,
    credentials: {
        accessKeyId: process.env.STORJ_ACCESS_KEY,
        secretAccessKey: process.env.STORJ_SECRET_KEY,
    },
    forcePathStyle: true,
});

app.patch('/api-v1/files/:id/map', async (req, res) => {
    const { id } = req.params;
    const { map_id } = req.body;

    if (map_id === undefined) {
        return res.status(400).json({ error: 'map_id is required' });
    }

    try {
        const updatedFile = await updateFileMapId(id, map_id);

        if (!updatedFile) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json({ message: '✅ File mapped successfully', file: updatedFile });
    } catch (err) {
        console.error('❌ DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api-v1/list', async (req, res) => {
    try {
        const files = await getAllFiles();
        res.status(200).json(files);
    } catch (error) {
        console.error('❌ Error fetching files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const title = req.body.title;
    const mapid = req.body.mapid || null;  // รับ mapid จาก body ถ้าไม่มีให้เป็น null

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
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // ส่ง mapid เข้าไปด้วย
        const savedFile = await saveFileMetadata(file.originalname, title, mapid);

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

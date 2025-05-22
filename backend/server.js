// Import required libraries
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // ใช้ SDK v3
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Initialize S3 client with Storj endpoint (using AWS SDK v3)
const s3 = new S3Client({
    region: 'ap-southeast-1', // หรือ region ของคุณ
    endpoint: process.env.STORJ_ENDPOINT, // Storj endpoint
    credentials: {
        accessKeyId: process.env.STORJ_ACCESS_KEY, // Your Storj access key
        secretAccessKey: process.env.STORJ_SECRET_KEY, // Your Storj secret key
    },
    forcePathStyle: true, // สำหรับการใช้ path style สำหรับ S3 compatibility
});

// Define the upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    // Check if a file is provided
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Set parameters for the S3 upload
    const params = {
        Bucket: process.env.STORJ_BUCKET, // Your Storj bucket name
        Key: file.originalname, // File name in the bucket
        Body: file.buffer, // File content
        ContentType: file.mimetype, // MIME type of the file
    };

    // Try uploading the file to Storj using S3Client and PutObjectCommand
    try {
        const command = new PutObjectCommand(params); // Create a command
        await s3.send(command); // Send the command to upload the file
        res.json({ message: '✅ File uploaded successfully!' });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Start the server on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Storj uploader running at http://localhost:${PORT}`);
});

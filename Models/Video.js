const mongoose = require('mongoose');

// สร้าง schema ของ Video
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  uploader: String,
  views: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);

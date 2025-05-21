const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // ลบตัวเลือกออกไป
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);  // หยุดโปรแกรมหากการเชื่อมต่อผิดพลาด
  }
};

module.exports = connectDB;

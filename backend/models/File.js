import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  title: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);
export default File;

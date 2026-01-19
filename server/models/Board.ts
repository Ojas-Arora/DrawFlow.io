import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    default: 'Untitled Board',
  },
  createdBy: {
    type: String,
    required: true,
  },
  activeUsers: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Board', BoardSchema);

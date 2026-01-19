import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userColor: {
    type: String,
    default: '#000000',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Create compound index for efficient querying
ChatMessageSchema.index({ boardId: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', ChatMessageSchema);

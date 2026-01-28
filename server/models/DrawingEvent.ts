import mongoose from 'mongoose';

const DrawingEventSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['draw', 'erase', 'clear', 'shape', 'text', 'stickynote', 'highlight', 'image'],
    default: 'draw',
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Create compound index for efficient querying
DrawingEventSchema.index({ boardId: 1, createdAt: 1 });

export default mongoose.model('DrawingEvent', DrawingEventSchema);

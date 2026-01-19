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
    enum: ['draw', 'erase', 'clear'],
    default: 'draw',
  },
  data: {
    x: Number,
    y: Number,
    prevX: Number,
    prevY: Number,
    color: String,
    lineWidth: Number,
    tool: String,
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

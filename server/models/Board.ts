import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  isPrivate: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    default: null,
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

// Hash password before saving
BoardSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
BoardSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Board', BoardSchema);

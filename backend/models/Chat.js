import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true,
  },
  farmId: {
    type: String,
    required: true,
  },
  messages: [{
    sender: {
      type: String,
      enum: ['buyer', 'farmer'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Chat', chatSchema);


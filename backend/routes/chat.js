import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';

const router = express.Router();

// Helper to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get or create chat
router.get('/:buyerId/:farmId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    let chat = await Chat.findOne({
      buyerId: req.params.buyerId,
      farmId: req.params.farmId,
    });

    if (!chat) {
      chat = new Chat({
        buyerId: req.params.buyerId,
        farmId: req.params.farmId,
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/:buyerId/:farmId/message', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    let chat = await Chat.findOne({
      buyerId: req.params.buyerId,
      farmId: req.params.farmId,
    });

    if (!chat) {
      chat = new Chat({
        buyerId: req.params.buyerId,
        farmId: req.params.farmId,
        messages: [],
      });
    }

    chat.messages.push({
      sender: req.body.sender,
      message: req.body.message,
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import mongoose from 'mongoose';
import Buyer from '../models/Buyer.js';

const router = express.Router();

// Helper to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all buyers
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected', buyers: [] });
    }
    const buyers = await Buyer.find().lean();
    res.json(buyers || []);
  } catch (error) {
    console.error('Error fetching buyers:', error.message);
    res.status(500).json({ error: error.message, buyers: [] });
  }
});

// Create buyer
router.post('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const buyer = new Buyer(req.body);
    await buyer.save();
    res.status(201).json(buyer);
  } catch (error) {
    console.error('Error creating buyer:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get buyer by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add purchase to history
router.post('/:id/purchase', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    buyer.purchaseHistory.push({
      ...req.body,
      date: new Date(),
    });

    await buyer.save();
    res.json(buyer);
  } catch (error) {
    console.error('Error adding purchase:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;

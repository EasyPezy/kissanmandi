import express from 'express';
import mongoose from 'mongoose';
import Farm from '../models/Farm.js';
import { mockFarms } from '../utils/mockData.js';

const router = express.Router();

// Helper to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all farms
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      // Return mock data when database is not connected
      let farms = [...mockFarms];
      
      // Apply filters to mock data
      const { cropType, state, city, minQuantity } = req.query;
      if (cropType) farms = farms.filter(f => f.cropType === cropType);
      if (state) farms = farms.filter(f => f.state === state);
      if (city) farms = farms.filter(f => f.nearestCity.toLowerCase().includes(city.toLowerCase()));
      if (minQuantity) farms = farms.filter(f => f.availableQuantity >= parseInt(minQuantity));
      
      return res.json(farms);
    }

    const { cropType, state, city, minQuantity } = req.query;
    let query = {};

    if (cropType) query.cropType = cropType;
    if (state) query.state = state;
    if (city) query.nearestCity = city;
    if (minQuantity) query.availableQuantity = { $gte: parseInt(minQuantity) };

    const farms = await Farm.find(query).lean().limit(1000);
    res.json(farms || []);
  } catch (error) {
    console.error('Error fetching farms:', error.message);
    res.status(500).json({ 
      error: error.message, 
      farms: [],
      message: 'Error fetching farms from database'
    });
  }
});

// Get farm by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      const farm = mockFarms.find(f => f._id === req.params.id);
      if (!farm) {
        return res.status(404).json({ error: 'Farm not found' });
      }
      return res.json(farm);
    }

    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    console.error('Error fetching farm:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get farms by state
router.get('/state/:state', async (req, res) => {
  try {
    if (!isConnected()) {
      const farms = mockFarms.filter(f => f.state === req.params.state);
      return res.json(farms);
    }

    const farms = await Farm.find({ state: req.params.state }).lean();
    res.json(farms || []);
  } catch (error) {
    console.error('Error fetching farms by state:', error.message);
    res.status(500).json({ error: error.message, farms: [] });
  }
});

// Get farms by crop type
router.get('/crop/:cropType', async (req, res) => {
  try {
    if (!isConnected()) {
      const farms = mockFarms.filter(f => f.cropType === req.params.cropType);
      return res.json(farms);
    }

    const farms = await Farm.find({ cropType: req.params.cropType }).lean();
    res.json(farms || []);
  } catch (error) {
    console.error('Error fetching farms by crop:', error.message);
    res.status(500).json({ error: error.message, farms: [] });
  }
});

// Add quality review
router.post('/:id/review', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { buyerId, rating, comment } = req.body;
    const farm = await Farm.findById(req.params.id);
    
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    farm.qualityReviews.push({
      buyerId,
      rating,
      comment,
      date: new Date(),
    });

    // Update average rating
    const totalRating = farm.qualityReviews.reduce((sum, review) => sum + review.rating, 0);
    farm.qualityRating = totalRating / farm.qualityReviews.length;

    await farm.save();
    res.json(farm);
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update farm
router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    console.error('Error updating farm:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import mongoose from 'mongoose';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import { mockFarms, mockCrops } from '../utils/mockData.js';

const router = express.Router();

// Helper to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all crops with aggregated data
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      return res.json(mockCrops);
    }

    const crops = await Crop.find().lean().limit(100);
    res.json(crops || []);
  } catch (error) {
    console.error('Error fetching crops:', error.message);
    res.status(500).json({ 
      error: error.message, 
      crops: [],
      message: 'Error fetching crops from database'
    });
  }
});

// Get crop statistics by type
router.get('/stats/:cropType', async (req, res) => {
  try {
    if (!isConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      const cropType = req.params.cropType;
      const farms = mockFarms.filter(f => f.cropType === cropType);
      
      const stats = {
        cropType: cropType,
        totalQuantity: farms.reduce((sum, f) => sum + (f.cropQuantity || 0), 0),
        availableQuantity: farms.reduce((sum, f) => sum + (f.availableQuantity || 0), 0),
        averagePrice: farms.reduce((sum, f) => sum + (f.marketPrice || 0), 0) / farms.length || 0,
        farmCount: farms.length,
        stateWiseDistribution: {},
      };
      
      farms.forEach(farm => {
        if (farm.state) {
          if (!stats.stateWiseDistribution[farm.state]) {
            stats.stateWiseDistribution[farm.state] = 0;
          }
          stats.stateWiseDistribution[farm.state] += farm.availableQuantity || 0;
        }
      });
      
      return res.json(stats);
    }

    const farms = await Farm.find({ cropType: req.params.cropType }).lean();
    
    if (farms.length === 0) {
      return res.json({
        cropType: req.params.cropType,
        totalQuantity: 0,
        availableQuantity: 0,
        averagePrice: 0,
        farmCount: 0,
        stateWiseDistribution: {},
      });
    }
    
    const stats = {
      cropType: req.params.cropType,
      totalQuantity: farms.reduce((sum, farm) => sum + (farm.cropQuantity || 0), 0),
      availableQuantity: farms.reduce((sum, farm) => sum + (farm.availableQuantity || 0), 0),
      averagePrice: farms.reduce((sum, farm) => sum + (farm.marketPrice || 0), 0) / farms.length || 0,
      farmCount: farms.length,
      stateWiseDistribution: {},
    };

    farms.forEach(farm => {
      if (farm.state) {
        if (!stats.stateWiseDistribution[farm.state]) {
          stats.stateWiseDistribution[farm.state] = 0;
        }
        stats.stateWiseDistribution[farm.state] += farm.availableQuantity || 0;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching crop stats:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get crop availability across India
router.get('/availability/:cropType', async (req, res) => {
  try {
    if (!isConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      const cropType = req.params.cropType;
      const farms = mockFarms.filter(f => f.cropType === cropType);
      
      const availability = farms.map(farm => ({
        farmId: farm._id,
        farmName: farm.farmName,
        state: farm.state,
        city: farm.nearestCity,
        latitude: farm.latitude,
        longitude: farm.longitude,
        quantity: farm.availableQuantity || 0,
        price: farm.marketPrice || 0,
        harvestDate: farm.harvestDate,
        qualityRating: farm.qualityRating || 0,
      }));
      
      return res.json(availability);
    }

    const farms = await Farm.find({ cropType: req.params.cropType }).lean();
    
    const availability = farms.map(farm => ({
      farmId: farm._id,
      farmName: farm.farmName,
      state: farm.state,
      city: farm.nearestCity,
      latitude: farm.latitude,
      longitude: farm.longitude,
      quantity: farm.availableQuantity || 0,
      price: farm.marketPrice || 0,
      harvestDate: farm.harvestDate,
      qualityRating: farm.qualityRating || 0,
    }));

    res.json(availability);
  } catch (error) {
    console.error('Error fetching crop availability:', error.message);
    res.status(500).json({ error: error.message, availability: [] });
  }
});

// Get heatmap data for all crops
router.get('/heatmap/all', async (req, res) => {
  try {
    if (!isConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      const heatmapData = mockFarms.map(farm => ({
        latitude: farm.latitude,
        longitude: farm.longitude,
        lat: farm.latitude,
        lng: farm.longitude,
        cropType: farm.cropType,
        quantity: farm.availableQuantity || 0,
        state: farm.state,
        city: farm.nearestCity,
        nearestCity: farm.nearestCity,
        price: farm.marketPrice || 0,
        farmName: farm.farmName,
        intensity: (farm.availableQuantity || 0) / 1000,
      }));
      
      return res.json(heatmapData);
    }

    const farms = await Farm.find().lean();
    
    const heatmapData = farms.map(farm => ({
      latitude: farm.latitude,
      longitude: farm.longitude,
      lat: farm.latitude,
      lng: farm.longitude,
      cropType: farm.cropType,
      quantity: farm.availableQuantity || 0,
      state: farm.state,
      city: farm.nearestCity,
      nearestCity: farm.nearestCity,
      price: farm.marketPrice || 0,
      farmName: farm.farmName,
      intensity: (farm.availableQuantity || 0) / 1000, // Normalize for heatmap
    }));

    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching heatmap data:', error.message);
    res.status(500).json({ 
      error: error.message, 
      heatmapData: [],
      message: 'Error fetching heatmap data from database'
    });
  }
});

export default router;

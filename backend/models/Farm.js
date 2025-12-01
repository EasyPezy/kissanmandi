import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  farmName: {
    type: String,
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  nearestCity: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  cropType: {
    type: String,
    required: true,
  },
  cropQuantity: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  predictedYield: {
    type: Number,
    default: 0,
  },
  weatherCondition: {
    type: String,
    default: 'Normal',
  },
  fertilizerUsed: {
    type: String,
    default: 'Organic',
  },
  marketPrice: {
    type: Number,
    required: true,
  },
  qualityRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  qualityReviews: [{
    buyerId: String,
    rating: Number,
    comment: String,
    date: Date,
  }],
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  bulkPurchaseDiscount: {
    type: Number,
    default: 0,
  },
  minimumBulkQuantity: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Farm', farmSchema);


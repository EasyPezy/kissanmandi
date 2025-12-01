import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
  },
  cropType: {
    type: String,
    required: true,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  availableQuantity: {
    type: Number,
    default: 0,
  },
  averagePrice: {
    type: Number,
    default: 0,
  },
  topProducingStates: [{
    state: String,
    quantity: Number,
  }],
  season: {
    type: String,
  },
  harvestMonths: [String],
});

export default mongoose.model('Crop', cropSchema);


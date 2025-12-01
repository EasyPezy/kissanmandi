import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  location: {
    city: String,
    state: String,
  },
  preferredCrops: [String],
  purchaseHistory: [{
    farmId: String,
    cropType: String,
    quantity: Number,
    price: Number,
    date: Date,
    rating: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Buyer', buyerSchema);


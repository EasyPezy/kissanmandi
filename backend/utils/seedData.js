import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';

// Indian states with coordinates
const states = [
  { name: 'Punjab', lat: 30.9293, lng: 75.5003, cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'] },
  { name: 'Haryana', lat: 29.0588, lng: 76.0856, cities: ['Karnal', 'Hisar', 'Rohtak', 'Panipat'] },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'] },
  { name: 'Maharashtra', lat: 19.0760, lng: 72.8777, cities: ['Pune', 'Nashik', 'Nagpur', 'Aurangabad'] },
  { name: 'Karnataka', lat: 12.9716, lng: 77.5946, cities: ['Bangalore', 'Mysore', 'Hubli', 'Belgaum'] },
  { name: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
  { name: 'Gujarat', lat: 23.0225, lng: 72.5714, cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { name: 'Rajasthan', lat: 26.9124, lng: 75.7873, cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { name: 'West Bengal', lat: 22.5726, lng: 88.3639, cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol'] },
  { name: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'] },
];

const cropTypes = [
  'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 
  'Potato', 'Tomato', 'Onion', 'Chilli', 'Turmeric', 'Ginger'
];

const fertilizers = ['Organic', 'NPK', 'Urea', 'DAP', 'Potash', 'Mixed'];
const weatherConditions = ['Excellent', 'Good', 'Normal', 'Fair', 'Poor'];

const farmerNames = [
  'Rajesh Kumar', 'Suresh Singh', 'Amit Patel', 'Vikram Sharma', 'Ramesh Yadav',
  'Mohan Das', 'Kiran Reddy', 'Prakash Nair', 'Anil Mehta', 'Sunil Gupta',
  'Deepak Joshi', 'Naveen Agarwal', 'Ravi Malhotra', 'Ajay Kapoor', 'Sandeep Verma'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export async function initializeData() {
  try {
    // Check if data already exists
    const farmCount = await Farm.countDocuments();
    if (farmCount > 0) {
      console.log('✅ Data already initialized');
      return;
    }

    console.log('📦 Initializing synthetic data...');

    // Create farms
    const farms = [];
    for (let i = 0; i < 200; i++) {
      const state = getRandomElement(states);
      const city = getRandomElement(state.cities);
      const cropType = getRandomElement(cropTypes);
      const cropQuantity = getRandomNumber(500, 10000);
      const availableQuantity = getRandomNumber(100, cropQuantity);
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() + getRandomNumber(-30, 90));
      
      const farm = {
        farmName: `${cropType} Farm ${i + 1}`,
        farmerName: getRandomElement(farmerNames),
        nearestCity: city,
        state: state.name,
        latitude: state.lat + (Math.random() - 0.5) * 2,
        longitude: state.lng + (Math.random() - 0.5) * 2,
        cropType: cropType,
        cropQuantity: cropQuantity,
        availableQuantity: availableQuantity,
        harvestDate: harvestDate,
        predictedYield: cropQuantity * (0.8 + Math.random() * 0.4),
        weatherCondition: getRandomElement(weatherConditions),
        fertilizerUsed: getRandomElement(fertilizers),
        marketPrice: getRandomFloat(20, 200),
        qualityRating: getRandomFloat(3.5, 5.0),
        qualityReviews: [],
        contactNumber: `+91${getRandomNumber(7000000000, 9999999999)}`,
        email: `farmer${i + 1}@kisaanmandi.com`,
        bulkPurchaseDiscount: getRandomNumber(5, 20),
        minimumBulkQuantity: getRandomNumber(100, 500),
      };

      farms.push(farm);
    }

    await Farm.insertMany(farms);
    console.log(`✅ Created ${farms.length} farms`);

    // Create crop aggregations
    const cropData = {};
    farms.forEach(farm => {
      if (!cropData[farm.cropType]) {
        cropData[farm.cropType] = {
          totalQuantity: 0,
          availableQuantity: 0,
          priceSum: 0,
          count: 0,
          states: {},
        };
      }
      cropData[farm.cropType].totalQuantity += farm.cropQuantity;
      cropData[farm.cropType].availableQuantity += farm.availableQuantity;
      cropData[farm.cropType].priceSum += farm.marketPrice;
      cropData[farm.cropType].count += 1;
      
      if (!cropData[farm.cropType].states[farm.state]) {
        cropData[farm.cropType].states[farm.state] = 0;
      }
      cropData[farm.cropType].states[farm.state] += farm.availableQuantity;
    });

    const crops = Object.keys(cropData).map(cropName => ({
      cropName: cropName,
      cropType: cropName,
      totalQuantity: cropData[cropName].totalQuantity,
      availableQuantity: cropData[cropName].availableQuantity,
      averagePrice: cropData[cropName].priceSum / cropData[cropName].count,
      topProducingStates: Object.entries(cropData[cropName].states)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([state, quantity]) => ({ state, quantity })),
      season: 'All Season',
      harvestMonths: ['January', 'February', 'March', 'April', 'May', 'June'],
    }));

    await Crop.insertMany(crops);
    console.log(`✅ Created ${crops.length} crop records`);

    console.log('✅ Data initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing data:', error.message);
    // Don't throw - let server continue
  }
}


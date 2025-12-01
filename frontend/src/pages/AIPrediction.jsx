import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const STATES = [
  { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400 },
  { name: 'Assam', lat: 26.2006, lng: 92.9376 },
  { name: 'Bihar', lat: 25.0961, lng: 85.3131 },
  { name: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
  { name: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { name: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Odisha', lat: 20.9517, lng: 85.0985 },
  { name: 'Punjab', lat: 30.9293, lng: 75.5003 },
  { name: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'West Bengal', lat: 22.5726, lng: 88.3639 },
];

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Potato', 'Tomato', 'Onion'];

const AIPrediction = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    cropType: '',
    state: '',
    area: '',
    weather: 'Normal',
    fertilizer: 'Organic',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cropType || !form.state) {
      alert('Please select crop type and state');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const state = STATES.find(s => s.name === form.state);
      const res = await api.post('/ai/predict-yield', {
        ...form,
        latitude: state?.lat || '',
        longitude: state?.lng || '',
      }, { timeout: 30000 });
      setResult(res.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Unable to get prediction. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Yield Prediction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Crop Type *</label>
              <select
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                className="w-full border rounded px-4 py-2"
                required
              >
                <option value="">Select Crop</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">State *</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border rounded px-4 py-2"
                required
              >
                <option value="">Select State</option>
                {STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Area (hectares)</label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Weather</label>
              <select
                value={form.weather}
                onChange={(e) => setForm({ ...form, weather: e.target.value })}
                className="w-full border rounded px-4 py-2"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Normal">Normal</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Fertilizer</label>
              <select
                value={form.fertilizer}
                onChange={(e) => setForm({ ...form, fertilizer: e.target.value })}
                className="w-full border rounded px-4 py-2"
              >
                <option value="Organic">Organic</option>
                <option value="NPK">NPK</option>
                <option value="Urea">Urea</option>
                <option value="DAP">DAP</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Predicted Yield</div>
                <div className="text-3xl font-bold text-primary-600">
                  {result.predictedYield?.toFixed(2) || 'N/A'} tons
                </div>
              </div>
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-primary-600">
                  {result.confidence || 75}%
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Factors:</h3>
                <p className="text-gray-600 text-sm">{result.factors || result.rawResponse || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Recommendations:</h3>
                <p className="text-gray-600 text-sm">{result.recommendations || result.rawResponse || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Enter details and click "Predict Yield"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Heatmap = () => {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    if (crops.length > 0 || selectedCrop === 'all') {
      loadData();
    }
  }, [selectedCrop]);

  const loadCrops = async () => {
    try {
      const res = await api.get('/crops', { timeout: 5000 });
      setCrops(res.data || []);
    } catch (err) {
      console.error('Error loading crops:', err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedCrop === 'all' 
        ? '/crops/heatmap/all'
        : `/crops/availability/${selectedCrop}`;
      
      const res = await api.get(url, { timeout: 5000 });
      setData(res.data || []);
    } catch (err) {
      console.error('Error loading heatmap data:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Backend server is not running. Please start it with: cd backend && npm run dev');
        setData([]);
      } else {
        // Try to use data even if there's an error
        const responseData = err.response?.data || [];
        setData(Array.isArray(responseData) ? responseData : []);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getColor = (qty) => {
    if (qty < 1000) return '#22c55e';
    if (qty < 5000) return '#eab308';
    return '#ef4444';
  };

  const getRadius = (qty) => {
    return Math.min(Math.max(qty / 200, 5), 20);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('heatmap')}</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block mb-2 font-semibold">Filter by Crop:</label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-auto min-w-[200px]"
        >
          <option value="all">All Crops</option>
          {crops.map(crop => (
            <option key={crop._id || crop.cropType} value={crop.cropType}>
              {crop.cropName || crop.cropType}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6" style={{ height: '600px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4">{t('loading')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((point, idx) => {
              const lat = point.latitude || point.lat;
              const lng = point.longitude || point.lng;
              const qty = point.quantity || 0;
              
              if (!lat || !lng) return null;

              return (
                <CircleMarker
                  key={idx}
                  center={[lat, lng]}
                  radius={getRadius(qty)}
                  pathOptions={{
                    fillColor: getColor(qty),
                    color: '#fff',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.6,
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{point.farmName || 'Farm'}</h3>
                      <p><strong>State:</strong> {point.state || 'N/A'}</p>
                      <p><strong>City:</strong> {point.city || point.nearestCity || 'N/A'}</p>
                      <p><strong>Crop:</strong> {point.cropType || selectedCrop}</p>
                      <p><strong>Quantity:</strong> {qty.toLocaleString()} kg</p>
                      {point.price && <p><strong>Price:</strong> ₹{point.price}/kg</p>}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-primary-600">{data.length}</div>
          <div className="text-gray-600">Locations</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-primary-600">
            {data.reduce((sum, p) => sum + (p.quantity || 0), 0).toLocaleString()} kg
          </div>
          <div className="text-gray-600">Total Quantity</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-primary-600">
            {selectedCrop === 'all' ? 'All Crops' : selectedCrop}
          </div>
          <div className="text-gray-600">Selected Crop</div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;

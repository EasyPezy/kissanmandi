import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const CropStats = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [selected, setSelected] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    if (selected) {
      loadStats();
    } else {
      setStats(null);
    }
  }, [selected]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/crops', { timeout: 5000 }).catch(() => ({ data: [] }));
      setCrops(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading crops:', err);
      setCrops([]);
      setError('Unable to load crops. The backend may not be available.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get(`/crops/stats/${selected}`, { timeout: 5000 });
      setStats(res.data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setStats(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={loadCrops}
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('cropStats')}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block mb-2 font-semibold">Select Crop:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-auto min-w-[200px]"
        >
          <option value="">-- Select a crop --</option>
          {crops.map(crop => (
            <option key={crop._id || crop.cropType} value={crop.cropType}>
              {crop.cropName || crop.cropType}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <h2 className="text-xl font-semibold p-4 bg-primary-50">All Crops</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Crop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Available (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Avg Price (₹/kg)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crops.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">{t('noData')}</td>
                </tr>
              ) : (
                crops.map(crop => (
                  <tr
                    key={crop._id || crop.cropType}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelected(crop.cropType)}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{crop.cropName || crop.cropType}</td>
                    <td className="px-6 py-4 text-sm">{(crop.totalQuantity || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{(crop.availableQuantity || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">₹{(crop.averagePrice || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Details: {stats.cropType}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-2xl font-bold text-primary-600">{(stats.totalQuantity || 0).toLocaleString()} kg</div>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Available</div>
              <div className="text-2xl font-bold text-primary-600">{(stats.availableQuantity || 0).toLocaleString()} kg</div>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Avg Price</div>
              <div className="text-2xl font-bold text-primary-600">₹{(stats.averagePrice || 0).toFixed(2)}/kg</div>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Farms</div>
              <div className="text-2xl font-bold text-primary-600">{stats.farmCount || 0}</div>
            </div>
          </div>

          {stats.stateWiseDistribution && Object.keys(stats.stateWiseDistribution).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('stateDistribution')}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">%</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(stats.stateWiseDistribution)
                      .sort((a, b) => b[1] - a[1])
                      .map(([state, qty]) => (
                        <tr key={state} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{state}</td>
                          <td className="px-6 py-4 text-sm">{qty.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm">
                            {stats.availableQuantity > 0 
                              ? ((qty / stats.availableQuantity) * 100).toFixed(2) 
                              : '0.00'}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropStats;

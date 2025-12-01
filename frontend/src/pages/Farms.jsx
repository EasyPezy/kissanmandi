import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const Farms = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    filterFarms();
  }, [farms, search, cropFilter, stateFilter]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/farms', { timeout: 5000 });
      const data = res.data || [];
      setFarms(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error loading farms:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Backend server is not running. Please start it with: cd backend && npm run dev');
        setFarms([]);
        setFiltered([]);
      } else {
        // Try to use data even if there's an error
        const data = err.response?.data || [];
        setFarms(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterFarms = () => {
    let result = [...farms];
    
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(f => 
        f.farmName?.toLowerCase().includes(s) ||
        f.farmerName?.toLowerCase().includes(s) ||
        f.cropType?.toLowerCase().includes(s)
      );
    }
    
    if (cropFilter) {
      result = result.filter(f => f.cropType === cropFilter);
    }
    
    if (stateFilter) {
      result = result.filter(f => f.state === stateFilter);
    }
    
    setFiltered(result);
  };

  const crops = [...new Set(farms.map(f => f.cropType).filter(Boolean))];
  const states = [...new Set(farms.map(f => f.state).filter(Boolean))];

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
            onClick={loadFarms}
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
      <h1 className="text-3xl font-bold mb-6">{t('farms')}</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="">All Crops</option>
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Farm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Crop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {t('noData')}
                  </td>
                </tr>
              ) : (
                filtered.map(farm => (
                  <tr key={farm._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{farm.farmName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{farm.farmerName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{farm.nearestCity}, {farm.state}</td>
                    <td className="px-6 py-4 text-sm">{farm.cropType || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{farm.availableQuantity || 0} kg</td>
                    <td className="px-6 py-4 text-sm">₹{farm.marketPrice || 0}/kg</td>
                    <td className="px-6 py-4 text-sm">⭐ {(farm.qualityRating || 0).toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Farms;

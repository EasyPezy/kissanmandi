import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ farms: 0, crops: 0, states: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use proxy or direct URL with timeout
      const axiosConfig = {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      };

      const [farmsRes, cropsRes] = await Promise.all([
        axios.get('/api/farms', axiosConfig).catch(() => ({ data: [] })),
        axios.get('/api/crops', axiosConfig).catch(() => ({ data: [] }))
      ]);
      
      const farms = farmsRes.data || [];
      const crops = cropsRes.data || [];
      const states = new Set(farms.map(f => f.state).filter(Boolean));
      
      setStats({
        farms: farms.length,
        crops: crops.length,
        states: states.size,
      });
    } catch (err) {
      console.error('Error loading data:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Backend server is not running. Please start it with: cd backend && npm run dev');
      } else {
        // Even if there's an error, try to show something
        setError(null);
      }
      setStats({ farms: 0, crops: 0, states: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            {t('welcome')}
          </h1>
          <p className="text-3xl text-gray-600 mb-6">
            {t('tagline')}
          </p>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 mb-2">{error}</p>
            <p className="text-sm text-yellow-700">Make sure the backend server is running on port 5000</p>
            <button
              onClick={loadData}
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {stats.farms}
              </div>
              <div className="text-gray-600 text-lg">{t('farms')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {stats.crops}
              </div>
              <div className="text-gray-600 text-lg">{t('crops')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {stats.states}
              </div>
              <div className="text-gray-600 text-lg">{t('state')}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">🌾 Direct Connection</h3>
            <p className="text-gray-600">Connect directly with farmers across India</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">🗺️ Live Heatmap</h3>
            <p className="text-gray-600">Visualize crop availability with interactive maps</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">🤖 AI Predictions</h3>
            <p className="text-gray-600">Get AI-powered yield predictions</p>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link
            to="/farms"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-lg shadow-lg"
          >
            {t('exploreFarms')}
          </Link>
          <Link
            to="/heatmap"
            className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition text-lg shadow-lg"
          >
            {t('viewHeatmap')}
          </Link>
          <Link
            to="/crops"
            className="inline-block bg-primary-400 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 transition text-lg shadow-lg"
          >
            {t('cropStats')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

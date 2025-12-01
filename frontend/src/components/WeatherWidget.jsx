import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`/api/weather/${latitude}/${longitude}`, { timeout: 5000 });
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading weather...</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="font-semibold mb-2">Weather Conditions</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Temperature:</span>
          <span className="ml-2 font-medium">{weather.temperature}°C</span>
        </div>
        <div>
          <span className="text-gray-600">Condition:</span>
          <span className="ml-2 font-medium">{weather.condition}</span>
        </div>
        <div>
          <span className="text-gray-600">Humidity:</span>
          <span className="ml-2 font-medium">{weather.humidity}%</span>
        </div>
        <div>
          <span className="text-gray-600">Wind Speed:</span>
          <span className="ml-2 font-medium">{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;


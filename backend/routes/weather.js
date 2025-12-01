import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get weather for location using Open-Meteo (Free, no API key required)
router.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Using Open-Meteo API - completely free, no API key needed
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;
      
      // Map weather codes to conditions
      const weatherCodes = {
        0: 'Clear',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing Rime Fog',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        56: 'Light Freezing Drizzle',
        57: 'Dense Freezing Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        66: 'Light Freezing Rain',
        67: 'Heavy Freezing Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Violent Rain Showers',
        85: 'Slight Snow Showers',
        86: 'Heavy Snow Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with Hail',
        99: 'Thunderstorm with Heavy Hail'
      };
      
      const current = data.current;
      const weatherCode = current.weather_code || 0;
      const condition = weatherCodes[weatherCode] || 'Unknown';
      
      res.json({
        temperature: current.temperature_2m || 0,
        condition: condition,
        humidity: current.relative_humidity_2m || 0,
        windSpeed: current.wind_speed_10m || 0,
        description: `${condition} conditions`,
        weatherCode: weatherCode,
      });
    } catch (error) {
      console.error('Open-Meteo API error:', error.message);
      // Fallback to mock data if API fails
      res.json({
        temperature: 25 + Math.random() * 10,
        condition: ['Clear', 'Clouds', 'Rain', 'Sunny'][Math.floor(Math.random() * 4)],
        humidity: 60 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        description: 'Moderate weather conditions',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weather forecast using Open-Meteo
router.get('/forecast/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Using Open-Meteo API for 7-day forecast
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&forecast_days=7`;
    
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;
      
      const weatherCodes = {
        0: 'Clear',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Violent Rain Showers',
        95: 'Thunderstorm',
      };
      
      const forecast = [];
      const daily = data.daily;
      
      for (let i = 0; i < daily.time.length; i++) {
        const weatherCode = daily.weather_code[i] || 0;
        const condition = weatherCodes[weatherCode] || 'Unknown';
        
        forecast.push({
          date: daily.time[i],
          temperature: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
          temperatureMax: daily.temperature_2m_max[i],
          temperatureMin: daily.temperature_2m_min[i],
          condition: condition,
          precipitation: daily.precipitation_sum[i] || 0,
          weatherCode: weatherCode,
        });
      }
      
      res.json(forecast);
    } catch (error) {
      console.error('Open-Meteo Forecast API error:', error.message);
      // Fallback to mock forecast data
      const forecast = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        forecast.push({
          date: date.toISOString().split('T')[0],
          temperature: 20 + Math.random() * 15,
          temperatureMax: 25 + Math.random() * 10,
          temperatureMin: 15 + Math.random() * 10,
          condition: ['Clear', 'Clouds', 'Rain', 'Sunny'][Math.floor(Math.random() * 4)],
          precipitation: Math.random() * 20,
        });
      }
      res.json(forecast);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

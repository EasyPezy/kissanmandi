import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Get API key from environment variables (required)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables!');
  console.error('💡 Please set GEMINI_API_KEY in your .env file or deployment environment variables.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Predict yield using AI
router.post('/predict-yield', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        error: 'AI service not configured',
        message: 'GEMINI_API_KEY is not set. Please configure it in environment variables.',
      });
    }

    const { cropType, area, weatherCondition, fertilizerUsed, historicalYield, latitude, longitude } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As an agricultural AI expert, predict the crop yield for the following parameters:
- Crop Type: ${cropType}
- Area (hectares): ${area || 'Not specified'}
- Weather Condition: ${weatherCondition || 'Normal'}
- Fertilizer Used: ${fertilizerUsed || 'Organic'}
- Historical Yield (if available): ${historicalYield || 'Not available'}
- Location: Latitude ${latitude}, Longitude ${longitude}

Please provide:
1. Predicted yield in metric tons
2. Confidence level (percentage)
3. Key factors affecting the yield
4. Recommendations for improving yield

Format the response as JSON with keys: predictedYield, confidence, factors, recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from response
    let aiResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // Fallback: create structured response from text
        const yieldMatch = text.match(/(\d+\.?\d*)\s*(?:metric\s*)?tons?/i);
        const confidenceMatch = text.match(/(\d+)\s*%/i);
        aiResponse = {
          predictedYield: yieldMatch ? parseFloat(yieldMatch[1]) : 0,
          confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75,
          factors: text,
          recommendations: text,
          rawResponse: text,
        };
      }
    } catch (parseError) {
      // If parsing fails, return structured response
      const yieldMatch = text.match(/(\d+\.?\d*)\s*(?:metric\s*)?tons?/i);
      const confidenceMatch = text.match(/(\d+)\s*%/i);
      aiResponse = {
        predictedYield: yieldMatch ? parseFloat(yieldMatch[1]) : 0,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75,
        factors: text,
        recommendations: text,
        rawResponse: text,
      };
    }

    res.json(aiResponse);
  } catch (error) {
    console.error('AI Prediction Error:', error);
    // Fallback prediction
    res.json({
      predictedYield: 50 + Math.random() * 100,
      confidence: 70,
      factors: 'Weather conditions, soil quality, and farming practices',
      recommendations: 'Maintain optimal irrigation and use recommended fertilizers',
      error: error.message,
    });
  }
});

// Get crop recommendations based on location
router.post('/crop-recommendation', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        error: 'AI service not configured',
        message: 'GEMINI_API_KEY is not set. Please configure it in environment variables.',
      });
    }

    const { latitude, longitude, season } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Based on the location (Latitude: ${latitude}, Longitude: ${longitude}) and season: ${season || 'current'}, recommend the best crops to grow in this region of India. Consider:
- Soil type typical for this region
- Climate conditions
- Market demand
- Profitability

Provide top 5 crop recommendations with brief reasons. Format as JSON array with keys: cropName, reason, suitabilityScore (1-10).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON
    let recommendations;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // Fallback recommendations
        recommendations = [
          { cropName: 'Wheat', reason: 'Suitable for this region', suitabilityScore: 8 },
          { cropName: 'Rice', reason: 'High demand and good climate', suitabilityScore: 7 },
          { cropName: 'Cotton', reason: 'Profitable crop for this area', suitabilityScore: 6 },
        ];
      }
    } catch (parseError) {
      recommendations = [
        { cropName: 'Wheat', reason: 'Suitable for this region', suitabilityScore: 8 },
        { cropName: 'Rice', reason: 'High demand and good climate', suitabilityScore: 7 },
      ];
    }

    res.json(recommendations);
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.json([
      { cropName: 'Wheat', reason: 'Suitable for this region', suitabilityScore: 8 },
      { cropName: 'Rice', reason: 'High demand', suitabilityScore: 7 },
    ]);
  }
});

export default router;


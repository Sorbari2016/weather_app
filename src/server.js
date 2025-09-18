//
import express from 'express';
import dotenv from 'dotenv'; 

const app = express(); 
const PORT = 3000; 

dotenv.config(); // load .env file


app.get('/', async (req, res) => {
  const location = req.query.location || 'Port Harcourt';

  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    res.json(data); // send data back to frontend
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: 'Failed to fetch weather data' });
  }
});




app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`); 
}); 
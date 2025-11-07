// imports
import dotenv from 'dotenv'; 
import express from 'express';

dotenv.config(); // load .env file

const app = express(); 
const PORT = 3000; 

// Get weather data from visual crossing api
app.get('/weather', async (req, res) => {
  const location = req.query.location || 'Port Harcourt';
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${process.env.API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`External API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Failed to fetch weather data" });
  }
});

// Run the server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`); 
}); 
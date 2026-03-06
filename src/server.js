import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Configure dotenv 
dotenv.config();

// Create an express app
const app = express();

// Create Port for app to run on 
const PORT = 3000;

// Use CORS
app.use(cors());
app.use(express.json());

// Store the store main endpint of Visual crossing API 
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// Read API key from the environment variables
const API_KEY = process.env.WEATHER_API_KEY;

app.get("/", async (req, res) => {
  try {
    const location = req.query.location;

    if (!location || location.trim() === "" || location === "undefined") {
      return res.status(400).json({
        success: false,
        message: "No location provided, please enter a city or address"
      });
    }

    const url = `${BASE_URL}${location}?key=${API_KEY}&unitGroup=metric&contentType=json`;

    const response = await fetch(url);

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text); 
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || text || "Failed to fetch weather data",
        status: response.status
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
  console.error("SERVER ERROR:", error);

  if (error.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
    return res.status(504).json({
      success: false,
      message: "Weather service took too long to respond. Please try again."
    });
  }

  if (error.code === "ENOTFOUND") {
    return res.status(503).json({
      success: false,
      message: "Unable to reach the weather service."
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error. Please try again later."
  });
}
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
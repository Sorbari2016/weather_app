import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

// Configure dotenv
dotenv.config();

// Create an express app
const app = express();

// Use middlewares
app.use(express.json()); // // parse incoming request data
app.use(cors()); // allow front-end to make request to the server

// Store visual cross base url
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const API_KEY = process.env.WEATHER_API_KEY;

// Get weather conditions of a location
app.get("/weather-api", async (req, res) => {
  const location = req.query.location?.trim();

  //   check if location is provided
  if (!location) {
    return res.status(400).json({
      success: false,
      message: "No location provided, please enter a city or address",
    });
  }

  try {
    // construct url
    const url = `${BASE_URL}${encodeURIComponent(location)}?key=${API_KEY}&unitGroup=metric&contentType=json`;

    // make an axios get request
    const response = await axios.get(url);

    // return successful api weather data
    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    // handle visual crossing api errors
    if (error.response) {
      const statusCode = error.response.status;
      let errorMessage = "Visual Crossing Api error";

      if (statusCode === 400) {
        errorMessage = `Invalid location provided: '${location}'. Please check your spelling or formatting.`;
      } else if (statusCode === 401 || statusCode === 403) {
        errorMessage =
          "API authentication failed. Check your Visual Crossing API key.";
      }

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        details: error.response.data || null,
      });
    }

    // network errors, timeouts
    if (error.request) {
      return res.status(503).json({
        success: false,
        message:
          "Weather service is currently unreachable. Please try again later.",
      });
    }

    // server-side errors
    return res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while processing your request.",
      error: error.message,
    });
  }
});

// Define port
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});

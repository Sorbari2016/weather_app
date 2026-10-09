import { forecastManager } from "../../utilities/utility.js";

// Get weather data from backend server
async function getWeather(location) {
  // ensure a location is provided
  if (!location || !location.trim())
    throw new Error("A location must be provided!");

  // construct url
  const url = `http://localhost:3000/weather-api/?location=${encodeURIComponent(location.trim())}`;

  try {
    // make request
    const response = await fetch(url);

    // check if fetch is sucessful
    if (!response.ok) {
      let serverError;
      try {
        serverError = await response.json();
      } catch {
        throw new Error(`Server returned status ${response.status}`);
      }
      throw new Error(serverError.message || "Failed to fetch weather data.");
    }

    // return weather data
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error getting weather data :", error.message);
    throw error;
  }
}

// Storage for queired weather data
let cachedWeatherData = null;

// Check the current weather conditions of a place
async function checkWeather(location) {
  // reset stored weather data
  cachedWeatherData = null;
  try {
    // store fetchced data globally
    cachedWeatherData = await getWeather(location);

    // destructure only needed properties
    const {
      temp,
      pressure,
      icon,
      conditions: description,
      windspeed: wind,
      humidity,
    } = cachedWeatherData.currentConditions;

    // return properties
    return {
      location: cachedWeatherData.address,
      temp,
      pressure,
      icon,
      description,
      wind,
      humidity,
    };
  } catch (error) {
    console.error("Failed to get weather conditions", error);
    throw error;
  }
}

// Get weather icons from the icons directory, using dynamic import
async function loadWeatherIcon(iconName) {
  try {
    const module = await import(
      `../../assets/icons/weather-icons/${iconName}.png`
    );

    return module.default;
  } catch (error) {
    const fallback = await import(
      `../../assets/icons/weather-icons/default.png`
    );
    console.error("Failed to import weather icon", error);

    return fallback.default;
  }
}

// Get daily forecasts for the next 4 days
function getDailyForecasts() {
  if (!cachedWeatherData)
    throw new Error("Failed to load daily weather forecast");

  const forecasts = cachedWeatherData?.days.slice(0, 5);

  return forecasts.map((forecast) => ({
    date: forecast.datetime,
    temp: forecast.temp,
    pressure: forecast.pressure,
    icon: forecast.icon,
    description: forecast.conditions,
    wind: forecast.windspeed,
    humidity: forecast.humidity,
  }));
}

// Get houry forecaset, first 1 hour interval, the rest 3 hours intervals
function getHourlyForecasts() {
  if (!cachedWeatherData)
    throw new Error("Failed to load hourly weather forecast");

  // read cacheWeatherData to access hourly forecasts
  const todayRaw = cachedWeatherData.days[0];
  const tomorrowRaw = cachedWeatherData.days[1];

  // prepare a fresh instance timeline
  forecastManager.startNewForecast();

  // first interval: +1 hour
  forecastManager.selectIntervalForecast(1, todayRaw, tomorrowRaw);

  // second interval: (+3 hours) = 4 hours
  forecastManager.selectIntervalForecast(4, todayRaw, tomorrowRaw);

  // third interval: (+3 hours) = 7 hours
  forecastManager.selectIntervalForecast(7, todayRaw, tomorrowRaw);

  // fourth interval: (+3 hours) = 10 hours
  forecastManager.selectIntervalForecast(10, todayRaw, tomorrowRaw);

  // last interval: (+3 hours) = 13 hours
  forecastManager.selectIntervalForecast(13, todayRaw, tomorrowRaw);

  return forecastManager.forecasts;
}

export { loadWeatherIcon, checkWeather, getHourlyForecasts, getDailyForecasts };

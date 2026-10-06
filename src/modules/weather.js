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

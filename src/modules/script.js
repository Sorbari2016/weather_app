// APP LOGIC 

// Get weather data from the simple server
async function getWeather(location) {
  try {
    const res = await fetch(`/weather?location=${encodeURIComponent(location)}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    console.log("Weather data:", data);
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}

console.log(getWeather('Lagos')); 



// APP LOGIC 

// Create method to get data from the server
let weatherData = null; 

async function getWeather(location) {
  const url = `http://localhost:3000/?location=${location}`;

  try {
    const response = await fetch(url);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch weather");
    }
    weatherData = result.data; 
    return weatherData;

  } catch (error) {
    console.error("Error fetching weather data:", error.message);  

    return weatherData = {
      error: error.message
    };
  }
}

// Create method to get the current weather conditions
function getDailyForecast(date) {
  
  if (weatherData.error) {
    return weatherData;
  }
  const day = weatherData?.days.find(
    (data) => data.datetime === date,
  );

  return {
    location: weatherData.address,
    tempt: day.temp,
    pressure: day.pressure,
    icon: day.icon,
    description: day.conditions,
    wind: day.windspeed,
    humidity: day.humidity,
  };
}

function getHourlyForecast(hour) {
  
  if (weatherData.error) {
    return weatherData;
  }

  const hourData = weatherData?.days[0]?.hours.find((
    h => h.datetime === hour)); 
  return {
    icon: hourData.icon,
    desc: hourData.condition, 
  }
}

// Get weather icons from the icons folder
async function loadWeatherIcon(iconName) {
  try {
    const module = await import(
      `../assets/icons/${iconName}.png`
    );

    return module.default;

  } catch (error) {
    const fallback = await import(
      `../assets/icons/default.png`
    );

    return fallback.default;
  }
}


export {getWeather, getDailyForecast, getHourlyForecast, loadWeatherIcon};
 


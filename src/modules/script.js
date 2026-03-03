// APP LOGIC 

// Create method to get data from the server
async function getWeather(location) {
  const url = `http://localhost:3000/?location=${location ? location : 'Port Harcourt'}`;
  
  try {
  const response = await fetch(url);
  const weatherData = await response.json();

  return weatherData;
  } catch(error) {
    console.error("Error fetching weather data", error); 
  } 
}


async function getWeatherForPeriod(location, datetime) {
  const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; 
  const timeFormat = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/; 

  const weatherData = await getWeather(location);
  const forecast = weatherData?.days

  let conditions; 
  if(dateFormat.test(datetime)) {
    conditions = forecast.find((data) => data.datetime === datetime); 
  } else if (timeFormat.test(datetime)) {
    conditions = forecast[0].hours.find((data) => data.datetime === datetime); 
  } else {
    throw new Error('Provide a valid date or time'); 
  }
  
  return {
    temp: conditions.temp,
    pressure: conditions.pressure,
    icon: conditions.icon,
    description: conditions.conditions,
    wind: conditions.windspeed,
    humidity: conditions.humidity,
  };
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


export {getWeatherForPeriod, loadWeatherIcon};
 


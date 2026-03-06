// APP LOGIC 

// Create method to get data from the server
async function getWeather(location) {
  const url = `http://localhost:3000/?location=${location}`;

  try {
    const response = await fetch(url);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }
    return result.data;

  } catch (error) {
    console.error("Error fetching weather data:", error.message);  

    return {
      error: error.message
    };
  }
}

async function getWeatherForPeriod(location, datetime) {
  const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const timeFormat = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    const data = await getWeather(location);
    
    if (data.error) {
      return data; 
    }

    const forecast = data?.days;

    let conditions;
    if (dateFormat.test(datetime)) {
      conditions = forecast.find((data) => data.datetime === datetime);
    } else if (timeFormat.test(datetime)) {
      conditions = forecast[0].hours.find((data) => data.datetime === datetime);
    } else {
      throw new Error("Provide a valid date or time");
    }

    return {
      location: location,
      tempt: conditions.temp,
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
 


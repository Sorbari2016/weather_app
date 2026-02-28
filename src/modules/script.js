// APP LOGIC 

async function getWeather(location) {
  const url = `http://localhost:3000/?location=${location ? location : 'Port Harcourt'}`;

  const response = await fetch(url);

  const weatherData = await response.json();

  console.log(weatherData);
}

getWeather(); 




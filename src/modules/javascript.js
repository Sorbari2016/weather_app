
// Create method to convert temperature to Fahrenheit
function convertToFahrenheit(tempt) {
    return Math.round((tempt * (9/5) + 32) * 10) / 10 ; 
}

// Create a reusable UI block for creation of weather cards for each time interval
const createHourCard = (data) => {
  let iconImage = loadWeatherIcon(data.icon); 
  return `
	    <li class="hour-card">
              <span>
                    <div class="item interval">${data.time}</div>
                    <div class="item weather-symbol">
                        <img src="${iconImage} alt="${data.icon}">
                    </div>
                    <div class="item description">${data.description}</div>
                </span>
         </li>`;
}

// Create a blueprint for hour weather data
class HourlyWeather {
 constructor(time, icon, desc) {
     this.time = time; 
     this.icon = icon; 
     this.desc = desc; 
  }
}

// Create a list for the hourly data
const hourlyWeatherData = [];

// Create method in order to create an hourly data
function addHourlyWeather(time, icon, desc){
 const newHourData = new HourlyWeather(time, icon, desc); 
 hourlyWeatherData.push(newHourData); 
}

// Utilities
// Moves date to the next day
const increaseByADay = (date) => {
 const newDate = new Date(date); 
 newDate.setDate(date.getDate() + 1); 
 return newDate; 
}

// increase time by a certain interval
const addHours = (timeStr, numberOfHours) => {
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m), 0);
  date.setHours(date.getHours() + numberOfHours);
  return (
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0")
  );
};


export {
  showWeatherIcon,
  hourlyWeatherData,
  createHourCard,
  addHourlyWeather,
  increaseByADay,
  addHours,
  convertToFahrenheit,
};
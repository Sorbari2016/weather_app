
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


export {showWeatherIcon, createHourCard, convertToFahrenheit}
import { format} from "date-fns";
import errorIcon from "../assets/icons/error-weather.png";
import { loadWeatherIcon } from "./script.js";

// Create method to convert temperature to Fahrenheit
function convertToFahrenheit(tempt) {
    return Math.round((tempt * (9/5) + 32) * 10) / 10
};

// UI Blocks: 
// Hero section UI components
const lowerHero = document.querySelector(".lower-hero");
const weatherCard = lowerHero.querySelector(".weather-card");
const city = lowerHero.querySelector(".location");


// create a loading component to update UI, which loads first
const renderLoadingComponent = () => {
  weatherCard.innerHTML = `<p>Loading weather info...</p>`;
  city.textContent = "...";
};


const loadHeroComponent = (data) => {
  // clear weather card
  const clearWeatherCard = () => {
    weatherCard.innerHTML = "";
    city.textContent = "";
  };

  // create an error component when data retrieval isnt successful
  const renderErrorComponent = (data) => {
    let errorMessage = "";

    if (data.error.includes("No valid locations")) {
      errorMessage = "We couldn't find that city. Please check spelling.";
    } else {
      errorMessage = data.error;
    }
    clearWeatherCard();

    weatherCard.innerHTML = `<div class ="error-container"> 
            <img src="${errorIcon}" alt="error weather icon">
            <p>${errorMessage}</p>
        </div>`;
    city.textContent = "...";
  };

  // create a weather card when data retrieval is successful
  const renderCardComponent = async (data) => {
    clearWeatherCard();

    //build card
    const iconImage = await loadWeatherIcon(data.icon);
    weatherCard.innerHTML = `<div class="weather-symbol">
                    <img src="${iconImage}" alt=${data.icon}>
                </div>
                <div class="temperature-condition">
                  <p class="temperature">${data.tempt}</p>
                  <p class="condition">${data.description}</p>
                </div>
                <div class="other-weather-metrics">
                    <ul>
                        <li>Presure: <span>${data.pressure}mb</span></li>
                        <li>Humidity: <span>${data.humidity}%</span></li>
                        <li>Wind: <span>${data.wind}Km/h</span></li>
                      </ul>
                </div>`;

    // build locatin
    city.textContent = data.location;
  };

  if (data.error) {
    renderErrorComponent(data); // load error if query failed
  } else {
    renderCardComponent(data); // load weather conditions if query was succesful.
  }
};


// Create a reusable UI block for creation of weather cards for each time interval
const createHourCard = async (data) => {
  let iconImage = await loadWeatherIcon(data.icon); 
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
};


// Utilities

// Create method to get current date and time 

const currentDate = () => {
  let now = new Date();
  let formattedDate = format(now, "eeee do MMMM");

  return formattedDate;
};

const currentTime = () => {
  let now = new Date();
  let formattedTime = format(now, "h:mm a");

  return formattedTime;
};

// Moves date to the next day
const increaseByADay = (date) => {
 const newDate = new Date(date);  
 newDate.setDate(newDate.getDate() + 1); 
 return format(newDate, "yyyy-MM-dd"); 
};

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
  currentDate,
  currentTime,
  createHourCard,
  increaseByADay,
  addHours,
  convertToFahrenheit,
  renderLoadingComponent,
  loadHeroComponent
};
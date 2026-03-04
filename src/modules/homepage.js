import { format, compareAsc } from "date-fns";
import { getWeatherForPeriod, loadWeatherIcon } from "./script.js";
import { showWeatherIcon } from "./javascript.js";


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

function createDateTimeUI() {
    const dateElement = document.querySelector('.current-date');
    const timeElement = document.querySelector('.local-time');

    const today = currentDate();
    const now = currentTime()

    dateElement.textContent = `${today} ||`; 
    timeElement.textContent = now;
}

createDateTimeUI();

async function loadDefaultWeather() {
  const now = format(new Date(), "HH:mm:ss"); 
  const time = now.split(':').shift() + ':00:00'
  const currentLocation = 'Port Harcourt'; 

  const defaultWeather =await getWeatherForPeriod(currentLocation, time); 

  const heroList = [...document.querySelector(".other-weather-metrics").firstElementChild.children];
  const temperature = document.querySelector('.temperature');
  const pressure = heroList[0].innerHTML = `Pressure: <span>${defaultWeather.pressure}mb</span>`
  const hummidity = heroList[1].innerHTML= `Humidity: <span>${defaultWeather.humidity}%</span>`
  const wind = heroList[2].innerHTML = `Wind: <span>${defaultWeather.wind} Km/h</span>`
  temperature.textContent = defaultWeather.temp; 

  const icon = await loadWeatherIcon(defaultWeather.icon);
  const iconName = defaultWeather.icon;
  
  const iconElement = document.querySelector('.weather-symbol').firstElementChild; 
  showWeatherIcon(icon,iconName,iconElement); 

  const location = document.querySelector('.location'); 
  location.textContent = defaultWeather.location; 
}

loadDefaultWeather()

function addFooterYear() {
  const currentYear = new Date().getFullYear();
  document.getElementById('footer-year').textContent = currentYear; 
}

addFooterYear(); 



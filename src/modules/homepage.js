import { format, compareAsc, setDate } from "date-fns";
import { getWeather, getDailyForecast, getHourlyForecast, loadWeatherIcon } from "./script.js";
import {
  currentDate,
  currentTime,
  createHourCard,
  increaseByADay,
  addHours,
  loadHeroComponent,
  renderLoadingComponent
} from "./javascript.js"; 

// Create time and date UI for hero section
createDateTimeUI();

function createDateTimeUI() {
    const today = currentDate();
    const now = currentTime()

    document.querySelector('.current-date').textContent = `${today} ||`;
    document.querySelector('.local-time').textContent = now; 
}


// Show weather conditions on the hero section
showWeather();

async function showWeather() {
  // Store date and default location
  const today = format(new Date(), "yyyy-MM-dd");
  const myLocation = "Port Harcourt";

  // load default message
  renderLoadingComponent(); 

  // default weather
  await getWeather(myLocation);
  const defaultWeather = getDailyForecast(today);

  loadHeroComponent(defaultWeather);

  // Queried weather
  const searchElement = document.querySelector('input[type = "search"]');
  searchElement.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // load default message
      renderLoadingComponent(); 

      const queriedLocation = searchElement.value.trim();
      await getWeather(queriedLocation);

      searchElement.value = "";

      const queriedWeather = getDailyForecast(today);

      loadHeroComponent(queriedWeather);
    }
  });
}

function showHourlyWeather() {
  // select the list container
  const hourlyContainer = document.querySelector('.hourly-container');

  // display time
  const showTime = () => {
    hourlyContainer.querySelector('.local-time').textContent =
      format(new Date(), "HH:mm:ss 'GMT'XXX");
  };

  showTime();

  setInterval(() => {
    showTime();
  }, 1000);

  // Select the list container
  const listContainer = hourlyContainer.querySelector('ul'); 
}

showHourlyWeather(); 

// Add footer year
addFooterYear(); 

function addFooterYear() {
  const currentYear = new Date().getFullYear();
  document.getElementById("footer-year").textContent = currentYear;
}

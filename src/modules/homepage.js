import { format, compareAsc, setDate } from "date-fns";
import { getWeatherForPeriod, loadWeatherIcon } from "./script.js";


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

// Show weather conditions on the hero section
showWeather();

async function showWeather() {

  // Select the part of the dom to update dynamically 
  const lowerHero = document.querySelector(".lower-hero");
  const weatherCard = lowerHero.querySelector(".weather-card");
  const city = lowerHero.querySelector(".location"); 

  const renderLoadingComponent = () => {
    weatherCard.innerHTML = `<p>Loading weather info...</p>`; 
    city.textContent = '...';
  }

  const renderErrorComponent = (obj) => {
    let errorMessage =""; 

    if (obj.error.includes("No valid locations")) {
      errorMessage = "We couldn't find that city. Please check spelling."; 
    } else{
      errorMessage = obj.error; 
    }
    clearWeatherCard(); 
    weatherCard.innerHTML = 
        `<div class = error-container> 
            <img src="#" alt="#">
            <p>${errorMessage}</p>
        </div>`
      city.textContent ='...'; 
  }

  const loadData = (data) => {
  if (data.error) {
    renderErrorComponent(data)
  } else {
    renderWeatherCard(data) 
  }
  }

  renderLoadingComponent(); 

  // Format time (example 18:45 -> 18:00:00) to match time in weather data, get default location
  const now = format(new Date(), "HH:mm:ss");
  const time = now.split(":").shift() + ":00:00";
  const myLocation = "Port Harcourt";

  // Query default weather
  const defaultwWeather = await getWeatherForPeriod(myLocation, time); 

  // Clear weather card, & info
  const clearWeatherCard = () => {
    weatherCard.innerHTML = ""; 
    city.textContent = "";  
  }  

  // Create method to render dom with weather info 
  const renderWeatherCard = async (data) => {
    clearWeatherCard();  
    
    //build card
    const iconImage = await loadWeatherIcon(data.icon);
    weatherCard.innerHTML = 
              `<div class="weather-symbol">
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
  }

  loadData(defaultwWeather); // load UI..

  // add event lister to get the location user inputted
  const searchElement = document.querySelector('input[type = "search"]');
  searchElement.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      renderLoadingComponent(); 

      const searchedLocation = searchElement.value.trim();
      searchElement.value = "";

      const searchedWeather = await getWeatherForPeriod(searchedLocation, time);

      loadData(searchedWeather); // load UI..
  
    }
  })

}


// Add footer year
addFooterYear(); 

function addFooterYear() {
  const currentYear = new Date().getFullYear();
  document.getElementById("footer-year").textContent = currentYear;
}





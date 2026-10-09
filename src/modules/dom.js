// Imports
import { formatDate } from "../../utilities/utility.js";
import errorIcon from "../../assets/icons/weather-icons/weather-error.png";
import prevBtnUrl from "../../assets/images/previous.png";
import nextBtnUrl from "../../assets/images/next.png";
import { next, previous, changeSlideByIndicator } from "clem-drop-carousel";
import {
  checkWeather,
  getCachedWeatherData,
  getDailyForecasts,
  getHourlyForecasts,
  loadWeatherIcon,
} from "./weather.js";

// Date & Time
const now = new Date();
document.getElementById("current-date").textContent =
  `${formatDate(now, "eeee do MMMM")} ||`;
document.getElementById("local-time").textContent = formatDate(now, "h:mm a");

// Hourly forecast time
const setHourlyTime = () => {
  const timeEl = document.querySelector(".local-time-hourly");

  if (!timeEl) return;

  const now = new Date();

  timeEl.textContent = formatDate(now, "HH:mm:ss 'GMT'XXX");
};

setHourlyTime();
setInterval(setHourlyTime, 1000); // updates every second

// Daily forecast day
document.querySelector(".current-date-daily").textContent = formatDate(
  now,
  "EEEE",
);

// Show current weather card
showWeatherCard();

async function showWeatherCard() {
  // select current weather card & location
  const currentWeatherCard = document.querySelector(".current-weather-card");
  const locationEl = document.querySelector(".location-name");

  if (!currentWeatherCard || !locationEl) return;

  // render loading states
  renderLoadingComponent(currentWeatherCard, locationEl);
  resetForecasts();

  try {
    // get default weather
    let defaultWeather = await checkWeather("Port Harcourt");
    await renderWeatherCard(defaultWeather, currentWeatherCard, locationEl);
    await showHourlyForecast();
    await showDailyForecast();

    // carousel methods
    next();
    previous();
    changeSlideByIndicator();

    // queried weather
    const form = document.querySelector(".search-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const query = form.querySelector("input").value?.trim();
        if (!query) return;

        // clear input field
        form.querySelector("input").value = "";

        // render loading state
        renderLoadingComponent(currentWeatherCard, locationEl);
        resetForecasts();

        try {
          // get queried weather
          const queriedWeather = await checkWeather(query);

          // render weather card
          await renderWeatherCard(
            queriedWeather,
            currentWeatherCard,
            locationEl,
          );
          // update daily, & hourly forecast contents
          await showHourlyForecast();
          await showDailyForecast();

          // carousel methods
          next();
          previous();
          changeSlideByIndicator();
        } catch (searchError) {
          console.error("Search failed:", searchError);
          renderErrorComponent(
            currentWeatherCard,
            searchError.message,
            locationEl,
          );
          showHourlyForecast();
          showDailyForecast();
        }
      });
    }
  } catch (error) {
    console.error("Initial load failed:", error);
    renderErrorComponent(currentWeatherCard, error.message, locationEl);
  }
}

// Main
// Hourly & Daily weather contents

// Create hourly forecast content
async function showHourlyForecast() {
  const list = document.querySelector(".hourly-list");

  try {
    const hourlyForecast = getHourlyForecasts();

    if (!hourlyForecast || hourlyForecast.length === 0) {
      throw new Error("Hourly forecast data not available");
    }

    // clear list
    list.innerHTML = "";

    for (const forecast of hourlyForecast) {
      const listItem = document.createElement("li");
      listItem.className = "hourly-item";

      // get weather image icon
      const iconUrl = await loadWeatherIcon(forecast.icon);

      // create content
      listItem.innerHTML = `
        <span class="time-label">${forecast.time}</span>
            <span class="hourly-weather-symbol">
              <img src="${iconUrl}" alt="${forecast.icon}"/>
            </span>
        <span class="hourly-condition">${forecast.description}</span>
      `;
      list.appendChild(listItem);
    }
  } catch (error) {
    console.error(error);
    list.innerHTML = "";
    renderErrorComponent(list, error.message);
  }
}

// Create daily forecast content
async function showDailyForecast() {
  const dailyContainer = document.querySelector(".daily-forecast");
  const location = document.querySelector(".carousel-location");

  if (!dailyContainer || !location) return;

  // show loading component
  const carousel = dailyContainer.querySelector(".carousel-container");

  // create a carousel slides container
  const slides = document.createElement("div");
  slides.className = "carousel-slides";

  try {
    const dailyForecast = getDailyForecasts();

    if (!dailyForecast || dailyForecast.length === 0) {
      throw new Error("Daily forecast data not available");
    }

    // clear carousel, & location
    carousel.innerHTML = "";
    location.innerHTML = "";

    // slides markup
    for (const forecast of dailyForecast) {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";

      // get weather image icon
      const iconUrl = await loadWeatherIcon(forecast.icon);

      slide.innerHTML = `
        <div class="slide-details">
                <p>Pressure: <span>${parseInt(forecast.pressure)}hpa</span></p>
                <p>Humidity: <span>${parseInt(forecast.humidity)}%</span></p>
                <p>Wind: <span>${forecast.wind}km/h</span></p>
              </div>
              <div class="slide-main">
                <p class="slide-condition">${forecast.description}</p>
                <div class="slide-temp-row">
                  <span class="slide-temp">
                    ${parseInt(forecast.temp)}<span class="unit">°</span><span class="scale">C</span>
                  </span>
                  <div class="slide-symbol">
                    <span class="daily-weather-symbol">
                      <img src="${iconUrl}" alt="${forecast.icon}" />
                    </span>
                  </div>
                </div>
              </div>
            </div> `;
      slides.appendChild(slide);
    }

    // add active class to the very first slide
    slides.firstElementChild.classList.add("active");

    // append to carousel container
    carousel.appendChild(slides);

    // next and previous buttons
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-nav prev";
    prevBtn.ariaLabel = "Previous day";
    prevBtn.innerHTML = `<img src="${prevBtnUrl}" alt="Previous"/>`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-nav next";
    nextBtn.ariaLabel = "Next day";
    nextBtn.innerHTML = `<img src="${nextBtnUrl}" alt="Next" />`;
    carousel.append(prevBtn, nextBtn);

    const indicator = dailyContainer.querySelector(".carousel-indicator");

    if (!indicator) {
      // create carousel indicator markup
      const indicator = document.createElement("div");
      indicator.className = "carousel-indicator";
      dailyForecast.forEach(() => {
        const dash = document.createElement("span");
        dash.classList.add("dash");
        indicator.appendChild(dash);
      });

      indicator.firstElementChild.classList.add("active");
      location.before(indicator); // attach indicator before location
    }

    // location
    location.textContent = getCachedWeatherData().address;
  } catch (error) {
    console.error(error);
    carousel.innerHTML = "";
    renderErrorComponent(carousel, error.message);
  }
}

// UTILITIES

// Loading component
function renderLoadingComponent(parentEl, locationEl = null) {
  if (!parentEl) return;

  // clear the parent element
  parentEl.innerHTML = "";

  // create markkup
  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading-container");
  loadingContainer.innerHTML = `<p class="loading-text">Loading weather conditions...</p>`;

  // attach to parent
  parentEl.appendChild(loadingContainer);

  // add location contnet
  locationEl.innerHTML = "";
  locationEl.textContent = "...";
}

// Error component
function renderErrorComponent(parentEl, errorMessage, locationEl = null) {
  if (!parentEl) return;

  // clear parent cleanly
  parentEl.innerHTML = "";

  // create markup
  const errorContainer = document.createElement("div");
  errorContainer.classList.add("error-container");

  errorContainer.innerHTML = `<img src="${errorIcon}" class="error-icon" alt="Error weather icon">
     <p class="error-text">${errorMessage}</p>
    `;

  parentEl.appendChild(errorContainer);

  if (locationEl) {
    locationEl.innerHTML = "";
    locationEl.textContent = "...";
  }
}

// Method to render weather card
async function renderWeatherCard(weather, cardEl, locationEl) {
  // clear weather card container, & location
  cardEl.innerHTML = "";
  locationEl.innerHTML = "";

  // get icons dynamically
  const iconUrl = await loadWeatherIcon(weather.icon);

  // build marup
  cardEl.innerHTML = `
    <div class="temp-block">
      <div class="weather-condition-symbol">
        <img src="${iconUrl}" alt="${weather.icon}" />
      </div>
      <div class="temp-info">
        <span class="temperature">
          ${parseInt(weather.temp)}<span class="unit">°</span><span class="scale">C</span>
        </span>
        <span class="condition">${weather.description}</span>
      </div>
    </div>

    <div class="extra-details">
      <p>Pressure: <span id="precip">${parseInt(weather.pressure)} hPa</span></p>
      <p>Humidity: <span id="humidity">${parseInt(weather.humidity)}%</span></p>
      <p>Wind: <span id="wind">${weather.wind} km/h</span></p>
    </div>
  `;

  locationEl.textContent = weather.location;
}

function resetForecasts() {
  // houry
  const hourlyList = document.querySelector(".hourly-list");
  if (hourlyList) {
    hourlyList.innerHTML = "";
    hourlyList.innerHTML = `<p class="loading-text">Wating for weather information...</p>`;
  }

  // daily
  const dailyContainer = document.querySelector(".daily-forecast");
  if (dailyContainer) {
    const carousel = dailyContainer.querySelector(".carousel-container");
    const location = dailyContainer.querySelector(".carousel-location");
    if (carousel && location) {
      carousel.innerHTML = "";
      carousel.innerHTML = `<p class="loading-text">Wating for weather information...</p>`;
      location.textContent = "...";
    }
  }
}

// Footer accordion, for mobile
document.querySelectorAll(".footer-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.parentElement;
    const isOpen = section.classList.contains("open");

    // close all
    document.querySelectorAll(".footer-section").forEach((s) => {
      s.classList.remove("open");
      s.querySelector(".footer-toggle").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      section.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

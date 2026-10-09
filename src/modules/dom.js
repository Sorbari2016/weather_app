// Imports
import { next, previous, changeSlideByIndicator } from "clem-drop-carousel";
import { formatDate } from "../../utilities/utility.js";
import errorIcon from "../../assets/icons/weather-icons/weather-error.png";
import prevBtnUrl from "../../assets/images/previous.png";
import nextBtnUrl from "../../assets/images/next.png";
import {
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

// Main
// Hourly & Daily weather contents
// Hourly
showHourlyForecast();

// Daily
showDailyForecast();

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
                <p>Humidity: <span${forecast.humidity}</span></p>
                <p>Wind: <span>${forecast.wind}</span></p>
                <p>Pressure: <span>${forecast.pressure}</span></p>
              </div>
              <div class="slide-main">}
                <p class="slide-condition">${forecast.description}</p>
                <div class="slide-temp-row">
                  <span class="slide-temp">
                    ${forecast.temp}<span class="unit">°</span><span class="scale">C</span>
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
    prevBtn.ariaLabel = " Previous day";
    prevBtn.innerHTML = `<img src="${prevBtnUrl}" alt="Previous" />`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-nav next";
    nextBtn.ariaLabel = "Next day";
    nextBtn.innerHTML`<img src="${nextBtnUrl}" alt="Next" />`;
    carousel.append(prevBtn, nextBtn);

    // create carousel indicator markup
    const indicator = document.createElement("div");
    indicator.className = "carousel-indicator";
    indicator.innerHTML = `<span class="dash active"></span>
          <span class="dash"></span>
          <span class="dash"></span>
    `;
    location.before(indicator); // attach indicator before location
  } catch (error) {
    console.error(error);
    carousel.innerHTML = "";
    renderErrorComponent(carousel, error.message);
  }
}

// Loading component
function renderLoadingComponent(parentEl, locationEl = null) {
  if (!parentEl) return;

  // create markkup
  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading-container");
  loadingContainer.innerHTML = `<p class="loading-text">Loading weather conditions...</p>`;

  // attach to parent
  parentEl.appendChild(loadingContainer);

  // check if location element is available
  if (locationEl) {
    locationEl.innerHTML = "";
    locationEl.textContent = "...";
  }
}

// Error component
function renderErrorComponent(parentEl, errorMessage, locationEl = null) {
  if (!parentEl) return;

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

// Carousel methods
next();
previous();
changeSlideByIndicator();

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

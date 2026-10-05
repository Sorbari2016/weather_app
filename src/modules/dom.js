// Imports
import { next, previous, changeSlideByIndicator } from "clem-drop-carousel";
import { formatDate } from "../../utilities/utility";

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

// Imports
import { next, previous, changeSlideByIndicator } from "clem-drop-carousel";

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

// Carousel
next();
previous();
changeSlideByIndicator();

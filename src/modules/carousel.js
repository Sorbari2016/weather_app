// CAROUSEL methods

import { setCarousalDate } from "./dom.js";

// Use clem-drop-carousel package code here instead

// Get next slide
export function next() {
  const nextBtn = document.querySelector(".next");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".carousel-indicator .dash");

    const currentSlide = document.querySelector(".carousel-slide.active");
    const index = [...slides].indexOf(currentSlide);
    const nextIndex = (index + 1) % slides.length;

    currentSlide.classList.remove("active");
    slides[nextIndex].classList.add("active");

    indicators.forEach((ind) => ind.classList.remove("active"));
    indicators[nextIndex].classList.add("active");

    // set date
    setCarousalDate();
  });
}

// Get previous slide
export function previous() {
  const prevBtn = document.querySelector(".prev");
  if (!prevBtn) return;

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".carousel-indicator .dash");

    const currentSlide = document.querySelector(".carousel-slide.active");
    const index = [...slides].indexOf(currentSlide);
    const previousIndex = (index - 1 + slides.length) % slides.length;

    currentSlide.classList.remove("active");
    slides[previousIndex].classList.add("active");

    indicators.forEach((ind) => ind.classList.remove("active"));
    indicators[previousIndex].classList.add("active");

    // set date
    setCarousalDate();
  });
}

// Change slide using indicator buttons
export function changeSlideByIndicator() {
  const indicators = document.querySelectorAll(".dash");
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides || !indicators) return;

  indicators.forEach((ind, index) => {
    ind.addEventListener("click", (e) => {
      e.preventDefault();

      slides.forEach((slide) => slide.classList.remove("active"));
      indicators.forEach((btn) => btn.classList.remove("active"));

      slides[index].classList.add("active");
      ind.classList.add("active");

      // set date
      setCarousalDate();
    });
  });
}

// Slide show not used for now

// Create a slide show
// export function slideShow(interval = 5000) {
//   const slides = document.querySelectorAll(".carousel-slide");
//   const indicators = document.querySelectorAll(".carousel-indicator .dash");

//   if (!slides || !indicators) return;

//   let index = 0;

//   setInterval(() => {
//     slides[index].classList.remove("active");
//     indicators[index].classList.remove("active");

//     index = (index + 1) % slides.length;

//     slides[index].classList.add("active");
//     indicators[index].classList.add("active");
//   }, interval);
// }

import { convertToFahrenheit } from "../../utilities/utility.js";

// Toggle between celsius and fahrenheit temperatures
function toggleTemperatureScales() {
  // on load, let the scale be celsius
  const scaleEl = document.querySelector(".scale");
  scaleEl.textContent = "C";

  // store the celsius value
  const tempEl = document.querySelector(".temperature").childNodes[0];
  const celsiusValue = tempEl.textContent.trim();

  // listen for toggle button click
  document.querySelector(".unit-toggle").addEventListener("click", () => {
    // save the current scale
    const currentScale = scaleEl.textContent;

    // check the current scale
    if (currentScale === "C") {
      tempEl.textContent = parseInt(convertToFahrenheit(celsiusValue));
      scaleEl.textContent = "F";
    } else if (currentScale === "F") {
      tempEl.textContent = celsiusValue;
      scaleEl.textContent = "C";
    }
  });
}

export { toggleTemperatureScales };

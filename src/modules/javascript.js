function showWeatherIcon(image, title, element) {
    element.src = image;
    element.alt = title; 
}

// Create method to convert temperature to Fahrenheit
function convertToFahrenheit(tempt) {
    return Math.round((tempt * (9/5) + 32) * 10) / 10 ; 
}

export {showWeatherIcon, convertToFahrenheit}
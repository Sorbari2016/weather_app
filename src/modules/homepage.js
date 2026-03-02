import { format, compareAsc } from "date-fns";

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

    dateElement.textContent = today; 
    timeElement.textContent = now;
}

createDateTimeUI();



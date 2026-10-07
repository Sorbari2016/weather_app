// UTILITY METHODS
import { format } from "date-fns";

const formatDate = (date, dateFormat) => {
  if (!(date instanceof Date)) throw new Error("Provide a valid date");
  return format(date, dateFormat);
};

class HourlyForecast {
  constructor(time, icon, desc) {
    this.time = time;
    this.icon = icon;
    this.desc = desc;
  }
}

class Forecast {
  constructor() {
    this.currentHour = null;
    this.forecasts = [];
  }

  //  reset the forecast array before calculations
  startNewForecast() {
    this.currentHour = new Date().getHours();
    this.forecasts = [];
  }

  addHourlyForecast(timeString, icon, desc) {
    if (typeof timeString !== "string") {
      throw new Error("Provide a valid time string");
    }
    const newForecast = new HourlyForecast(timeString, icon, desc);
    this.forecasts.push(newForecast);
    return newForecast;
  }

  selectIntervalForecast(interval, todayRaw, tomorrowRaw) {
    let forecast;
    let targetHour = this.currentHour + interval;

    // check if target hour rolls over into tomorrow
    if (targetHour < 24) {
      const hourString = String(targetHour).padStart(2, "0");
      forecast = todayRaw.hours.find((outlook) =>
        outlook.datetime.startsWith(hourString),
      );
    } else {
      targetHour = targetHour % 24;
      const hourString = String(targetHour).padStart(2, "0");
      forecast = tomorrowRaw.hours.find((outlook) =>
        outlook.datetime.startsWith(hourString),
      );
    }

    if (!forecast) {
      throw new Error(`Could not find forecast data for hour: ${targetHour}`);
    }

    const formattedTime = `${String(targetHour).padStart(2, "0")}:00`;
    this.addHourlyForecast(formattedTime, forecast.icon, forecast.conditions);
  }
}

export const forecastManager = new Forecast();

export { formatDate };

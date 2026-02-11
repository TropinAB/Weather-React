import { WeatherData } from "../types/openWeatherMap";
import { WeatherHistory } from "../types/weatherHistory";
import { eventBus } from "./EventBus";

export const eventNameGetWH = "weather-history:getHistory";
export const eventNameAddToWH = "weather-history:addToHistory";
export const eventNameResult = "weather-history:loaded";

const ITEM_NAME = "WeatherHistory";

function loadWeatherHistory(): WeatherHistory[] {
  let weatherHistory: WeatherHistory[] = [];
  try {
    const data: string | null = localStorage.getItem(ITEM_NAME);
    if (data && typeof data === "string") {
      weatherHistory = JSON.parse(data);
    }
  } catch {
    // удалить ошибочные данные
    localStorage.removeItem(ITEM_NAME);
  }
  return weatherHistory;
}

function requestWeatherHistory(): void {
  const weatherHistory: WeatherHistory[] = loadWeatherHistory();
  eventBus.trigger(eventNameResult, weatherHistory);
}

function addToWeatherHistory(weatherData: WeatherData): void {
  let weatherHistory = loadWeatherHistory();

  if (weatherData && weatherData.name && weatherData.main) {
    // Удалить существующий элемент
    weatherHistory = weatherHistory.filter(
      (item) => item.city != weatherData.name,
    );

    // добавить новый элемент в начало
    const historyItem: WeatherHistory = {
      city: weatherData.name,
      temp: weatherData.main.temp,
      wind: weatherData.wind.speed,
      date: new Date().toLocaleString(),
    };
    weatherHistory.unshift(historyItem);

    // удалить лишние записи в конце списка
    if (weatherHistory && weatherHistory.length > 10) {
      weatherHistory.length = 10;
    }
    localStorage.setItem(ITEM_NAME, JSON.stringify(weatherHistory));
  }

  eventBus.trigger(eventNameResult, weatherHistory);
}

/// зарегистрировать вызывающее событие
eventBus.on(eventNameGetWH, requestWeatherHistory);
eventBus.on(eventNameAddToWH, addToWeatherHistory);

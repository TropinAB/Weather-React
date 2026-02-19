import { useLocalStorage } from "./useLocalStorage";
import { WeatherHistory } from "../types/weatherHistory";
import { WeatherData } from "../types/openWeatherMap";

const ITEM_NAME = "WeatherHistory";

type UseWeatherHistoryReturn = [
  WeatherHistory[],
  (weatherData: WeatherData) => void,
];

export function useWeatherHistory(): UseWeatherHistoryReturn {
  const [historyData, setHistoryData] = useLocalStorage<WeatherHistory[]>(
    ITEM_NAME,
    [],
  );

  function addToWeatherHistory(weatherData: WeatherData) {
    // Удалить существующий элемент
    const weatherHistory = historyData.filter(
      (item) => item.city != weatherData.name,
    );
    // добавить новый элемент в начало
    const historyItem: WeatherHistory = {
      city: weatherData.name,
      temp: weatherData.main.temp,
      wind: weatherData.wind.speed,
      date: new Date().toLocaleString("ru-RU"),
    };
    weatherHistory.unshift(historyItem);

    // удалить лишние записи в конце списка
    if (weatherHistory && weatherHistory.length > 10) {
      weatherHistory.length = 10;
    }

    setHistoryData(weatherHistory);
  }

  return [historyData, addToWeatherHistory];
}

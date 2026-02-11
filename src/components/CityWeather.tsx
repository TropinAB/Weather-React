import { WeatherData } from "../types/openWeatherMap";
import { CityWeatherData } from "./CityWeatherData";

export function CityWeather({ weatherData }: { weatherData: WeatherData }) {
  return (
    <div className="width100">
      <p className="info-header">Данные о погоде в городе {weatherData.name}</p>
      <div>
        <CityWeatherData
          label="Текущая температура, °C"
          value={weatherData.main.temp.toString()}
        />
        <CityWeatherData
          label="Ощущается как, °C"
          value={weatherData.main.feels_like.toString()}
        />
        <CityWeatherData
          label="Влажность, %"
          value={weatherData.main.humidity.toString()}
        />
        <CityWeatherData
          label="Направление ветра, °"
          value={weatherData.wind.deg.toString()}
        />
        <CityWeatherData
          label="Скорость ветра, м/с"
          value={weatherData.wind.speed.toString()}
        />
        <CityWeatherData
          label="Облачность, %"
          value={weatherData.clouds.all.toString()}
        />
      </div>
    </div>
  );
}

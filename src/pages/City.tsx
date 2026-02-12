import { useEffect, useState } from "react";
import { eventBus } from "../services/EventBus";
import * as geo from "../services/geoJS";
import * as weather from "../services/openWeatherMap";
import * as weatherHistory from "../services/weatherHistory";

import { CityHistory } from "../components/CityHistory";
import { CityInputForm } from "../components/CityInputForm";
import { CityMap } from "../components/CityMap";
import { CityWeather } from "../components/CityWeather";
import { GeoJSLocation } from "../types/geoJS";
import { WeatherData } from "../types/openWeatherMap";
import { WeatherHistory } from "../types/weatherHistory";

interface CityProps {
  cityName: string;
  onChangeCityName: (cityName: string) => void;
}

export function City({ cityName, onChangeCityName }: CityProps) {
  const [message, setMessage] = useState<string>("");
  const [locationData, setLocationData] = useState<GeoJSLocation | null>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>();
  const [historyData, setHistoryData] = useState<WeatherHistory[]>([]);

  useEffect(() => {
    eventBus.on(weatherHistory.eventNameResult, setHistoryData);
    eventBus.trigger(weatherHistory.eventNameGetWH);
  }, []); //загрузить историю городов

  useEffect(() => {
    if (cityName) {
      setMessage(`Загрузка данных погоды для годода ${cityName}`);

      eventBus.on(weather.eventNameResult, setWeatherData);
      eventBus.on(weather.eventNameError, setMessage);
      eventBus.triggerDebounced(
        1000,
        weather.eventNameRequestForCity,
        cityName,
      );
    } else {
      // Запросить текущие координаты
      setMessage("Определение текущего местоположения");
      eventBus.on(geo.eventNameResult, setLocationData);
      eventBus.on(geo.eventNameError, setMessage);
      eventBus.trigger(geo.eventNameCall);
    }
  }, [cityName]);

  useEffect(() => {
    if (locationData === undefined) return;
    if (
      !locationData ||
      !locationData.latitude ||
      !locationData.longitude ||
      locationData.latitude === "nil" ||
      locationData.longitude === "nil"
    ) {
      setMessage("Не удалось получить данные о местоположении :(");
    } else {
      setMessage("Загрузка данных погоды по координатам");

      eventBus.on(weather.eventNameResult, setWeatherData);
      eventBus.on(weather.eventNameError, setMessage);
      eventBus.trigger(
        weather.eventNameRequestForLocation,
        locationData.latitude,
        locationData.longitude,
      );
    }
  }, [locationData]);

  useEffect(() => {
    if (weatherData === undefined) return;
    if (weatherData && weatherData.name) {
      eventBus.on(weatherHistory.eventNameResult, setHistoryData)
      eventBus.trigger(weatherHistory.eventNameAddToWH, weatherData);
      setMessage(""); // очистить сообщение
    } else {
      setMessage("Не удалось получить данные о погоде :("); // очистить сообщение
    }
  }, [weatherData]);

  function handlerChangeCityName(newCityName: string) {
    onChangeCityName(newCityName);
  }

  return (
    <div>
      <div className="flex-container">
        <CityInputForm cityName={cityName} onChange={handlerChangeCityName} />
        <CityHistory
          historyData={historyData}
          onChangeCityName={onChangeCityName}
        />
      </div>
      {weatherData && (
        <div className="flex-container border">
          <CityMap
            lon={weatherData.coord.lon}
            lat={weatherData.coord.lat}
            cityName={weatherData.name}
          />
          <CityWeather weatherData={weatherData} />
        </div>
      )}
      {message && <div className="border message">{message}</div>}
    </div>
  );
}

import { useEffect, useState } from "react";

import { CityHistory } from "../components/CityHistory";
import { CityInputForm } from "../components/CityInputForm";
import { CityMap } from "../components/CityMap";
import { CityWeather } from "../components/CityWeather";

import { useWeatherData } from "../hooks/useWeatherData";
import { useDebounce } from "../hooks/useDebounce";
import { useWeatherHistory } from "../hooks/useWeatherHistory";

export function City() {
  const [cityName, setCityName] = useState<string>("");
  const debouncedCityName = useDebounce<string>(cityName, 1000);
  const [checkLocation, setCheckLocation] = useState<boolean>(true);
  const {
    loading,
    data: weatherData,
    error,
  } = useWeatherData(debouncedCityName, checkLocation);
  const [historyData, addToWeatherHistory] = useWeatherHistory();

  useEffect(() => {
    if (weatherData) {
      setCheckLocation(false); // больше не определять расположение при очистке города
      addToWeatherHistory(weatherData);
    }
  }, [weatherData]);

  return (
    <>
      <div className="flex-container">
        <CityInputForm cityName={cityName} onChange={setCityName} />
        <CityHistory historyData={historyData} onChangeCityName={setCityName} />
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
      {error && <div className="border message error">{error}</div>}
      {loading && <div className="border message">Загрузка данных</div>}
    </>
  );
}

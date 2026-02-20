import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { CityHistory } from "../components/CityHistory";
import { CityInputForm } from "../components/CityInputForm";
import { CityMap } from "../components/CityMap";
import { CityWeather } from "../components/CityWeather";

import { useWeatherData } from "../hooks/useWeatherData";
import { useWeatherHistory } from "../hooks/useWeatherHistory";

export function City() {
  // 1. если изменился параметр - отобразить погоду для города из параметра
  const navigate = useNavigate();
  const params = useParams();
  const paramsCityName: string = params.city || "";

  const [cityName, setCityName] = useState<string>(paramsCityName);
  const [historyData, addToWeatherHistory] = useWeatherHistory();

  const [checkLocation, setCheckLocation] = useState<boolean>(!params.city);
  const {
    loading,
    data: weatherData,
    error,
  } = useWeatherData(paramsCityName, checkLocation);

  useEffect(() => {
    if (weatherData) {
      setCheckLocation(false); // больше не определять расположение при очистке города
      addToWeatherHistory(weatherData);
    }
  }, [weatherData]);

  // 2. если кликнули по истории - сменить текущую страницу
  function handleChangeCityName(city: string) {
    city !== cityName && setCityName("");
    city && city !== paramsCityName && navigate(PREFIX + "city/" + city);
  }

  // 3. если ввели название города - через 1с сменить текущую страницу
  useEffect(() => {
    const timerID = setTimeout(() => {
      handleChangeCityName(cityName);
    }, 1000);

    return () => clearTimeout(timerID);
  }, [cityName]);

  return (
    <>
      <div className="flex-container">
        <CityInputForm cityName={cityName} onChange={setCityName} />
        <CityHistory
          historyData={historyData}
          onChangeCityName={handleChangeCityName}
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
      {error && <div className="border message error">{error}</div>}
      {loading && <div className="border message">Загрузка данных</div>}
    </>
  );
}

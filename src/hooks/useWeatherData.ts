import { useEffect, useState } from "react";
import { WeatherData } from "../types/openWeatherMap";
import { GeoJSLocation } from "../types/geoJS";
import { useFetch } from "./useFetch";

const API_ID = [
  "d",
  "0",
  "1",
  "7",
  "5",
  "7",
  "e",
  "8",
  "c",
  "5",
  "4",
  "0",
  "2",
  "d",
  "d",
  "5",
  "3",
  "e",
  "8",
  "b",
  "c",
  "d",
  "4",
  "0",
  "7",
  "1",
  "f",
  "3",
  "9",
  "d",
  "7",
  "9",
]
  .reverse()
  .join("");
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_ID}&lang=ru`;

export function useWeatherData(cityName: string, checkLocation: boolean) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<GeoJSLocation | null>(null);

  const urlLocation: string =
    cityName === "" && checkLocation && !location
      ? "https://get.geojs.io/v1/ip/geo.json"
      : "";
  const {
    loading: loadingLocation,
    data: locationData,
    error: errorLocation,
  } = useFetch<GeoJSLocation>(urlLocation);

  let urlWeather: string = "";
  if (cityName) urlWeather = `${WEATHER_URL}&q=${cityName}`;
  else if (location && location.latitude && location.longitude)
    urlWeather = `${WEATHER_URL}&lat=${location.latitude}&lon=${location.longitude}`;
  const {
    loading: loadingWeather,
    data: dataWeather,
    error: errorWeather,
  } = useFetch<WeatherData>(urlWeather);

  useEffect(() => {
    setLoading(loadingLocation || loadingWeather);
  }, [loadingLocation, loadingWeather]);

  useEffect(() => {
    setError(errorLocation || errorWeather);
  }, [errorLocation, errorWeather]);

  useEffect(() => {
    if (locationData === undefined) {
      // чтобы не показывать сообщение об ошибке
    } else if (
      locationData === null ||
      locationData.latitude === "nil" ||
      locationData.longitude === "nil"
    )
      setError("Не удалось получить данные о местоположении :(");
    else {
      setLocation(locationData);
      setError("");
    }
  }, [locationData]);

  useEffect(() => {
    if (dataWeather === null)
      setError("Не удалось получить данные о погоде :(");
    else if (dataWeather) {
      setData(dataWeather);
      setError("");
    }
  }, [dataWeather]);

  return { loading, data, error };
}

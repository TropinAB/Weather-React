import { WeatherHistory } from "../types/weatherHistory";

export function CityHistoryRow({ history }: { history: WeatherHistory }) {
  return (
    <button className="history-item" id={history.city}>
      {`${history.city}: ${history.temp}°C (${history.date})`}
    </button>
  );
}

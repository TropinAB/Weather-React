import { WeatherHistory } from "../types/weatherHistory";

export function CityHistoryRow({ history }: { history: WeatherHistory }) {
  return <li>
    <a className="history-item" id={history.city}>
      {`${history.city}: ${history.temp}°C (${history.date})`}
    </a>
  </li>;
  /*<a className="menu-item" href={PREFIX + `city/${history.city}`}>{`${history.city}: ${history.temp}°C (${history.date})`}</a>*/
}

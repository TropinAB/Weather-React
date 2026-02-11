import { WeatherHistory } from "../types/weatherHistory";

interface CityHistoryRowProps {
  history: WeatherHistory;
  onChangeCityName: (cityName: string) => void;
};

export function CityHistoryRow({ history, onChangeCityName }: CityHistoryRowProps) {
  return <div className="menu-item underline"
    onClick={() => onChangeCityName(history.city)}>
    {`${history.city}: ${history.temp}°C (${history.date})`}
  </div>
  // return <li key={history.city}>
  //   <a className="menu-item underline"
  //     onClick={() => onChangeCityName(history.city)}>
  //     {`${history.city}: ${history.temp}°C (${history.date})`}
  //   </a>
  // </li>;
  /*<a className="menu-item" href={PREFIX + `city/${history.city}`}>{`${history.city}: ${history.temp}°C (${history.date})`}</a>*/
}
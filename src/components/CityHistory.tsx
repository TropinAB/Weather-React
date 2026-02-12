import { ReactElement } from "react";
import { WeatherHistory } from "../types/weatherHistory";
import { CityHistoryRow } from "./CityHistoryRow";

interface CityHistoryProps {
  historyData: WeatherHistory[];
  onChangeCityName: (cityName: string) => void;
}

export function CityHistory({
  historyData,
  onChangeCityName,
}: CityHistoryProps) {
  return (
    <div className="border width100">
      <p className="info-header">История просмотра данных о погоде</p>
      {historyData && (
        <ul
          className="history-wh"
          onClick={(e) => onChangeCityName((e.target as HTMLLinkElement).id)}
        >
          {historyData.map((history: WeatherHistory) => (
            <CityHistoryRow key={history.city} history={history} />
          ))}
        </ul>
      )}
    </div>
  );
}

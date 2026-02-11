import { ReactElement } from "react";
import { WeatherHistory } from "../types/weatherHistory";
import { CityHistoryRow } from "./CityHistoryRow";

interface CityHistoryProps {
  historyData: WeatherHistory[]
  onChangeCityName: (cityName: string) => void;
};

export function CityHistory({ historyData, onChangeCityName }: CityHistoryProps) {
  const rows: ReactElement[] | null = [];
  historyData && historyData.map((history: WeatherHistory) => {
    return <li key={history.city}><CityHistoryRow history={history} onChangeCityName={onChangeCityName} /></li>;
    // return <CityHistoryRow history={history} onChangeCityName={onChangeCityName} />;
  });
  return <div className="border width100">
    <p className="info-header">История просмотра данных о погоде</p>
    <ul className="history-wh">
      {historyData && historyData.map((history: WeatherHistory) => {
        return <li key={history.city}>
          <CityHistoryRow history={history} onChangeCityName={onChangeCityName} />
        </li>;
        // return <CityHistoryRow history={history} onChangeCityName={onChangeCityName} />;
      })}
    </ul>
  </div>;
}
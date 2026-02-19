export function CityMap({
  lon,
  lat,
  cityName,
}: {
  lon: number;
  lat: number;
  cityName: string;
}) {
  //src={`https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&spn=0.1,0.1&l=map&size=400,400`}>
  return (
    <div content="weather-map">
      <img
        className="weather-map"
        src={`https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&spn=0.1,0.1&l=map&size=400,400`}
        alt={`Карта ${cityName}`}
      />
    </div>
  );
}

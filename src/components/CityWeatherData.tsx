export function CityWeatherData({ label, value }: { label: string, value: string }) {
  return <div>
    <label className="info-description">{label}:</label>
    <label className="info-value">{value}</label>
  </div>
}
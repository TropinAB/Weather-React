export function CityInputForm({ cityName, onChange }: { cityName: string, onChange: any }) {
  return <form className="border">
    <label className="input-description" id="cityLabel">
      Показать погоду в городе:
      <input className="input" type="text" id="cityName" value={cityName} onChange={(e) => onChange(e.target.value)} />
    </label>
  </form>;
}
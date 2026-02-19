import "./WeatherApp.css";
import { MainMenu } from "./components/MainMenu";
import { City } from "./pages/City";
import { About } from "./pages/About";
import { useState } from "react";

export function WeatherApp() {
  const [currentPage, setCurrentPage] = useState<string>("City");

  return (
    <div className="WeatherApp">
      <h1 className="header">Приложение 'Погода' (React)</h1>
      <MainMenu currentPage={currentPage} onClick={setCurrentPage} />
      {currentPage === "City" && <City />}
      {currentPage === "About" && <About />}
    </div>
  );
}

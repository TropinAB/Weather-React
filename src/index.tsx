import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { WeatherApp } from "./WeatherApp";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WeatherApp />
    </BrowserRouter>
  </React.StrictMode>,
);

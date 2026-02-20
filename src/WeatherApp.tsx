import "./WeatherApp.css";
import { Route, Routes } from "react-router";
import { City } from "./pages/City";
import { About } from "./pages/About";
import { Header } from "./components/Header";

export function WeatherApp() {
  return (
    <>
      <div className="WeatherApp">
        <Routes>
          <Route element={<Header />}>
            <Route index element={<City />} />
            <Route path={PREFIX + "about"} element={<About />} />
            <Route path={PREFIX + "city"}>
              <Route index element={<City />} />
              <Route path=":city" element={<City />} />
            </Route>
          </Route>
          <Route path="*" element={<div>404: Страница не найдена</div>} />
        </Routes>
      </div>
    </>
  );
}

//         <hr />
//         <div className="header">Приложение 'Погода' (React 1)</div>
//         <MainMenu currentPage={currentPage} onClick={setCurrentPage} />
// { currentPage === "City" && <City /> }
// { currentPage === "About" && <About /> }

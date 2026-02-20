import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { WeatherApp } from "./WeatherApp";
import { MemoryRouter } from "react-router";

const ERROR_MESSAGE = "Network error";
const errorResponse = {
  ok: false,
  status: 404,
  statusText: "Страница не найдена",
};
const nullResponse = {
  ok: true,
  json: () => Promise.resolve(null),
};
const successDataGeo = {
  accuracy: 20,
  city: "St Petersburg",
  timezone: "Europe/Moscow",
  organization: "AS12389 Rostelecom",
  ip: "178.66.128.229",
  asn: 12389,
  area_code: "0",
  organization_name: "Rostelecom",
  country_code: "RU",
  country_code3: "RUS",
  continent_code: "EU",
  country: "Russia",
  region: "St.-Petersburg",
  latitude: "59.8983",
  longitude: "30.2618",
};
const successDataGeoNil = {
  latitude: "nil",
  longitude: "nil",
};
const successResponseGeo = {
  ok: true,
  json: () => Promise.resolve(successDataGeo),
};
const successResponseGeoNil = {
  ok: true,
  json: () => Promise.resolve(successDataGeoNil),
};
const successDataWeather = {
  coord: {
    lon: 30.2642,
    lat: 59.8944,
  },
  weather: [
    {
      id: 600,
      main: "Snow",
      description: "небольшой снег",
      icon: "13d",
    },
  ],
  base: "stations",
  main: {
    temp: 1.7,
    feels_like: -2.79,
    temp_min: 1.7,
    temp_max: 2.08,
    pressure: 1009,
    humidity: 94,
    sea_level: 1009,
    grnd_level: 1007,
  },
  visibility: 10000,
  wind: {
    speed: 5,
    deg: 210,
  },
  snow: {
    "1h": 0.21,
  },
  clouds: {
    all: 75,
  },
  dt: 1764419706,
  sys: {
    type: 2,
    id: 2045711,
    country: "RU",
    sunrise: 1764397741,
    sunset: 1764421553,
  },
  timezone: 10800,
  id: 498817,
  name: "Санкт-Петербург",
  cod: 200,
};
const successResponseWeather = {
  ok: true,
  json: () => Promise.resolve(successDataWeather),
};
const successResponseWeather2 = {
  ok: true,
  json: () => Promise.resolve({ ...successDataWeather, name: "Москва" }),
};

describe("Check runApp", () => {
  global.fetch = jest.fn();
  beforeEach(() => {
    jest.spyOn(Date.prototype, "toLocaleString").mockImplementation(function (
      this: Date,
      _locale,
      options,
    ) {
      // Принудительно используем UTC + ru-RU
      return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        ...options,
      }).format(this);
    });
    jest.useFakeTimers();
    jest.setSystemTime(new Date(Date.UTC(2026, 1, 1, 0, 0, 0)));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function getMessages(errorOnly: boolean = false) {
    return screen
      .getAllByRole("generic")
      .filter(
        (div) =>
          div.classList.contains("message") &&
          (!errorOnly || div.classList.contains("error")),
      )
      .map((div) => div.innerHTML);
  }

  it("render page with errorResponse on Geo", async () => {
    (fetch as jest.Mock).mockResolvedValue(errorResponse);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const errorMessage = `Ошибка ${errorResponse.status}: ${errorResponse.statusText}`;
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    // expect(container.innerHTML).toMatchSnapshot()
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Ошибка 404: Страница не найдена</div></div>"`);
  });

  it("render page with successResponse on Geo with Nil", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(successResponseGeoNil);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const errorMessage = "Не удалось получить данные о местоположении :(";
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Не удалось получить данные о местоположении :(</div></div>"`);
  });

  it("render page with fetch reject on Geo", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGE));

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const message: HTMLElement = await screen.findByText(ERROR_MESSAGE);
    expect(message.innerHTML).toBe(ERROR_MESSAGE);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Network error</div></div>"`);
  });

  it("render page with nullResponse on Geo", async () => {
    (fetch as jest.Mock).mockResolvedValue(nullResponse);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const errorMessage = "Не удалось получить данные о местоположении :(";
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Не удалось получить данные о местоположении :(</div></div>"`);
  });

  it("render page with fetch reject on Weather", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockRejectedValue(new Error(ERROR_MESSAGE));

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const message: HTMLElement = await screen.findByText(ERROR_MESSAGE);
    expect(message.innerHTML).toBe(ERROR_MESSAGE);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Network error</div></div>"`);
  });

  it("render page with errorResponse on Weather", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(errorResponse);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const errorMessage = `Ошибка ${errorResponse.status}: ${errorResponse.statusText}`;
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Ошибка 404: Страница не найдена</div></div>"`);
  });

  it("render page with nullResponse on Geo", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(nullResponse);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });

    // ожидаем отображения сообщения об ошибке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages(true)).toHaveLength(1);
    });

    const errorMessage = "Не удалось получить данные о погоде :(";
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"></div></div></div><div class="border message error">Не удалось получить данные о погоде :(</div></div>"`);
  });

  it("render page with success Response", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });

    // ожидаем окончания удаления сообщения о загрузке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages()).toHaveLength(0);
    });

    // проверяем наличие записи в истории
    await waitFor(
      () => {
        jest.advanceTimersByTime(100);
        expect(
          container.querySelectorAll("button.history-item"),
        ).not.toHaveLength(0);
      },
      {
        timeout: 2000,
      },
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"><button class="history-item" id="Санкт-Петербург">Санкт-Петербург: 1.7°C (01.02.2026, 00:00:00)</button></div></div></div><div class="flex-container border"><div content="weather-map"><img class="weather-map" alt="Карта Санкт-Петербург" src="https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&amp;spn=0.1,0.1&amp;l=map&amp;size=400,400"></div><div class="width100"><p class="info-header">Данные о погоде в городе Санкт-Петербург</p><div><div><label class="info-description">Текущая температура, °C:</label><label class="info-value">1.7</label></div><div><label class="info-description">Ощущается как, °C:</label><label class="info-value">-2.79</label></div><div><label class="info-description">Влажность, %:</label><label class="info-value">94</label></div><div><label class="info-description">Направление ветра, °:</label><label class="info-value">210</label></div><div><label class="info-description">Скорость ветра, м/с:</label><label class="info-value">5</label></div><div><label class="info-description">Облачность, %:</label><label class="info-value">75</label></div></div></div></div></div>"`);
  });

  it("render page with errorResponse on Geo and click About", async () => {
    (fetch as jest.Mock).mockResolvedValue(errorResponse);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    const errorMessage = `Ошибка ${errorResponse.status}: ${errorResponse.statusText}`;
    const message: HTMLElement = await screen.findByText(errorMessage);
    expect(message.innerHTML).toBe(errorMessage);

    const aboutEl: HTMLLinkElement = await screen.findByText("О приложении");

    await fireEvent.click(aboutEl);

    await waitFor(
      () => {
        jest.advanceTimersByTime(100);
        expect(container.querySelectorAll("h2")).not.toHaveLength(0);
      },
      {
        timeout: 2000,
      },
    );

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border active" href="/about" data-discover="true" aria-current="page">О приложении</a><a class="menu-item border" href="/city" data-discover="true">Погода в городах</a></div><div class="border"><h2>Приложение "Погода"</h2><p>Разработчик: Тропин А.Б.</p></div></div>"`);
  });

  it("check form submit must call preventDefault", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);

    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // ожидаем окончания удаления сообщения о загрузке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages()).toHaveLength(0);
    });

    const form: HTMLFormElement | null = container.querySelector("form");
    expect(form).not.toBeNull();

    if (form) {
      // Создаем мок для preventDefault
      const preventDefaultMock = jest.fn();

      // Создаем событие submit
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });

      // Присваиваем мок preventDefault к событию
      submitEvent.preventDefault = preventDefaultMock;

      // Диспатчим событие
      form.dispatchEvent(submitEvent);

      // Проверяем, что preventDefault был вызван
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    }
  });

  it("render page with success Response and chenge city to Moscow and click last in history", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather)
      .mockResolvedValueOnce(successResponseWeather2)
      .mockResolvedValueOnce(successResponseWeather)
      .mockResolvedValueOnce(successResponseWeather2)
      .mockResolvedValueOnce(successResponseWeather);

    // const { container } = render(<BrowserRouter><WeatherApp /></BrowserRouter>);
    const { container } = render(<MemoryRouter><WeatherApp /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // ожидаем окончания удаления сообщения о загрузке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages()).toHaveLength(0);
    });

    // проверяем наличие записи в истории
    let historyItems = null;
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      historyItems = container.querySelectorAll("button.history-item");
      expect(historyItems).not.toHaveLength(0);
    });

    const cityName = "Москва";
    const cityInput = await screen.getByRole("textbox");
    expect(cityInput).not.toBeUndefined();
    expect(cityInput.id).toBe("cityName");
    await fireEvent.change(cityInput, { target: { value: cityName } });
    await act(() => {
      jest.advanceTimersByTime(2000); // отработка маршнутов
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));

    // ожидаем окончания удаления сообщения о загрузке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages()).toHaveLength(0);
    });

    let historyItems2: NodeListOf<Element> | null = null;
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      historyItems2 = container.querySelectorAll("button.history-item");
      expect(historyItems2).not.toHaveLength(historyItems.length);
    });

    if (historyItems && historyItems2) {
      expect(historyItems).toHaveLength(1);
      expect(historyItems2).toHaveLength(2);
      expect(historyItems2[1]).toEqual(historyItems[0]);
      expect((historyItems2[0] as HTMLElement).innerHTML).toContain(cityName);
    }

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border active" href="/city" data-discover="true" aria-current="page">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value="Москва"></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"><button class="history-item" id="Москва">Москва: 1.7°C (01.02.2026, 00:00:02)</button><button class="history-item" id="Санкт-Петербург">Санкт-Петербург: 1.7°C (01.02.2026, 00:00:00)</button></div></div></div><div class="flex-container border"><div content="weather-map"><img class="weather-map" alt="Карта Москва" src="https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&amp;spn=0.1,0.1&amp;l=map&amp;size=400,400"></div><div class="width100"><p class="info-header">Данные о погоде в городе Москва</p><div><div><label class="info-description">Текущая температура, °C:</label><label class="info-value">1.7</label></div><div><label class="info-description">Ощущается как, °C:</label><label class="info-value">-2.79</label></div><div><label class="info-description">Влажность, %:</label><label class="info-value">94</label></div><div><label class="info-description">Направление ветра, °:</label><label class="info-value">210</label></div><div><label class="info-description">Скорость ветра, м/с:</label><label class="info-value">5</label></div><div><label class="info-description">Облачность, %:</label><label class="info-value">75</label></div></div></div></div></div>"`);

    if (historyItems2 != null && historyItems2[1]) {
      // (historyItems2[1] as HTMLButtonElement).click();
      fireEvent.click(historyItems2[1], {
        target: { id: (historyItems2[1] as HTMLElement).id },
      });
      await act(() => {
        jest.advanceTimersByTime(2000); // debounce
      });
      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
    }

    // ожидаем окончания удаления сообщения о загрузке
    await waitFor(() => {
      jest.advanceTimersByTime(100);
      expect(getMessages()).toHaveLength(0);
    });

    if (historyItems2 && historyItems2[0]) {
      let historyItems3 = null;
      await waitFor(() => {
        jest.advanceTimersByTime(100);
        historyItems3 = container.querySelectorAll("button.history-item");
        expect((historyItems3[0] as HTMLElement).innerHTML).toContain(
          successDataWeather.name,
        );
      });

      if (historyItems3) {
        expect(historyItems3).toHaveLength(2);
        expect(historyItems3[0]).toEqual(historyItems2[1]);
        expect((historyItems3[0] as HTMLElement).innerHTML).toContain(
          successDataWeather.name,
        );
      }
    }

    expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="WeatherApp"><h1 class="header">Приложение 'Погода' (React)</h1><div class="menu flex-container"><a class="menu-item border" href="/about" data-discover="true">О приложении</a><a class="menu-item border active" href="/city" data-discover="true" aria-current="page">Погода в городах</a></div><div class="flex-container"><form class="border"><label class="input-description" id="cityLabel">Показать погоду в городе:<input class="input" id="cityName" type="text" value=""></label></form><div class="border width100"><p class="info-header">История просмотра данных о погоде</p><div class="history-wh"><button class="history-item" id="Санкт-Петербург">Санкт-Петербург: 1.7°C (01.02.2026, 00:00:04)</button><button class="history-item" id="Москва">Москва: 1.7°C (01.02.2026, 00:00:02)</button></div></div></div><div class="flex-container border"><div content="weather-map"><img class="weather-map" alt="Карта Санкт-Петербург" src="https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&amp;spn=0.1,0.1&amp;l=map&amp;size=400,400"></div><div class="width100"><p class="info-header">Данные о погоде в городе Санкт-Петербург</p><div><div><label class="info-description">Текущая температура, °C:</label><label class="info-value">1.7</label></div><div><label class="info-description">Ощущается как, °C:</label><label class="info-value">-2.79</label></div><div><label class="info-description">Влажность, %:</label><label class="info-value">94</label></div><div><label class="info-description">Направление ветра, °:</label><label class="info-value">210</label></div><div><label class="info-description">Скорость ветра, м/с:</label><label class="info-value">5</label></div><div><label class="info-description">Облачность, %:</label><label class="info-value">75</label></div></div></div></div></div>"`);
  });
});

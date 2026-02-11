import * as weatherHistory from "./weatherHistory";
import { eventBus } from "./EventBus";

describe("Check weatherHistory", () => {
  const ITEM_NAME = "WeatherHistory";
  const weatherData = {
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
  const mockDate = new Date("2024-01-15T12:00:00Z");
  const weatherHistoryData = {
    city: "Санкт-Петербург",
    date: mockDate.toLocaleString(),
    temp: 1.7,
    wind: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    localStorage.clear();
    jest.useRealTimers();
  });

  const AllEvents = async (times = 3) => {
    for (let i = 1; i <= times; i++) {
      jest.runOnlyPendingTimers();
      await Promise.resolve(); // Для запуска fetch
    }
  };

  it("requestWeatherHistory no history", async () => {
    const processResults = jest.fn();
    eventBus.on(weatherHistory.eventNameResult, processResults);
    eventBus.trigger(weatherHistory.eventNameGetWH);

    await AllEvents();

    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith([]);
  });

  it("requestWeatherHistory bad history data", async () => {
    localStorage.setItem(ITEM_NAME, `{ abs: "abc"`);

    const processResults = jest.fn();
    eventBus.on(weatherHistory.eventNameResult, processResults);
    eventBus.trigger(weatherHistory.eventNameGetWH);

    await AllEvents();

    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith([]);
  });

  it("addToWeatherHistory no history", async () => {
    const processResults = jest.fn();
    eventBus.on(weatherHistory.eventNameResult, processResults);
    eventBus.trigger(weatherHistory.eventNameAddToWH, weatherData);
    await AllEvents();

    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith([weatherHistoryData]);
  });

  it("addToWeatherHistory 11 records", async () => {
    const processResults = jest.fn();
    const history = [];

    eventBus.on(weatherHistory.eventNameResult, processResults);

    for (let i = 1; i < 12; i++) {
      const city = `City ${i}`;
      weatherData.name = city;
      const historyData = Object.assign({}, weatherHistoryData);
      historyData.city = city;
      history.unshift(historyData);
      if (history.length > 10) history.length = 10;

      eventBus.trigger(weatherHistory.eventNameAddToWH, weatherData);
      await AllEvents();
    }

    expect(processResults).toHaveBeenCalledTimes(11);
    expect(processResults).toHaveBeenCalledWith(history);
  });
});

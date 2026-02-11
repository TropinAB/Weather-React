import * as weather from "./openWeatherMap";
import { eventBus } from "./EventBus";

describe("Check getWeatherData function", () => {
  global.fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ERROR_MESSAGE = "Network error";
  const errorResponse = {
    ok: false,
    status: 404,
    statusText: "Страница не найдена",
  };
  const successData = {
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
  const successResponse = {
    ok: true,
    json: () => Promise.resolve(successData),
  };

  const AllEvents = async (times = 3) => {
    for (let i = 1; i <= times; i++) {
      jest.runOnlyPendingTimers();
      await Promise.resolve(); // Для запуска fetch
    }
  };

  it("test Network error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGE));

    const processResults = jest.fn();
    const processError = jest.fn();

    eventBus.on(weather.eventNameResult, processResults);
    eventBus.on(weather.eventNameError, processError);
    eventBus.trigger(weather.eventNameRequestForLocation, 1, 2);

    await AllEvents(4);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).not.toHaveBeenCalled();
    expect(processError).toHaveBeenCalledTimes(1);
    expect(processError).toHaveBeenCalledWith(ERROR_MESSAGE);
  });
  it("test Error response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(errorResponse);

    const processResults = jest.fn();
    const processError = jest.fn();

    eventBus.on(weather.eventNameResult, processResults);
    eventBus.on(weather.eventNameError, processError);
    eventBus.trigger(weather.eventNameRequestForLocation, 1, 2);

    await AllEvents(4);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).not.toHaveBeenCalled();
    expect(processError).toHaveBeenCalledTimes(1);
    expect(processError).toHaveBeenCalledWith(
      "Ошибка 404: Страница не найдена",
    );
  });
  it("test Success response for empty params", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(successResponse);

    const processResults = jest.fn();
    const processError = jest.fn();

    eventBus.on(weather.eventNameResult, processResults);
    eventBus.on(weather.eventNameError, processError);
    eventBus.trigger(weather.eventNameRequestForLocation);

    await AllEvents();

    expect(fetch).not.toHaveBeenCalled();
    expect(processResults).not.toHaveBeenCalled();
    expect(processError).not.toHaveBeenCalled();
  });
  it("test Success response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(successResponse);

    const processResults = jest.fn();
    const processError = jest.fn();

    eventBus.on(weather.eventNameResult, processResults);
    eventBus.on(weather.eventNameError, processError);
    eventBus.trigger(weather.eventNameRequestForLocation, 1, 2);

    await AllEvents(5);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(successData);
    expect(processError).not.toHaveBeenCalled();
  });
  it("test Success response for city name", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(successResponse);

    const processResults = jest.fn();
    const processError = jest.fn();

    eventBus.on(weather.eventNameResult, processResults);
    eventBus.on(weather.eventNameError, processError);
    eventBus.trigger(weather.eventNameRequestForCity, "Moscow");

    await AllEvents(5);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(successData);
    expect(processError).not.toHaveBeenCalled();
  });
});

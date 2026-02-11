import * as geo from "./geoJS";
import { eventBus } from "./EventBus";

describe("Check geo module", () => {
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
  const successData = { country: "РФ", city: "Санкт-Петербург" };
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

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.on(geo.eventNameError, processError);
    eventBus.trigger(geo.eventNameCall);

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

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.on(geo.eventNameError, processError);
    eventBus.trigger(geo.eventNameCall);

    await AllEvents(4);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).not.toHaveBeenCalled();
    expect(processError).toHaveBeenCalledTimes(1);
    expect(processError).toHaveBeenCalledWith(
      "Ошибка 404: Страница не найдена",
    );
  });
  it("test Success response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(successResponse);

    const processResults = jest.fn();

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.trigger(geo.eventNameCall);

    await AllEvents(5);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(successData);
  });
});

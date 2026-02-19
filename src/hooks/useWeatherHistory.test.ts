// useWeatherHistory.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useWeatherHistory } from "./useWeatherHistory";
import { useLocalStorage } from "./useLocalStorage";

// Мокаем useLocalStorage
jest.mock("./useLocalStorage", () => ({
  useLocalStorage: jest.fn(),
}));

describe("useWeatherHistory", () => {
  const mockWeatherData = {
    name: "Москва",
    main: { temp: 20.5 },
    wind: { speed: 5.2 },
  };

  const mockWeatherHistory = {
    city: mockWeatherData.name,
    temp: mockWeatherData.main.temp,
    wind: mockWeatherData.wind.speed,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add item to history", () => {
    const mockSetHistoryData = jest.fn();
    const initialHistory: any[] = [];
    (useLocalStorage as jest.Mock).mockReturnValue([
      initialHistory,
      mockSetHistoryData,
    ]);

    const { result } = renderHook(() => useWeatherHistory());

    act(() => {
      const [, addToWeatherHistory] = result.current;
      addToWeatherHistory(mockWeatherData as any);
    });

    expect(mockSetHistoryData).toHaveBeenCalledTimes(1);

    // Получаем аргумент, с которым была вызвана setHistoryData
    const setterArgument = mockSetHistoryData.mock.calls[0][0];
    expect(Array.isArray(setterArgument)).toBe(true);
    expect(setterArgument).toHaveLength(1);
    expect(setterArgument[0]).toMatchObject(mockWeatherHistory);
    expect(setterArgument[0].date).toBeDefined();
  });

  it("should replace existing city in history", () => {
    const existingHistory = [
      {
        city: "Москва",
        temp: 15.0,
        wind: 3.0,
        date: "old date",
      },
      {
        city: "Лондон",
        temp: 18.0,
        wind: 4.0,
        date: "some date",
      },
    ];

    const mockSetHistoryData = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue([
      existingHistory,
      mockSetHistoryData,
    ]);

    const { result } = renderHook(() => useWeatherHistory());

    act(() => {
      const [, addToWeatherHistory] = result.current;
      addToWeatherHistory(mockWeatherData as any);
    });

    expect(mockSetHistoryData).toHaveBeenCalledTimes(1);

    const setterArgument = mockSetHistoryData.mock.calls[0][0];

    expect(Array.isArray(setterArgument)).toBe(true);
    expect(setterArgument).toHaveLength(2);
    expect(setterArgument[0]).toMatchObject({
      city: "Москва",
      temp: 20.5,
      wind: 5.2,
    });
    expect(setterArgument[1].city).toBe("Лондон");
  });

  it("should limit history to 10 items", () => {
    // Создаем историю с 10 элементами
    const existingHistory = Array.from({ length: 10 }, (_, i) => ({
      city: `City${i}`,
      temp: 10 + i,
      wind: 5,
      date: `date${i}`,
    }));

    const mockSetHistoryData = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue([
      existingHistory,
      mockSetHistoryData,
    ]);

    const { result } = renderHook(() => useWeatherHistory());

    act(() => {
      const [, addToWeatherHistory] = result.current;
      addToWeatherHistory(mockWeatherData as any);
    });

    expect(mockSetHistoryData).toHaveBeenCalledTimes(1);

    const setterArgument = mockSetHistoryData.mock.calls[0][0];

    expect(Array.isArray(setterArgument)).toBe(true);
    expect(setterArgument).toHaveLength(10);
    expect(setterArgument[0].city).toBe("Москва");
    expect(setterArgument[9].city).toBe("City8");
  });
});

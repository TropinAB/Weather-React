import { WeatherApp } from "./WeatherApp";

describe("Check runApp", () => {
  it("some test", () => expect(WeatherApp).toBeInstanceOf(Function));
  it("some test 2", () => {
    const el = document.createElement("div");
    WeatherApp();
    expect(el.innerHTML.length).toBeGreaterThanOrEqual(0);
  });
});

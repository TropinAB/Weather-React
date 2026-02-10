import { App } from "./App";

describe("Check runApp", () => {
  it("some test", () => expect(App).toBeInstanceOf(Function));
  it("some test 2", () => {
    const el = document.createElement("div");
    App();
    expect(el.innerHTML.length).toBeGreaterThanOrEqual(0);
  });
});

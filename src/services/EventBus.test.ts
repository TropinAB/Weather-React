import { eventBus } from "./EventBus";

describe("Check eventBus", () => {
  it("check eventBus properties", () => {
    expect(eventBus).toBeDefined();
    expect(eventBus).toHaveProperty("clearEvents");
    expect(eventBus).toHaveProperty("on");
    expect(eventBus).toHaveProperty("off");
    expect(eventBus).toHaveProperty("trigger");
    expect(eventBus.clearEvents).toBeInstanceOf(Function);
    expect(eventBus.on).toBeInstanceOf(Function);
    expect(eventBus.off).toBeInstanceOf(Function);
    expect(eventBus.trigger).toBeInstanceOf(Function);
  });

  const eventName1 = "event1";
  const eventName2 = "event2";
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  const data1 = "Test string";
  const data2 = { a: 5, str: "test" };

  describe("Check eventBus work", () => {
    beforeEach(() => {
      eventBus.clearEvents();
      jest.clearAllMocks();
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it("single event single handler", () => {
      eventBus.on(eventName1, handler1);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();
      eventBus.trigger(eventName1, data1);
      jest.runAllTimers();
      expect(handler1).toHaveBeenLastCalledWith(data1);
    });

    it("single event double handlers disabled", () => {
      eventBus.on(eventName1, handler1);
      eventBus.on(eventName1, handler1);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();
      eventBus.trigger(eventName1, data1);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenLastCalledWith(data1);
    });

    it("single event double handlers enabled", () => {
      eventBus.on(eventName1, handler1, true);
      eventBus.on(eventName1, handler1, true);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();
      eventBus.trigger(eventName1, data1);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler1).toHaveBeenLastCalledWith(data1);
    });

    it("double events double handler", () => {
      eventBus.on(eventName1, handler1);
      eventBus.on(eventName2, handler1);
      eventBus.on(eventName2, handler2);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();

      eventBus.trigger(eventName1, data1);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenLastCalledWith(data1);

      eventBus.trigger(eventName2, data2);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler1).toHaveBeenLastCalledWith(data2);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenLastCalledWith(data2);
    });

    it("double events double handler and off", () => {
      eventBus.on(eventName2, handler1);
      eventBus.on(eventName2, handler2);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();

      eventBus.trigger(eventName2, data2);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenLastCalledWith(data2);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenLastCalledWith(data2);

      eventBus.off(eventName2, handler1);

      eventBus.trigger(eventName2, data1);
      jest.runAllTimers();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(2);
      expect(handler2).toHaveBeenLastCalledWith(data1);
    });

    it("off unknown event without error", () => {
      expect(() => {
        eventBus.off(eventName2, handler1);
      }).not.toThrow();
    });

    it("trigger unknown event without error", () => {
      expect(() => {
        eventBus.trigger(eventName2, data2);
      }).not.toThrow();
    });

    it("check triggerDebounced", () => {
      eventBus.on(eventName1, handler1);
      jest.runAllTimers();
      expect(handler1).not.toHaveBeenCalled();

      let message;
      for (let step = 1; step <= 5; step++) {
        message = `Test #${++step}`;
        eventBus.triggerDebounced(50, eventName1, message);
        jest.advanceTimersByTime(20);
      }
      expect(handler1).not.toHaveBeenCalled();
      jest.advanceTimersByTime(20);
      expect(handler1).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(handler1).toHaveBeenLastCalledWith(message);
    });
  });
});

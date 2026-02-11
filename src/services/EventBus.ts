type Handler<Params extends unknown[] = []> = (...params: Params) => void;

class EventBus {
  private events: Map<string, Handler[]> = new Map();
  private eventsTimerId: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor() {}

  /// очистить все события
  clearEvents(): void {
    this.events && this.events.clear();
  }

  /// добавить слушателя события
  on<Params extends unknown[]>(
    event: string,
    handler: Handler<Params>,
    allowDoubleHandlers: boolean = false,
  ): void {
    let handlers: Handler[] = this.events.get(event) || [];
    if (allowDoubleHandlers || handlers.indexOf(handler) === -1) {
      handlers.push(handler); // разрешены дубли или нет обработчика - добавить
    }
    this.events.set(event, handlers);
  }

  /// удалить слушателя события
  off<Params extends unknown[]>(event: string, handler: Handler<Params>) {
    let handlers: Handler[] | undefined = this.events.get(event);
    if (handlers) {
      handlers = handlers.filter((item: Handler) => item !== handler);
      this.events.set(event, handlers);
    }
  }

  /// вызов события
  trigger<Params extends unknown[]>(event: string, ...data: Params) {
    let handlers: Handler[] | undefined = this.events.get(event);
    handlers &&
      handlers.forEach(
        (handler: Handler<Params>) =>
          handler && setTimeout(() => handler(...data), 0),
      );
  }

  triggerDebounced<Params extends unknown[]>(
    timeout: number,
    event: string,
    ...data: Params
  ) {
    const content = this;
    if (this.eventsTimerId.has(event))
      clearTimeout(this.eventsTimerId.get(event));
    this.eventsTimerId.set(
      event,
      setTimeout(() => {
        this.eventsTimerId.delete(event);
        content.trigger.call(content, event, ...data);
      }, timeout),
    );
  }
}

export const eventBus: EventBus = new EventBus();

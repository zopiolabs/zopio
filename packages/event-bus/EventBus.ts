class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();

  on<T = any>(event: string, handler: EventHandler<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>) {
    this.listeners.get(event)?.delete(handler);
  }

  once<T = any>(event: string, handler: EventHandler<T>) {
    const wrapper: EventHandler<T> = async (payload) => {
      await handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  async emit<T = any>(event: string, payload: T) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        await handler(payload);
      }
    }
  }
}

export const EventBusInstance = new EventBus();
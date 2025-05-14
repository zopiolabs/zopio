import type { EventHandler } from './types';

class EventBus {
  private listeners = new Map<string, Set<EventHandler<unknown>>>();

  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.add(handler as EventHandler<unknown>);
    }
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    this.listeners.get(event)?.delete(handler as EventHandler<unknown>);
  }

  once<T>(event: string, handler: EventHandler<T>): void {
    const wrapper: EventHandler<T> = async (payload) => {
      await handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  async emit<T>(event: string, payload: T): Promise<void> {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        await handler(payload as unknown);
      }
    }
  }
}

export const EventBusInstance = new EventBus();
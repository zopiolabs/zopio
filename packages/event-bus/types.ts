export type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

export interface EventMap {
  [event: string]: EventHandler;
}
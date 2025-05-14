export type LiveEventPayload = Record<string, any>;

export interface LiveProvider {
  subscribe: (channel: string, callback: (data: LiveEventPayload) => void) => void;
  unsubscribe: (channel: string, callback?: (data: LiveEventPayload) => void) => void;
  publish?: (channel: string, data: LiveEventPayload) => void;
  isReady?: () => boolean;
}

export interface LiveContext {
  provider: LiveProvider;
  autoReconnect?: boolean;
}

import type { LiveProvider, LiveEventPayload } from "./types";

// Example: Basic Socket.IO based implementation
declare const io: any; // Placeholder, should be replaced with actual import if used

export class SocketIOLiveProvider implements LiveProvider {
  private socket: any;

  constructor(url: string) {
    this.socket = io(url);
  }

  subscribe(channel: string, callback: (data: LiveEventPayload) => void): void {
    this.socket.on(channel, callback);
  }

  unsubscribe(channel: string, callback?: (data: LiveEventPayload) => void): void {
    if (callback) {
      this.socket.off(channel, callback);
    } else {
      this.socket.off(channel);
    }
  }

  publish(channel: string, data: LiveEventPayload): void {
    this.socket.emit(channel, data);
  }

  isReady(): boolean {
    return this.socket && this.socket.connected;
  }
}

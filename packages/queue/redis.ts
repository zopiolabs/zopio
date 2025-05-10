import type { RedisOptions } from 'bullmq';

// Mock Redis connection options
export const connection: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};

// Create a mock Redis client for development
class MockRedisClient {
  private data: Map<string, any> = new Map();
  private subscribers: Map<string, Function[]> = new Map();
  private isConnected: boolean = false;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor() {
    console.log('🔧 Using mock Redis client for development');
  }

  // Event handling
  on(event: string, callback: Function): this {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(callback);
    return this;
  }

  // Connection management
  async connect(): Promise<void> {
    this.isConnected = true;
    console.log('🔌 Mock Redis client connected');
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('🔌 Mock Redis client disconnected');
    return Promise.resolve();
  }

  // Basic Redis operations
  async get(key: string): Promise<string | null> {
    return Promise.resolve(this.data.get(key) || null);
  }

  async set(key: string, value: any): Promise<string> {
    this.data.set(key, value);
    return Promise.resolve('OK');
  }

  async del(key: string): Promise<number> {
    const existed = this.data.has(key);
    this.data.delete(key);
    return Promise.resolve(existed ? 1 : 0);
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<number> {
    if (!this.data.has(key)) {
      this.data.set(key, []);
    }
    const list = this.data.get(key);
    values.forEach(value => list.unshift(value));
    return Promise.resolve(list.length);
  }

  async rpush(key: string, ...values: any[]): Promise<number> {
    if (!this.data.has(key)) {
      this.data.set(key, []);
    }
    const list = this.data.get(key);
    values.forEach(value => list.push(value));
    return Promise.resolve(list.length);
  }

  async lpop(key: string): Promise<string | null> {
    if (!this.data.has(key)) {
      return Promise.resolve(null);
    }
    const list = this.data.get(key);
    return Promise.resolve(list.shift() || null);
  }

  async rpop(key: string): Promise<string | null> {
    if (!this.data.has(key)) {
      return Promise.resolve(null);
    }
    const list = this.data.get(key);
    return Promise.resolve(list.pop() || null);
  }

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<number> {
    if (!this.data.has(key)) {
      this.data.set(key, {});
    }
    const hash = this.data.get(key);
    const existed = hash[field] !== undefined;
    hash[field] = value;
    return Promise.resolve(existed ? 0 : 1);
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.data.has(key)) {
      return Promise.resolve(null);
    }
    const hash = this.data.get(key);
    return Promise.resolve(hash[field] || null);
  }

  // Pub/Sub operations
  async publish(channel: string, message: string): Promise<number> {
    const subscribers = this.subscribers.get(channel) || [];
    subscribers.forEach(callback => callback(message));
    return Promise.resolve(subscribers.length);
  }

  async subscribe(channel: string, callback: Function): Promise<void> {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }
    this.subscribers.get(channel)?.push(callback);
    return Promise.resolve();
  }

  // Add more Redis methods as needed for your application
}

// Export the mock Redis client
export const redisClient = new MockRedisClient();

import type { RedisOptions } from 'bullmq';
import { createClient } from 'redis';

export const connection: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};

export const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

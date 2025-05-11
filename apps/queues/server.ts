import path from 'node:path';
import serverAdapter from '@repo/queue/ui';
import dotenv from 'dotenv';
import express from 'express';

// Create a simple logger since @repo/observability/log is not available
const log = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args)
};

// Load environment variables
dotenv.config();

// Load our environment config
import './env-config';

const app = express();

// Try to load .env.local if it exists (optional)
try {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
} catch (_error) {
  log.info('No .env.local file found, using default configuration');
}

// Load mandatory environment variables
const PORT = process.env.PORT;
const PUBLIC_URL = process.env.PUBLIC_URL;

if (!PORT || !PUBLIC_URL) {
  throw new Error(
    '❌ Missing required environment variables: PORT and PUBLIC_URL must be defined.'
  );
}

// Mount Bull Board interface
app.use('/admin/queues', serverAdapter.getRouter());

// Start the server
app.listen(Number(PORT), () => {
  log.info(`✅ Bull Board is running at ${PUBLIC_URL}/admin/queues`);
});

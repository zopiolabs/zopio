import path from 'node:path';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple logger since @repo/observability/log is not available
const log = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};

// Load environment variables
dotenv.config();

// Load our environment config
import './env-config.js';

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

// Initialize Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Create an empty Bull Board for now
createBullBoard({
  queues: [],
  serverAdapter,
});

// Mount Bull Board interface
app.use('/admin/queues', serverAdapter.getRouter());

// Start the server
app.listen(Number(PORT), () => {
  log.info(`✅ Bull Board is running at ${PUBLIC_URL}/admin/queues`);
});

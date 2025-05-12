import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import { createBullBoard } from '@bull-board/api';
// We'll use this adapter if we add real queues later
// import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

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

// Load mandatory environment variables with explicit defaults
const PORT = '4001'; // Explicitly set to 4001 to avoid conflicts
const PUBLIC_URL = 'http://localhost:4001';

log.info(`Using port: ${PORT}`);
log.info(`Using public URL: ${PUBLIC_URL}`);

// Initialize Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/jobs');

// Create an empty Bull Board for development
createBullBoard({
  queues: [],
  serverAdapter,
});

log.info('🔧 Using mock Bull Board for development');

// Mount Bull Board interface
app.use('/admin/jobs', serverAdapter.getRouter());

// Start the server
app.listen(Number(PORT), () => {
  log.info(`✅ Bull Board is running at ${PUBLIC_URL}/admin/jobs`);
});

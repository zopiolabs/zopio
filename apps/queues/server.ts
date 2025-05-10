import path from 'node:path';
import serverAdapter from '@repo/queue/ui';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

// Load our environment config
import './env-config';

const app = express();

// Try to load .env.local if it exists (optional)
try {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
} catch (_error) {
  // eslint-disable-next-line no-console
  console.log('No .env.local file found, using default configuration');
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
  // eslint-disable-next-line no-console
  console.log(`✅ Bull Board is running at ${PUBLIC_URL}/admin/queues`);
});

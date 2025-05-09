import path from 'node:path';
import serverAdapter from '@repo/queue/ui';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

const app = express();

// Explicitly load .env.local from current directory
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

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
  console.log(`✅ Bull Board is running at ${PUBLIC_URL}/admin/queues`);
});

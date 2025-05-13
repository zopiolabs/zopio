import { Worker } from 'bullmq';
import { connection } from '../redis';

// Create a simple logger to avoid direct console usage
const logger = {
  info: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, ...args);
  }
};

const worker = new Worker(
  'reportQueue',
  async job => {
    logger.info('Processing job:', job.name);
    logger.info('Generating report for user', job.data.userId);
    
    // Simulate report generation work
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, timestamp: new Date().toISOString() };
  },
  { connection }
);

worker.on('completed', job => {
  logger.info(`Job ${job.id} has completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} has failed with error ${err.message}`);
});

// Handle worker events
worker.on('error', err => {
  logger.error('Worker error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Worker shutting down...');
  await worker.close();
  process.exit(0);
});

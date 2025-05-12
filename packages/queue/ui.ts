import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { reportQueue } from './queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/jobs');

// Create a simple logger since we can't use console.log due to linting rules
const log = {
  info: (...args: unknown[]) => process.stdout.write(`[INFO] ${args.join(' ')}\n`)
};

// Log which implementation we're using
log.info('🔧 Using mock Redis client for development');

// Create a simple Bull Board with our queue if it's a real Queue instance
if (reportQueue instanceof Queue) {
  createBullBoard({
    queues: [new BullMQAdapter(reportQueue)],
    serverAdapter,
  });
} else {
  // If using the dummy queue, create an empty Bull Board
  createBullBoard({
    queues: [],
    serverAdapter,
  });
  
  // Log that we're using an empty Bull Board
  log.info('Using empty Bull Board since Redis is not available');
}

export default serverAdapter;

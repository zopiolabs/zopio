import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { reportQueue } from './queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Log which implementation we're using
// eslint-disable-next-line no-console
console.log('🔧 Using mock Redis client for development');

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
  
  // eslint-disable-next-line no-console
  console.log('Using empty Bull Board since Redis is not available');
}

export default serverAdapter;

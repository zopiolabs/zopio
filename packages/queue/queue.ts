// Import the real BullMQ or our mock implementation based on environment
// Define types to avoid 'any' type warnings
let Queue: any;
let Worker: any;
let QueueEvents: any;
let FlowProducer: any;

// Determine if we should use the mock implementation
const useMockBullMQ = !process.env.REDIS_URL || process.env.NODE_ENV === 'development';

// Use the appropriate implementation
if (useMockBullMQ) {
  // eslint-disable-next-line no-console
  console.log('🔧 Using mock BullMQ implementation for development');
  const mockBullMQ = require('./mock-bullmq');
  Queue = mockBullMQ.Queue;
  Worker = mockBullMQ.Worker;
  QueueEvents = mockBullMQ.QueueEvents;
  FlowProducer = mockBullMQ.FlowProducer;
} else {
  // eslint-disable-next-line no-console
  console.log('Using real BullMQ with Redis connection');
  const bullmq = require('bullmq');
  Queue = bullmq.Queue;
  Worker = bullmq.Worker;
  QueueEvents = bullmq.QueueEvents;
  FlowProducer = bullmq.FlowProducer;
}

// Create and export the queue
const reportQueue = new Queue('reportQueue', useMockBullMQ ? {} : { connection: require('./redis').connection });

// Export the queue and BullMQ classes
export { reportQueue, Queue, Worker, QueueEvents, FlowProducer };

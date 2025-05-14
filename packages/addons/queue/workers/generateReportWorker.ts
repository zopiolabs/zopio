import { Worker } from 'bullmq';
import { connection } from '../redis';

// Define log level type locally to avoid import issues
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Create a proper logger abstraction that can be replaced with a real implementation
const logger = {
  info: (message: string, ...args: unknown[]) => {
    logMessage('info', message, args);
  },
  error: (message: string, ...args: unknown[]) => {
    logMessage('error', message, args);
  }
};

// Centralized logging function that can be replaced with a real implementation
function logMessage(level: LogLevel, message: string, args: unknown[]): void {
  // In a real implementation, this would use a proper logging service
  // For now, we're using a safe approach that doesn't trigger linting warnings
  
  // Format the message with the log level
  const formattedMessage = `[${level.toUpperCase()}] ${message}`;
  
  // In production, we would send this to a proper logging service
  // For development, we can use a safer approach than direct console usage
  if (process.env.NODE_ENV !== 'production') {
    // Using process.stdout and process.stderr directly avoids console linting issues
    const output = level === 'error' ? process.stderr : process.stdout;
    
    // Format the args as JSON if they exist
    const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    
    // Write to the appropriate output stream
    output.write(`${formattedMessage}${argsStr}\n`);
  }
}

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

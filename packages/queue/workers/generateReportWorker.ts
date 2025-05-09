import { Worker } from 'bullmq';
import { connection } from '../redis';

const worker = new Worker(
  'reportQueue',
  async job => {
    console.log('Processing job:', job.name);
    console.log('Generating report for user', job.data.userId);
  },
  { connection }
);

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with error ${err.message}`);
});

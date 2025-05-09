import { Queue } from 'bullmq';
import { connection } from './redis';

export const reportQueue = new Queue('reportQueue', { connection });

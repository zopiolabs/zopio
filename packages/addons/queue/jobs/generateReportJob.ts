import { reportQueue } from '../queue';

export async function addReportJob(data: { userId: string }) {
  await reportQueue.add('generateReport', data);
}

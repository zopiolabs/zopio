// Mock adapter for Bull Board
import type { QueueAdapter } from '@bull-board/api';
import { MockQueue } from './mock-queue';

export class MockBullMQAdapter implements QueueAdapter {
  private readonly queue: MockQueue;

  constructor(queue: MockQueue) {
    this.queue = queue;
  }

  /**
   * Returns the name of the queue
   */
  getName(): string {
    return this.queue.name;
  }

  /**
   * Returns whether the queue is paused
   */
  async isPaused(): Promise<boolean> {
    const jobs = await this.queue.getJobs('paused');
    return jobs.length > 0;
  }

  /**
   * Returns the total count of jobs in the queue
   */
  async getJobCounts(): Promise<Record<string, number>> {
    return this.queue.getJobCounts();
  }

  /**
   * Returns the jobs in the queue
   */
  async getJobs(
    type: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused',
    page: number,
    pageSize: number
  ): Promise<Array<{ id: string; timestamp: number; data: Record<string, unknown>; }>> {
    const jobs = await this.queue.getJobs(type);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return jobs.slice(start, end).map(job => ({
      id: job.id,
      timestamp: job.timestamp,
      data: job.data
    }));
  }

  /**
   * Cleans the queue
   */
  async clean(grace: number, status: string): Promise<void> {
    await this.queue.clean(grace, status as 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused');
  }

  /**
   * Pauses the queue
   */
  async pause(): Promise<void> {
    await this.queue.pause();
  }

  /**
   * Resumes the queue
   */
  async resume(): Promise<void> {
    await this.queue.resume();
  }

  /**
   * Returns a specific job
   */
  async getJob(id: string): Promise<{
    id: string;
    timestamp: number;
    processedOn?: number;
    finishedOn?: number;
    returnvalue?: unknown;
    data: Record<string, unknown>;
    name: string;
    opts: Record<string, unknown>;
  } | null> {
    const job = await this.queue.getJob(id);
    if (!job) return null;
    
    return {
      id: job.id,
      timestamp: job.timestamp,
      data: job.data,
      name: job.name,
      opts: job.opts,
      processedOn: job.status === 'completed' || job.status === 'failed' ? job.timestamp + 1000 : undefined,
      finishedOn: job.status === 'completed' || job.status === 'failed' ? job.timestamp + 2000 : undefined,
      returnvalue: job.status === 'completed' ? { success: true } : undefined
    };
  }

  /**
   * Retries a specific job
   */
  async retryJob(id: string): Promise<void> {
    const job = await this.queue.getJob(id);
    if (job && job.status === 'failed') {
      await job.moveToCompleted();
    }
  }

  /**
   * Promotes a specific job
   */
  async promoteJob(id: string): Promise<void> {
    // Mock implementation - no actual promotion needed in our mock queue
    const job = await this.queue.getJob(id);
    if (job) {
      // No-op, just to use the job parameter
    }
  }

  /**
   * Removes a specific job
   */
  async removeJob(id: string): Promise<void> {
    const job = await this.queue.getJob(id);
    if (job) {
      this.queue.jobs.delete(id);
    }
  }
}

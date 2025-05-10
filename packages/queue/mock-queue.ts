// Mock implementation for BullMQ Queue
import { EventEmitter } from 'node:events';

// Define types for our mock implementation
type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';
type JobData = Record<string, unknown>;
type JobOptions = Record<string, unknown>;

// Mock Job class
class MockJob {
  id: string;
  name: string;
  data: JobData;
  opts: JobOptions;
  timestamp: number;
  status: JobStatus;

  constructor(name: string, data: JobData, opts: JobOptions = {}) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.data = data;
    this.opts = opts;
    this.timestamp = Date.now();
    this.status = 'waiting';
  }

  async moveToCompleted(): Promise<MockJob> {
    this.status = 'completed';
    return this;
  }

  async moveToFailed(_err: Error): Promise<MockJob> {
    this.status = 'failed';
    return this;
  }
}

// Mock Queue class
export class MockQueue extends EventEmitter {
  name: string;
  jobs: Map<string, MockJob> = new Map();
  options: Record<string, unknown>;

  constructor(name: string, options: Record<string, unknown> = {}) {
    super();
    this.name = name;
    this.options = options;
    // Log creation of mock queue (development only)
    // eslint-disable-next-line no-console
    console.log(`🔧 Created mock queue: ${name}`);
  }

  async add(name: string, data: JobData, opts: JobOptions = {}): Promise<MockJob> {
    const job = new MockJob(name, data, opts);
    this.jobs.set(job.id, job);
    this.emit('added', job);
    
    // Simulate job processing
    setTimeout(() => {
      job.status = 'active';
      this.emit('active', job);
      
      setTimeout(() => {
        job.status = 'completed';
        this.emit('completed', job);
      }, 2000);
    }, 1000);
    
    return job;
  }

  async getJob(id: string): Promise<MockJob | null> {
    return this.jobs.get(id) || null;
  }

  async getJobs(status: JobStatus): Promise<MockJob[]> {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  async getJobCounts(): Promise<Record<JobStatus | 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused', number>> {
    const jobs = Array.from(this.jobs.values());
    return {
      waiting: jobs.filter(job => job.status === 'waiting').length,
      active: jobs.filter(job => job.status === 'active').length,
      completed: jobs.filter(job => job.status === 'completed').length,
      failed: jobs.filter(job => job.status === 'failed').length,
      delayed: jobs.filter(job => job.status === 'delayed').length,
      paused: jobs.filter(job => job.status === 'paused').length,
    };
  }

  async pause(): Promise<MockQueue> {
    for (const job of this.jobs.values()) {
      if (job.status === 'waiting') {
        job.status = 'paused';
      }
    }
    this.emit('paused');
    return this;
  }

  async resume(): Promise<MockQueue> {
    for (const job of this.jobs.values()) {
      if (job.status === 'paused') {
        job.status = 'waiting';
      }
    }
    this.emit('resumed');
    return this;
  }

  async clean(grace: number, status: JobStatus): Promise<MockJob[]> {
    const jobsToRemove = Array.from(this.jobs.values())
      .filter(job => job.status === status && (Date.now() - job.timestamp) > grace);
    
    for (const job of jobsToRemove) {
      this.jobs.delete(job.id);
    }
    
    return jobsToRemove;
  }

  async close(): Promise<MockQueue> {
    this.jobs.clear();
    this.removeAllListeners();
    return this;
  }
}

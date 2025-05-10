/**
 * Mock implementation of BullMQ for development without Redis
 */

import { EventEmitter } from 'node:events';

// Mock Job class
export class Job {
  id: string;
  name: string;
  data: Record<string, unknown>;
  opts: Record<string, unknown>;
  timestamp: number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';
  returnvalue: unknown;
  processedOn?: number;
  finishedOn?: number;

  constructor(name: string, data: Record<string, unknown>, opts: Record<string, unknown> = {}) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.data = data;
    this.opts = opts;
    this.timestamp = Date.now();
    this.status = 'waiting';
    this.returnvalue = null;
  }

  async moveToCompleted(returnvalue: unknown = null): Promise<Job> {
    this.status = 'completed';
    this.returnvalue = returnvalue;
    this.finishedOn = Date.now();
    return this;
  }

  async moveToFailed(_error: Error): Promise<Job> {
    this.status = 'failed';
    this.finishedOn = Date.now();
    return this;
  }
}

// Mock Queue class
export class Queue extends EventEmitter {
  name: string;
  private jobs: Map<string, Job> = new Map();
  token: string;
  jobsOpts: Record<string, unknown>;
  opts: Record<string, unknown>;
  libName: string;
  prefix: string;
  
  constructor(name: string, options: Record<string, unknown> = {}) {
    super();
    this.name = name;
    this.token = 'mock-token';
    this.jobsOpts = {};
    this.opts = options;
    this.libName = 'bullmq-mock';
    this.prefix = 'bull';
    
    // eslint-disable-next-line no-console
    console.log(`🔧 Created mock queue: ${name}`);
  }

  async add(name: string, data: Record<string, unknown>, opts: Record<string, unknown> = {}): Promise<Job> {
    const job = new Job(name, data, opts);
    this.jobs.set(job.id, job);
    this.emit('added', job);
    
    // Simulate job processing
    setTimeout(() => {
      job.status = 'active';
      job.processedOn = Date.now();
      this.emit('active', job);
      
      setTimeout(() => {
        job.status = 'completed';
        job.finishedOn = Date.now();
        this.emit('completed', job);
      }, 2000);
    }, 1000);
    
    return job;
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }

  async getJobs(status: string, start = 0, end = -1): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values()).filter(job => job.status === status);
    
    if (end === -1) {
      return jobs.slice(start);
    }
    
    return jobs.slice(start, end);
  }

  async getJobCounts(): Promise<Record<string, number>> {
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

  async pause(): Promise<void> {
    for (const job of this.jobs.values()) {
      if (job.status === 'waiting') {
        job.status = 'paused';
      }
    }
    this.emit('paused');
  }

  async resume(): Promise<void> {
    for (const job of this.jobs.values()) {
      if (job.status === 'paused') {
        job.status = 'waiting';
      }
    }
    this.emit('resumed');
  }

  async clean(grace: number, status: string): Promise<Job[]> {
    const jobsToRemove = Array.from(this.jobs.values())
      .filter(job => job.status === status && (Date.now() - job.timestamp) > grace);
    
    for (const job of jobsToRemove) {
      this.jobs.delete(job.id);
    }
    
    return jobsToRemove;
  }

  async close(): Promise<void> {
    this.jobs.clear();
    this.removeAllListeners();
  }

  // Additional methods required by BullMQ interface
  async isPaused(): Promise<boolean> {
    const pausedJobs = await this.getJobs('paused');
    return pausedJobs.length > 0;
  }

  async getWaiting(): Promise<Job[]> {
    return this.getJobs('waiting');
  }

  async getActive(): Promise<Job[]> {
    return this.getJobs('active');
  }

  async getCompleted(): Promise<Job[]> {
    return this.getJobs('completed');
  }

  async getFailed(): Promise<Job[]> {
    return this.getJobs('failed');
  }

  async getDelayed(): Promise<Job[]> {
    return this.getJobs('delayed');
  }

  async removeJobs(pattern: string): Promise<void> {
    // Simple implementation that removes all jobs if pattern is '*'
    if (pattern === '*') {
      this.jobs.clear();
    }
  }

  async drain(): Promise<void> {
    await this.close();
  }

  async obliterate(): Promise<void> {
    await this.close();
  }
}

// Mock Worker class
export class Worker extends EventEmitter {
  constructor(queueName: string, processor: (job: Job) => Promise<unknown>, opts: Record<string, unknown> = {}) {
    super();
    
    // eslint-disable-next-line no-console
    console.log(`🔧 Created mock worker for queue: ${queueName}`);
    
    // Simulate processing jobs
    setInterval(async () => {
      const mockJob = new Job('mock-job', { mockData: true });
      mockJob.status = 'active';
      mockJob.processedOn = Date.now();
      
      this.emit('active', mockJob);
      
      try {
        const result = await processor(mockJob);
        mockJob.status = 'completed';
        mockJob.finishedOn = Date.now();
        mockJob.returnvalue = result;
        this.emit('completed', mockJob, result);
      } catch (error) {
        mockJob.status = 'failed';
        mockJob.finishedOn = Date.now();
        this.emit('failed', mockJob, error);
      }
    }, 10000); // Process a mock job every 10 seconds
  }

  async close(): Promise<void> {
    this.removeAllListeners();
  }
}

// Mock QueueEvents class
export class QueueEvents extends EventEmitter {
  constructor(queueName: string, _opts: Record<string, unknown> = {}) {
    super();
    
    // eslint-disable-next-line no-console
    console.log(`🔧 Created mock queue events for queue: ${queueName}`);
  }

  async close(): Promise<void> {
    this.removeAllListeners();
  }
}

// Mock FlowProducer class
export class FlowProducer extends EventEmitter {
  constructor(_opts: Record<string, unknown> = {}) {
    super();
    
    // eslint-disable-next-line no-console
    console.log('🔧 Created mock flow producer');
  }

  async add(flow: { name: string; data: Record<string, unknown>; children?: unknown[] }): Promise<Job> {
    const job = new Job(flow.name, flow.data);
    
    // Process children if any
    if (flow.children && Array.isArray(flow.children)) {
      // Just a mock implementation
    }
    
    return job;
  }

  async close(): Promise<void> {
    this.removeAllListeners();
  }
}

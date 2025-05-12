import type { Metadata } from "next";
import { Clock, Play, Pause, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "../../../components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Job Queue Monitor | Zopio Developer Console",
  description: "Monitor and manage background jobs",
};

// Mock data for job queues
const queues = [
  { name: "email", active: 2, waiting: 5, completed: 1245, failed: 3 },
  { name: "export", active: 1, waiting: 2, completed: 87, failed: 1 },
  { name: "import", active: 0, waiting: 3, completed: 342, failed: 5 },
  { name: "notification", active: 3, waiting: 8, completed: 1893, failed: 12 },
  { name: "report", active: 1, waiting: 4, completed: 562, failed: 2 },
];

// Mock data for jobs
const jobs = [
  { 
    id: "job-123456", 
    queue: "email", 
    status: "active", 
    progress: 45, 
    attempts: 1, 
    created: "2025-05-12T20:15:30Z",
    data: { template: "welcome", recipient: "user@example.com" }
  },
  { 
    id: "job-123457", 
    queue: "email", 
    status: "active", 
    progress: 75, 
    attempts: 1, 
    created: "2025-05-12T20:16:45Z",
    data: { template: "password-reset", recipient: "another@example.com" }
  },
  { 
    id: "job-123458", 
    queue: "export", 
    status: "active", 
    progress: 30, 
    attempts: 1, 
    created: "2025-05-12T20:18:20Z",
    data: { format: "csv", filters: { status: "active" } }
  },
  { 
    id: "job-123459", 
    queue: "notification", 
    status: "active", 
    progress: 10, 
    attempts: 1, 
    created: "2025-05-12T20:20:10Z",
    data: { type: "push", user_id: "user-789", message: "New message received" }
  },
  { 
    id: "job-123460", 
    queue: "notification", 
    status: "active", 
    progress: 50, 
    attempts: 1, 
    created: "2025-05-12T20:21:30Z",
    data: { type: "push", user_id: "user-456", message: "Task completed" }
  },
  { 
    id: "job-123461", 
    queue: "notification", 
    status: "active", 
    progress: 90, 
    attempts: 1, 
    created: "2025-05-12T20:22:15Z",
    data: { type: "push", user_id: "user-123", message: "Payment received" }
  },
  { 
    id: "job-123462", 
    queue: "report", 
    status: "active", 
    progress: 60, 
    attempts: 1, 
    created: "2025-05-12T20:25:00Z",
    data: { type: "monthly", period: "2025-04" }
  },
  { 
    id: "job-123463", 
    queue: "email", 
    status: "waiting", 
    progress: 0, 
    attempts: 0, 
    created: "2025-05-12T20:26:45Z",
    data: { template: "newsletter", recipient: "subscriber@example.com" }
  },
  { 
    id: "job-123464", 
    queue: "export", 
    status: "failed", 
    progress: 0, 
    attempts: 3, 
    created: "2025-05-12T20:10:30Z",
    data: { format: "xlsx", filters: { date: "2025-05-01" } }
  },
  { 
    id: "job-123465", 
    queue: "import", 
    status: "completed", 
    progress: 100, 
    attempts: 1, 
    created: "2025-05-12T19:45:00Z",
    data: { source: "api", type: "products" }
  },
];

export default function JobQueueMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Queue Monitor</h1>
        <p className="text-muted-foreground">
          Monitor and manage background jobs across different queues.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {queues.map((queue) => (
          <div key={queue.name} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{queue.name}</div>
              <div className="flex gap-1">
                <button className="rounded-full p-1 hover:bg-muted">
                  <Play className="h-3 w-3" />
                </button>
                <button className="rounded-full p-1 hover:bg-muted">
                  <Pause className="h-3 w-3" />
                </button>
                <button className="rounded-full p-1 hover:bg-muted">
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center rounded-md bg-green-100 p-2 text-green-700">
                <div className="mr-2 rounded-full bg-green-500 p-1">
                  <Clock className="h-2 w-2 text-white" />
                </div>
                <div>
                  <div className="font-medium">Active</div>
                  <div className="text-xs">{queue.active}</div>
                </div>
              </div>
              <div className="flex items-center rounded-md bg-blue-100 p-2 text-blue-700">
                <div className="mr-2 rounded-full bg-blue-500 p-1">
                  <Clock className="h-2 w-2 text-white" />
                </div>
                <div>
                  <div className="font-medium">Waiting</div>
                  <div className="text-xs">{queue.waiting}</div>
                </div>
              </div>
              <div className="flex items-center rounded-md bg-gray-100 p-2 text-gray-700">
                <div className="mr-2 rounded-full bg-gray-500 p-1">
                  <CheckCircle className="h-2 w-2 text-white" />
                </div>
                <div>
                  <div className="font-medium">Completed</div>
                  <div className="text-xs">{queue.completed}</div>
                </div>
              </div>
              <div className="flex items-center rounded-md bg-red-100 p-2 text-red-700">
                <div className="mr-2 rounded-full bg-red-500 p-1">
                  <XCircle className="h-2 w-2 text-white" />
                </div>
                <div>
                  <div className="font-medium">Failed</div>
                  <div className="text-xs">{queue.failed}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <h2 className="text-lg font-semibold">Recent Jobs</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
            <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
              <option value="all">All Queues</option>
              {queues.map((queue) => (
                <option key={queue.name} value={queue.name}>{queue.name}</option>
              ))}
            </select>
            <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="waiting">Waiting</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm">{job.id}</div>
                  <div className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                    {job.queue}
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                    job.status === 'active' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : job.status === 'waiting' 
                        ? 'bg-blue-100 text-blue-700' 
                        : job.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(job.created).toLocaleString()}
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress: {job.progress}%</span>
                  <span>Attempts: {job.attempts}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className={`h-full rounded-full ${
                      job.status === 'failed' 
                        ? 'bg-red-500' 
                        : job.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                    }`} 
                    style={{ width: `${job.progress}%` }} 
                  />
                </div>
              </div>
              <div className="rounded-md bg-muted/50 p-2">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(job.data, null, 2)}
                </pre>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                  View Details
                </button>
                {job.status === 'failed' && (
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">
                    Retry
                  </button>
                )}
                {job.status === 'waiting' && (
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">
                    Process Now
                  </button>
                )}
                {(job.status === 'active' || job.status === 'waiting') && (
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

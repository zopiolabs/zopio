import { Metadata } from "next";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "System Status | Zopio Developer Console",
  description: "View system status for the Zopio framework",
};

// Mock data for system status
const systemStatus = [
  {
    name: "API Server",
    status: "online",
    uptime: "99.9%",
    lastRestart: "2025-05-10T12:00:00Z",
  },
  {
    name: "Database",
    status: "online",
    uptime: "99.8%",
    lastRestart: "2025-05-09T08:30:00Z",
  },
  {
    name: "Job Queue",
    status: "online",
    uptime: "99.7%",
    lastRestart: "2025-05-11T14:15:00Z",
  },
  {
    name: "Cache",
    status: "online",
    uptime: "99.9%",
    lastRestart: "2025-05-08T22:45:00Z",
  },
  {
    name: "Storage",
    status: "online",
    uptime: "99.9%",
    lastRestart: "2025-05-07T18:20:00Z",
  },
];

export default function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground">
          View the current status of all Zopio framework services.
        </p>
      </div>
      
      <div className="rounded-lg border">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
          <div>Service</div>
          <div>Status</div>
          <div>Uptime</div>
          <div>Last Restart</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {systemStatus.map((service) => (
            <div key={service.name} className="grid grid-cols-5 gap-4 p-4 items-center">
              <div className="font-medium">{service.name}</div>
              <div className="flex items-center gap-2">
                {service.status === "online" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Offline</span>
                  </>
                )}
              </div>
              <div>{service.uptime}</div>
              <div>{new Date(service.lastRestart).toLocaleString()}</div>
              <div>
                <button className="text-sm text-blue-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">CPU Usage</div>
          <div className="mt-2 text-2xl font-bold">24%</div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[24%] rounded-full bg-green-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Memory Usage</div>
          <div className="mt-2 text-2xl font-bold">42%</div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[42%] rounded-full bg-yellow-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Disk Usage</div>
          <div className="mt-2 text-2xl font-bold">68%</div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[68%] rounded-full bg-orange-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Network Traffic</div>
          <div className="mt-2 text-2xl font-bold">12 MB/s</div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[30%] rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

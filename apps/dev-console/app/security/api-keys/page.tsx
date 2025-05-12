import { Metadata } from "next";
import { Shield, Search, Plus, Copy, Eye, EyeOff, Trash, RefreshCw, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Key Management | Zopio Developer Console",
  description: "Manage API keys for secure access to Zopio APIs",
};

// Mock data for API keys
const apiKeys = [
  { 
    id: "key-123", 
    name: "Production API Key", 
    key: "zop_prod_a1b2c3d4e5f6g7h8i9j0", 
    created: "2025-04-10T12:30:00Z",
    expires: "2026-04-10T12:30:00Z",
    lastUsed: "2025-05-12T10:15:00Z",
    status: "active",
    scopes: ["read:users", "write:users", "read:projects", "write:projects"],
    createdBy: "John Doe"
  },
  { 
    id: "key-124", 
    name: "Staging API Key", 
    key: "zop_stag_b2c3d4e5f6g7h8i9j0k1", 
    created: "2025-04-15T14:45:00Z",
    expires: "2026-04-15T14:45:00Z",
    lastUsed: "2025-05-11T16:30:00Z",
    status: "active",
    scopes: ["read:users", "write:users", "read:projects", "write:projects", "read:analytics"],
    createdBy: "Jane Smith"
  },
  { 
    id: "key-125", 
    name: "Development API Key", 
    key: "zop_dev_c3d4e5f6g7h8i9j0k1l2", 
    created: "2025-04-20T09:15:00Z",
    expires: "2026-04-20T09:15:00Z",
    lastUsed: "2025-05-12T08:45:00Z",
    status: "active",
    scopes: ["*"],
    createdBy: "Bob Johnson"
  },
  { 
    id: "key-126", 
    name: "Analytics API Key", 
    key: "zop_anly_d4e5f6g7h8i9j0k1l2m3", 
    created: "2025-04-25T16:20:00Z",
    expires: "2026-04-25T16:20:00Z",
    lastUsed: "2025-05-10T11:30:00Z",
    status: "active",
    scopes: ["read:analytics", "read:users"],
    createdBy: "Alice Williams"
  },
  { 
    id: "key-127", 
    name: "Legacy API Key", 
    key: "zop_leg_e5f6g7h8i9j0k1l2m3n4", 
    created: "2025-03-15T10:45:00Z",
    expires: "2025-06-15T10:45:00Z",
    lastUsed: "2025-05-01T14:20:00Z",
    status: "expiring",
    scopes: ["read:users", "write:users"],
    createdBy: "Charlie Brown"
  },
  { 
    id: "key-128", 
    name: "Revoked API Key", 
    key: "zop_rev_f6g7h8i9j0k1l2m3n4o5", 
    created: "2025-02-10T08:30:00Z",
    expires: "2026-02-10T08:30:00Z",
    lastUsed: "2025-04-15T09:45:00Z",
    status: "revoked",
    scopes: ["read:users", "read:projects"],
    createdBy: "Diana Miller"
  },
];

// Mock data for API key usage
const keyUsage = [
  { date: "2025-05-12", requests: 1245 },
  { date: "2025-05-11", requests: 1356 },
  { date: "2025-05-10", requests: 987 },
  { date: "2025-05-09", requests: 1102 },
  { date: "2025-05-08", requests: 1432 },
  { date: "2025-05-07", requests: 1321 },
  { date: "2025-05-06", requests: 1198 },
];

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
        <p className="text-muted-foreground">
          Create and manage API keys for secure access to Zopio APIs.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search API keys..."
              className="pl-8 pr-4 py-2 rounded-md border"
            />
          </div>
          <select className="rounded-md border px-4 py-2">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
          <div className="col-span-2">Name</div>
          <div>Created</div>
          <div>Expires</div>
          <div>Status</div>
          <div>Last Used</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {apiKeys.map((key) => (
            <div key={key.id} className="grid grid-cols-7 gap-4 p-4 items-center">
              <div className="col-span-2">
                <div className="font-medium">{key.name}</div>
                <div className="flex items-center mt-1">
                  <div className="font-mono text-xs text-muted-foreground mr-2">
                    {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                  </div>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Copy className="h-3 w-3" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="text-sm">
                {new Date(key.created).toLocaleDateString()}
              </div>
              <div className="text-sm">
                {new Date(key.expires).toLocaleDateString()}
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  key.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : key.status === 'expiring' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                }`}>
                  {key.status}
                </span>
              </div>
              <div className="text-sm">
                {new Date(key.lastUsed).toLocaleDateString()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full p-1 hover:bg-muted" title="Refresh">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted" title="Revoke">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Key Details</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate
              </Button>
              <Button variant="outline" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Revoke
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Key ID</h3>
                <p className="font-mono text-sm">key-123</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                <p>Production API Key</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">API Key</h3>
                <div className="flex items-center">
                  <input
                    type="password"
                    value="••••••••••••••••••••"
                    className="font-mono text-sm rounded-md border px-3 py-2 mr-2"
                    readOnly
                  />
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created By</h3>
                <p>John Doe</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                <p>{new Date("2025-04-10T12:30:00Z").toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Expires At</h3>
                <p>{new Date("2026-04-10T12:30:00Z").toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Used</h3>
                <p>{new Date("2025-05-12T10:15:00Z").toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Scopes</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    read:users
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    write:users
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    read:projects
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    write:projects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Usage Statistics</h2>
            <select className="rounded-md border px-3 py-1 text-sm">
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end justify-between gap-2">
              {keyUsage.map((day) => (
                <div key={day.date} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 w-10 rounded-t-md" 
                    style={{ height: `${(day.requests / 1500) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2">{day.date.split('-')[2]}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Requests (7d)</div>
                  <div className="mt-2 text-2xl font-bold">8,641</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Requests / Day</div>
                  <div className="mt-2 text-2xl font-bold">1,234</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                  <div className="mt-2 text-2xl font-bold">99.8%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Response Time</div>
                  <div className="mt-2 text-2xl font-bold">42ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-4">Security Recommendations</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-4 w-4 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-medium">Rotate API Keys Regularly</h3>
              <p className="text-sm text-muted-foreground">
                For optimal security, rotate your API keys every 90 days. The "Production API Key" is 32 days old.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-100 p-2">
              <Shield className="h-4 w-4 text-red-700" />
            </div>
            <div>
              <h3 className="font-medium">Limit API Key Scopes</h3>
              <p className="text-sm text-muted-foreground">
                The "Development API Key" has wildcard (*) permissions. Consider limiting its scope to only what's needed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-4 w-4 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-medium">Expiring API Key</h3>
              <p className="text-sm text-muted-foreground">
                The "Legacy API Key" will expire in 34 days. Consider rotating it now to avoid disruption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

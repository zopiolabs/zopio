import { Metadata } from "next";
import { Flag, Search, Plus, Edit, Trash, History, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Feature Flags Manager | Zopio Developer Console",
  description: "Manage feature flags and toggles",
};

// Mock data for feature flags
const featureFlags = [
  { 
    id: "flag-123", 
    name: "new_dashboard", 
    description: "Enable the new dashboard UI", 
    enabled: true,
    environments: ["development", "staging"],
    createdAt: "2025-04-10T12:30:00Z",
    updatedAt: "2025-05-11T09:45:00Z",
    createdBy: "John Doe",
    type: "boolean"
  },
  { 
    id: "flag-124", 
    name: "api_rate_limit", 
    description: "Set API rate limit per user", 
    enabled: true,
    environments: ["development", "staging", "production"],
    createdAt: "2025-04-12T14:20:00Z",
    updatedAt: "2025-05-10T11:30:00Z",
    createdBy: "Jane Smith",
    type: "number",
    value: 100
  },
  { 
    id: "flag-125", 
    name: "advanced_search", 
    description: "Enable advanced search functionality", 
    enabled: false,
    environments: ["development"],
    createdAt: "2025-04-15T10:15:00Z",
    updatedAt: "2025-05-09T16:45:00Z",
    createdBy: "Bob Johnson",
    type: "boolean"
  },
  { 
    id: "flag-126", 
    name: "new_onboarding", 
    description: "Enable the new user onboarding flow", 
    enabled: true,
    environments: ["development", "staging"],
    createdAt: "2025-04-18T09:30:00Z",
    updatedAt: "2025-05-08T14:20:00Z",
    createdBy: "Alice Williams",
    type: "boolean"
  },
  { 
    id: "flag-127", 
    name: "maintenance_mode", 
    description: "Put the application in maintenance mode", 
    enabled: false,
    environments: ["development", "staging", "production"],
    createdAt: "2025-04-20T16:45:00Z",
    updatedAt: "2025-05-07T10:30:00Z",
    createdBy: "Charlie Brown",
    type: "boolean"
  },
  { 
    id: "flag-128", 
    name: "cache_ttl", 
    description: "Set cache time-to-live in seconds", 
    enabled: true,
    environments: ["development", "staging", "production"],
    createdAt: "2025-04-22T11:20:00Z",
    updatedAt: "2025-05-06T15:10:00Z",
    createdBy: "Diana Miller",
    type: "number",
    value: 3600
  },
  { 
    id: "flag-129", 
    name: "dark_mode", 
    description: "Enable dark mode UI", 
    enabled: true,
    environments: ["development", "staging"],
    createdAt: "2025-04-25T14:30:00Z",
    updatedAt: "2025-05-05T09:45:00Z",
    createdBy: "Edward Davis",
    type: "boolean"
  },
  { 
    id: "flag-130", 
    name: "beta_features", 
    description: "Enable beta features for selected users", 
    enabled: true,
    environments: ["development"],
    createdAt: "2025-04-28T10:15:00Z",
    updatedAt: "2025-05-04T16:30:00Z",
    createdBy: "Fiona Garcia",
    type: "string",
    value: "user-123,user-456,user-789"
  },
];

// Mock data for feature flag history
const flagHistory = [
  { 
    id: "history-1", 
    flagId: "flag-123", 
    action: "enabled", 
    timestamp: "2025-05-11T09:45:00Z", 
    user: "John Doe", 
    environment: "staging" 
  },
  { 
    id: "history-2", 
    flagId: "flag-123", 
    action: "enabled", 
    timestamp: "2025-05-10T14:30:00Z", 
    user: "John Doe", 
    environment: "development" 
  },
  { 
    id: "history-3", 
    flagId: "flag-123", 
    action: "created", 
    timestamp: "2025-04-10T12:30:00Z", 
    user: "John Doe", 
    environment: "development" 
  },
];

export default function FeatureFlagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Flags Manager</h1>
        <p className="text-muted-foreground">
          Manage feature flags and toggles across different environments.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search feature flags..."
              className="pl-8 pr-4 py-2 rounded-md border"
            />
          </div>
          <select className="rounded-md border px-4 py-2">
            <option value="all">All Environments</option>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
          <select className="rounded-md border px-4 py-2">
            <option value="all">All Types</option>
            <option value="boolean">Boolean</option>
            <option value="number">Number</option>
            <option value="string">String</option>
          </select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Feature Flag
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-8 gap-4 p-4 font-medium border-b">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Description</div>
          <div>Type</div>
          <div>Status</div>
          <div>Environments</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {featureFlags.map((flag) => (
            <div key={flag.id} className="grid grid-cols-8 gap-4 p-4 items-center">
              <div className="col-span-2 font-medium">{flag.name}</div>
              <div className="col-span-2 text-sm text-muted-foreground">{flag.description}</div>
              <div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                  {flag.type}
                </span>
              </div>
              <div>
                {flag.enabled ? (
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-green-600 text-sm">Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-red-600 text-sm">Disabled</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-1">
                  {flag.environments.map((env) => (
                    <span 
                      key={env} 
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        env === 'production' 
                          ? 'bg-red-100 text-red-700' 
                          : env === 'staging' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <History className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <Trash className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1 hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
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
            <h2 className="text-lg font-semibold">Flag Details</h2>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Flag ID</h3>
                <p className="font-mono text-sm">flag-123</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                <p>new_dashboard</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p>Enable the new dashboard UI</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                <p>boolean</p>
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
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <p>{new Date("2025-05-11T09:45:00Z").toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Environments</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    development
                  </span>
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    staging
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Flag History</h2>
            <Button variant="outline" size="sm">
              <History className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              <div className="space-y-4">
                {flagHistory.map((history) => (
                  <div key={history.id} className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-2">
                      {history.action === "created" ? (
                        <Plus className="h-4 w-4" />
                      ) : history.action === "enabled" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {history.action === "created"
                            ? "Created flag"
                            : history.action === "enabled"
                            ? "Enabled flag"
                            : "Disabled flag"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(history.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {history.user} {history.action} the flag in {history.environment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-4">Environment Override</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Development</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Enabled</span>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                    <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6 transform transition"></span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date("2025-05-10T14:30:00Z").toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Staging</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Enabled</span>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                    <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6 transform transition"></span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date("2025-05-11T09:45:00Z").toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Production</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Disabled</span>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                    <span className="absolute h-4 w-4 rounded-full bg-white translate-x-1 transform transition"></span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Not enabled in production
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

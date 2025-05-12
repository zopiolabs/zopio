import type { Metadata } from "next";
import { Database, Table, Search, Eye } from "lucide-react";
import { ScrollArea } from "../../../components/ui/scroll-area";

export const metadata: Metadata = {
  title: "DB Viewer | Zopio Developer Console",
  description: "Browse database tables and records",
};

// Mock data for database tables
const tables = [
  { name: "users", recordCount: 1245 },
  { name: "organizations", recordCount: 87 },
  { name: "projects", recordCount: 342 },
  { name: "tasks", recordCount: 1893 },
  { name: "comments", recordCount: 4562 },
  { name: "files", recordCount: 782 },
  { name: "notifications", recordCount: 8943 },
  { name: "audit_logs", recordCount: 12453 },
  { name: "settings", recordCount: 56 },
  { name: "subscriptions", recordCount: 124 },
];

// Mock data for table records
const userRecords = [
  { id: 1, email: "john.doe@example.com", name: "John Doe", role: "admin", created_at: "2025-01-15T08:30:00Z" },
  { id: 2, email: "jane.smith@example.com", name: "Jane Smith", role: "user", created_at: "2025-01-16T10:45:00Z" },
  { id: 3, email: "bob.johnson@example.com", name: "Bob Johnson", role: "user", created_at: "2025-01-18T14:20:00Z" },
  { id: 4, email: "alice.williams@example.com", name: "Alice Williams", role: "editor", created_at: "2025-01-20T09:15:00Z" },
  { id: 5, email: "charlie.brown@example.com", name: "Charlie Brown", role: "user", created_at: "2025-01-22T11:30:00Z" },
  { id: 6, email: "diana.miller@example.com", name: "Diana Miller", role: "admin", created_at: "2025-01-25T16:45:00Z" },
  { id: 7, email: "edward.davis@example.com", name: "Edward Davis", role: "user", created_at: "2025-01-28T13:10:00Z" },
  { id: 8, email: "fiona.garcia@example.com", name: "Fiona Garcia", role: "editor", created_at: "2025-02-01T08:55:00Z" },
  { id: 9, email: "george.wilson@example.com", name: "George Wilson", role: "user", created_at: "2025-02-03T15:30:00Z" },
  { id: 10, email: "hannah.martinez@example.com", name: "Hannah Martinez", role: "user", created_at: "2025-02-05T10:20:00Z" },
];

export default function DBViewerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Viewer</h1>
        <p className="text-muted-foreground">
          Browse database tables and records in read-only mode.
        </p>
      </div>

      <div className="flex h-[600px] border rounded-lg overflow-hidden">
        {/* Sidebar with tables list */}
        <div className="w-64 border-r bg-muted/20">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tables..."
                className="w-full rounded-md border border-input pl-8 pr-2 py-2 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="h-[542px]">
            <div className="p-2">
              {tables.map((table) => (
                <button
                  key={table.name}
                  className="flex items-center justify-between w-full rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center">
                    <Table className="mr-2 h-4 w-4" />
                    <span>{table.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {table.recordCount}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              <h2 className="text-lg font-semibold">users</h2>
              <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                {userRecords.length} records
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                <Search className="mr-2 h-4 w-4" />
                Query
              </button>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  className="w-full rounded-md border border-input pl-8 pr-2 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <ScrollArea className="h-[542px]">
            <div className="p-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 text-sm font-medium">
                  <div>ID</div>
                  <div>Email</div>
                  <div>Name</div>
                  <div>Role</div>
                  <div>Created At</div>
                </div>
                <div className="divide-y">
                  {userRecords.map((record) => (
                    <div key={record.id} className="grid grid-cols-5 gap-4 p-3 text-sm">
                      <div>{record.id}</div>
                      <div className="truncate max-w-[200px]">{record.email}</div>
                      <div>{record.name}</div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          record.role === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : record.role === 'editor' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                        }`}>
                          {record.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{new Date(record.created_at).toLocaleString()}</span>
                        <button className="rounded-full p-1 hover:bg-muted">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

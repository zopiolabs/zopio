import type { Metadata } from "next";
import { Send, Copy, Download, ChevronDown, Code } from "lucide-react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";

export const metadata: Metadata = {
  title: "API Explorer | Zopio Developer Console",
  description: "Explore and test API endpoints",
};

// Mock data for API endpoints
const apiEndpoints = [
  { 
    method: "GET", 
    path: "/api/v1/users", 
    description: "List all users",
    parameters: [
      { name: "page", type: "number", required: false, default: "1", description: "Page number" },
      { name: "limit", type: "number", required: false, default: "10", description: "Number of items per page" },
      { name: "sort", type: "string", required: false, default: "created_at", description: "Sort field" },
      { name: "order", type: "string", required: false, default: "desc", description: "Sort order (asc, desc)" },
    ]
  },
  { 
    method: "GET", 
    path: "/api/v1/users/:id", 
    description: "Get a user by ID",
    parameters: [
      { name: "id", type: "string", required: true, default: "", description: "User ID" },
    ]
  },
  { 
    method: "POST", 
    path: "/api/v1/users", 
    description: "Create a new user",
    parameters: [
      { name: "name", type: "string", required: true, default: "", description: "User's full name" },
      { name: "email", type: "string", required: true, default: "", description: "User's email address" },
      { name: "role", type: "string", required: false, default: "user", description: "User's role (user, admin, editor)" },
    ]
  },
  { 
    method: "PUT", 
    path: "/api/v1/users/:id", 
    description: "Update a user",
    parameters: [
      { name: "id", type: "string", required: true, default: "", description: "User ID" },
      { name: "name", type: "string", required: false, default: "", description: "User's full name" },
      { name: "email", type: "string", required: false, default: "", description: "User's email address" },
      { name: "role", type: "string", required: false, default: "", description: "User's role (user, admin, editor)" },
    ]
  },
  { 
    method: "DELETE", 
    path: "/api/v1/users/:id", 
    description: "Delete a user",
    parameters: [
      { name: "id", type: "string", required: true, default: "", description: "User ID" },
    ]
  },
  { 
    method: "GET", 
    path: "/api/v1/organizations", 
    description: "List all organizations",
    parameters: [
      { name: "page", type: "number", required: false, default: "1", description: "Page number" },
      { name: "limit", type: "number", required: false, default: "10", description: "Number of items per page" },
    ]
  },
  { 
    method: "POST", 
    path: "/api/v1/auth/login", 
    description: "Authenticate a user",
    parameters: [
      { name: "email", type: "string", required: true, default: "", description: "User's email address" },
      { name: "password", type: "string", required: true, default: "", description: "User's password" },
    ]
  },
  { 
    method: "POST", 
    path: "/api/v1/auth/refresh", 
    description: "Refresh authentication token",
    parameters: [
      { name: "refresh_token", type: "string", required: true, default: "", description: "Refresh token" },
    ]
  },
];

// Mock response data
const mockResponse = {
  "status": 200,
  "data": [
    {
      "id": "user-123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "created_at": "2025-01-15T08:30:00Z",
      "updated_at": "2025-05-10T14:25:30Z"
    },
    {
      "id": "user-456",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "user",
      "created_at": "2025-01-16T10:45:00Z",
      "updated_at": "2025-05-09T11:20:15Z"
    },
    {
      "id": "user-789",
      "name": "Bob Johnson",
      "email": "bob.johnson@example.com",
      "role": "editor",
      "created_at": "2025-01-18T14:20:00Z",
      "updated_at": "2025-05-11T09:15:45Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "total_pages": 1
  }
};

// Helper function to get method color class
function getMethodColorClass(method: string) {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-700';
    case 'POST':
      return 'bg-blue-100 text-blue-700';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-700';
    case 'DELETE':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function ApiExplorerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Explorer</h1>
        <p className="text-muted-foreground">
          Explore and test API endpoints in the Zopio framework.
        </p>
      </div>

      <div className="flex h-[600px] overflow-hidden rounded-lg border">
        {/* Sidebar with API endpoints */}
        <div className="w-72 border-r bg-muted/20">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search API endpoints..."
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="h-[542px]">
            <div className="p-2">
              {apiEndpoints.map((endpoint, index) => (
                <button
                  key={index}
                  type="button"
                  className="mb-1 flex w-full flex-col rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`mr-2 rounded-md px-2 py-0.5 text-xs font-medium ${getMethodColorClass(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {endpoint.parameters.length} params
                    </span>
                  </div>
                  <div className="mt-1 text-left font-mono text-xs truncate">
                    {endpoint.path}
                  </div>
                  <div className="mt-1 text-left text-xs text-muted-foreground truncate">
                    {endpoint.description}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Request section */}
          <div className="flex-1 border-b">
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
              <div className="flex items-center">
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 mr-2">
                  GET
                </span>
                <span className="font-mono text-sm">/api/v1/users</span>
              </div>
              <div className="flex items-center gap-2">
                <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
                  <option value="application/json">application/json</option>
                  <option value="application/xml">application/xml</option>
                  <option value="text/plain">text/plain</option>
                </select>
                <Button size="sm" type="button">
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Query Parameters</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="page"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-muted/50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="1"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="limit"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-muted/50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="10"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="sort"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-muted/50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="created_at"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="order"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-muted/50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="desc"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Headers</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="Authorization"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="Accept"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value="application/json"
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response section */}
          <div className="flex-1">
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
              <div className="flex items-center">
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 mr-2">
                  200 OK
                </span>
                <span className="text-sm text-muted-foreground">
                  Response time: 42ms
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="button">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Code className="mr-2 h-4 w-4" />
                  Prettify
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[240px]">
              <div className="p-4">
                <pre className="font-mono text-sm">
                  {JSON.stringify(mockResponse, null, 2)}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">Code Snippets</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use these code snippets to make API calls in your application.
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">cURL</h3>
              <Button variant="ghost" size="sm" type="button">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              {`curl -X GET "https://api.zopio.com/api/v1/users?page=1&limit=10&sort=created_at&order=desc" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Accept: application/json"`}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">JavaScript (fetch)</h3>
              <Button variant="ghost" size="sm" type="button">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              {`fetch("https://api.zopio.com/api/v1/users?page=1&limit=10&sort=created_at&order=desc", {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Accept": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Python (requests)</h3>
              <Button variant="ghost" size="sm" type="button">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              {`import requests

url = "https://api.zopio.com/api/v1/users"
params = {
    "page": 1,
    "limit": 10,
    "sort": "created_at",
    "order": "desc"
}
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Accept": "application/json"
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

# @repo/mcp

## Overview

The `@repo/mcp` package implements the Model Context Protocol (MCP), a standardized interface for AI model context management in Zopio applications. It provides a client-server architecture for retrieving, validating, and utilizing structured resources that can be consumed by AI models, enabling consistent and type-safe interactions with various AI providers.

## Module Categories

### Core Components

- **MCP Client**: Type-safe client for interacting with MCP servers
- **MCP Server**: Server implementation for hosting MCP resources
- **Protocol Implementation**: Core protocol definitions and validation utilities

### Resource Management

- **Resource Schema**: Zod-based schema validation for MCP resources
- **Resource Creation**: Utilities for creating and validating resources
- **Relationship Management**: Tools for defining resource relationships

### Types

- **Resource Types**: Type definitions for MCP resources and relationships
- **Response Types**: Type definitions for MCP API responses
- **Configuration Types**: Type definitions for client and server configuration

## Usage Guidelines

### Client Usage

```tsx
import { MCPClient } from '@repo/mcp';

// Initialize the client
const client = new MCPClient({
  serverUrl: 'https://mcp.example.com',
});

// List available resources
const resources = await client.listResources('documents');
console.log(resources);

// Read a specific resource
const document = await client.readResource('documents', 'doc-123');
console.log(document);
```

### Server Implementation

```tsx
import { MCPServer } from '@repo/mcp/server';
import { z } from 'zod';

// Define resource schemas
const documentSchema = z.object({
  id: z.string(),
  type: z.literal('document'),
  attributes: z.object({
    title: z.string(),
    content: z.string(),
    createdAt: z.string().datetime(),
  }),
});

// Initialize the server
const server = new MCPServer({
  resources: {
    documents: {
      schema: documentSchema,
      items: [
        {
          id: 'doc-123',
          type: 'document',
          attributes: {
            title: 'Getting Started',
            content: 'This is a guide to getting started with MCP.',
            createdAt: new Date().toISOString(),
          },
        },
      ],
    },
  },
});

// Example Express integration
app.get('/api/mcp/resources/:type', async (req, res) => {
  const { type } = req.params;
  const { cursor } = req.query;
  
  try {
    const response = await server.listResources(type, cursor as string);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/mcp/resources/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  
  try {
    const response = await server.readResource(type, id);
    res.json(response);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
});
```

### Creating Resources

```tsx
import { createResource, createRelationship } from '@repo/mcp/protocol';

// Create a simple resource
const document = createResource(
  'document',
  'doc-123',
  {
    title: 'Getting Started',
    content: 'This is a guide to getting started with MCP.',
  }
);

// Create a resource with relationships
const article = createResource(
  'article',
  'article-456',
  {
    title: 'Advanced MCP Usage',
    content: 'Learn about advanced MCP features.',
    relationships: {
      author: createRelationship('user-789', 'user'),
      tags: createToManyRelationship([
        { id: 'tag-1', type: 'tag' },
        { id: 'tag-2', type: 'tag' },
      ]),
    },
  }
);
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/mcp
```

## Environment Variables

This package does not require any environment variables by default. However, when implementing an MCP server, you may want to configure:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MCP_SERVER_URL` | URL of the MCP server | No | `https://mcp.example.com` |

## Development Guidelines

### Adding New Resource Types

When creating new resource types:

1. Define a Zod schema for the resource:

```tsx
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  type: z.literal('user'),
  attributes: z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'user', 'guest']),
  }),
  relationships: z.object({
    organization: z.object({
      data: z.object({
        id: z.string(),
        type: z.literal('organization'),
      }),
    }),
  }).optional(),
});

export type User = z.infer<typeof userSchema>;
```

2. Register the resource type with the MCP server:

```tsx
const server = new MCPServer({
  resources: {
    users: {
      schema: userSchema,
      items: [], // Initial items or load from database
    },
    // Other resource types...
  },
});
```

### Resource Validation

Always validate resources before adding them to the server:

```tsx
import { validateResource } from '@repo/mcp/protocol';

const newUser = {
  id: 'user-123',
  type: 'user',
  attributes: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  },
};

try {
  const validatedUser = validateResource(newUser, { schema: userSchema });
  // Add to server or database
} catch (error) {
  console.error('Invalid user resource:', error);
}
```

## Integration Examples

### With Next.js API Routes

```tsx
// app/api/mcp/[type]/route.ts
import { MCPServer } from '@repo/mcp/server';
import { documentSchema } from '@/schemas/document';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the MCP server
const server = new MCPServer({
  resources: {
    documents: {
      schema: documentSchema,
      items: [], // Load from database in production
    },
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const cursor = request.nextUrl.searchParams.get('cursor') || undefined;
  
  try {
    const response = await server.listResources(type, cursor);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// app/api/mcp/[type]/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;
  
  try {
    const response = await server.readResource(type, id);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 404 }
    );
  }
}
```

### With AI Model Integration

```tsx
import { MCPClient } from '@repo/mcp';
import { OpenAI } from 'openai';

async function generateResponse(documentId: string, query: string) {
  // Initialize the MCP client
  const mcpClient = new MCPClient({
    serverUrl: process.env.MCP_SERVER_URL,
  });
  
  // Fetch the document resource
  const document = await mcpClient.readResource('documents', documentId);
  
  // Initialize the OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  // Generate a response using the document content
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an assistant that answers questions based on the following document:
          Title: ${document.attributes.title}
          Content: ${document.attributes.content}`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
  });
  
  return response.choices[0].message.content;
}
```

## Documentation References

- [JSON:API Specification](https://jsonapi.org/) - The inspiration for MCP's resource format
- [Zod Documentation](https://zod.dev/) - Used for schema validation
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contributing Guidelines

1. Follow the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT

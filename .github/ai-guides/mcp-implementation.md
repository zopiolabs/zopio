# Model Context Protocol (MCP) Implementation Guide

This guide provides detailed information about the Model Context Protocol (MCP) implementation in the Zopio codebase and how AI tools should interact with it.

## Overview

The Model Context Protocol (MCP) is a standardized way for AI tools to access and understand the context of the Zopio codebase. It provides a resource-based architecture that enables AI tools to retrieve structured information about packages, components, APIs, and data models.

## Core Concepts

### Resources

MCP is built around the concept of resources. A resource is a structured object with a type, ID, attributes, and optional relationships to other resources. The main resource types in Zopio are:

1. **Package Resources**: Information about packages in the Zopio monorepo
2. **Component Resources**: UI components in the design system
3. **API Resources**: API endpoints and their specifications
4. **Model Resources**: Data models and their schemas

### Resource Schema

Each resource type has a defined schema that specifies its structure and validation rules. Schemas are implemented using Zod for runtime validation.

### Server and Client

MCP provides both server and client implementations:

- **MCPServer**: Hosts resources and handles requests to list and read resources
- **MCPClient**: Consumes resources from MCP servers

## Implementation Details

### Package Structure

The MCP implementation is located in the `@repo/mcp` package with the following structure:

```
packages/mcp/
├── src/
│   ├── client.ts       # Client implementation
│   ├── index.ts        # Main entry point
│   ├── protocol.ts     # Core protocol implementation
│   ├── server.ts       # Server implementation
│   ├── types.ts        # Type definitions
│   ├── utils.ts        # Utility functions
│   ├── schemas/        # Resource schemas
│   │   ├── api.ts      # API resource schema
│   │   ├── component.ts # Component resource schema
│   │   ├── index.ts    # Schema exports
│   │   ├── model.ts    # Model resource schema
│   │   └── package.ts  # Package resource schema
│   └── examples/       # Example implementations
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript configuration
└── modules.json        # Module documentation
```

### Resource Types

#### Package Resources

Package resources represent packages in the Zopio monorepo. They follow the `@repo/*` naming convention and include information about dependencies, scripts, and other package.json fields.

Example:

```typescript
{
  id: 'design-system',
  type: 'package',
  attributes: {
    name: '@repo/design-system',
    version: '0.1.0',
    description: 'Zopio design system components',
    private: true,
    dependencies: {
      'react': '^19.1.0'
    }
  }
}
```

#### Component Resources

Component resources represent UI components in the design system. They include information about props, examples, and usage guidelines.

Example:

```typescript
{
  id: 'button',
  type: 'component',
  attributes: {
    name: 'Button',
    description: 'Primary button component',
    category: 'input',
    props: {
      variant: {
        type: 'string',
        description: 'Button variant',
        required: false,
        defaultValue: 'primary'
      }
    }
  },
  relationships: {
    package: {
      data: {
        id: 'design-system',
        type: 'package'
      }
    }
  }
}
```

#### API Resources

API resources represent API endpoints in the Zopio application. They include information about paths, methods, parameters, and responses.

Example:

```typescript
{
  id: 'get-users',
  type: 'api',
  attributes: {
    path: '/api/users',
    method: 'GET',
    summary: 'Get all users',
    parameters: [
      {
        name: 'limit',
        in: 'query',
        description: 'Maximum number of users to return',
        required: false,
        schema: {
          type: 'integer'
        }
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### Model Resources

Model resources represent data models in the Zopio application. They include information about fields, relationships, and validation rules.

Example:

```typescript
{
  id: 'user',
  type: 'model',
  attributes: {
    name: 'User',
    description: 'User model',
    fields: {
      id: {
        type: 'string',
        required: true,
        unique: true
      },
      name: {
        type: 'string',
        required: true
      },
      email: {
        type: 'string',
        required: true,
        unique: true
      }
    }
  }
}
```

## Using MCP in AI Tools

### Initializing the Client

AI tools should initialize an MCP client at the start of a session:

```typescript
import { MCPClient } from '@repo/mcp';

const client = new MCPClient({
  serverUrl: '/api/mcp'
});
```

### Listing Available Resources

To discover available resources:

```typescript
const resources = await client.listResources();
console.log(resources);
```

### Reading Specific Resources

To read a specific resource:

```typescript
const buttonComponent = await client.readResource('component', 'button');
console.log(buttonComponent);
```

### Using Resources for Code Generation

AI tools should use MCP resources to guide code generation:

```typescript
// Fetch component information
const buttonComponent = await client.readResource('component', 'button');

// Generate import statement
const importStatement = `import { ${buttonComponent.attributes.name} } from '${buttonComponent.attributes.packageName}';`;

// Generate component usage
const props = Object.entries(buttonComponent.attributes.props || {})
  .filter(([_, propDef]) => propDef.required)
  .map(([propName]) => `${propName}={${getDefaultValueForProp(propName)}}`)
  .join(' ');

const componentUsage = `<${buttonComponent.attributes.name} ${props}>Content</${buttonComponent.attributes.name}>`;
```

## Best Practices

### Package Naming Convention

Always use the `@repo/*` namespace for packages, not `@zopio/*`. This applies to:

- Package names in `package.json`
- Import statements
- Documentation references

### Resource Relationships

Use relationships to connect related resources. For example, connect components to their packages:

```typescript
const component = createComponentResource('button', {
  name: 'Button',
  // ...other attributes
}, 'design-system'); // Reference to package ID
```

### Caching Resources

AI tools should cache resources to avoid unnecessary requests:

```typescript
const cache = new Map();

async function getResource(type, id) {
  const cacheKey = `${type}:${id}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const resource = await client.readResource(type, id);
  cache.set(cacheKey, resource);
  return resource;
}
```

## Example Workflows

### Understanding Component Structure

1. List available components:

   ```typescript
   const resources = await client.listResources();
   const componentTypes = resources.resources.filter(r => r.type === 'component');
   ```

2. Get details about a specific component:

   ```typescript
   const buttonComponent = await client.readResource('component', 'button');
   ```

3. Generate component usage example:

   ```typescript
   const example = buttonComponent.attributes.examples[0];
   console.log(example.code);
   ```

### Working with Data Models

1. Get model schema:

   ```typescript
   const userModel = await client.readResource('model', 'user');
   ```

2. Generate TypeScript interface:

   ```typescript
   const fields = userModel.attributes.fields;
   const interfaceCode = `interface ${userModel.attributes.name} {
     ${Object.entries(fields).map(([name, field]) => {
       const optional = field.required ? '' : '?';
       return `${name}${optional}: ${mapTypeToTypeScript(field.type)};`;
     }).join('\n  ')}
   }`;
   ```

## Troubleshooting

### Common Issues

1. **Resource Not Found**: Ensure the resource type and ID are correct
2. **Schema Validation Error**: Check that the resource structure matches the schema
3. **Server Connection Error**: Verify the server URL and network connection

### Debugging

Enable debug logging in the MCP client:

```typescript
const client = new MCPClient({
  serverUrl: '/api/mcp',
  debug: true
});
```

## Further Reading

- [MCP Package Documentation](../../packages/mcp/README.md)
- [JSON:API Specification](https://jsonapi.org/) (inspiration for resource format)

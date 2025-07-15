# Model Context Protocol (MCP) Guide for Zopio

This guide explains how AI tools should interact with the Zopio codebase using the Model Context Protocol (MCP).

## Overview

The Model Context Protocol (MCP) provides a standardized way for AI tools to access and understand the context of the Zopio codebase. It defines a resource-based architecture that allows AI tools to retrieve structured information about various aspects of the codebase.

## Resource Types

When working with the Zopio codebase, AI tools can access the following resource types:

### 1. Package Resources

- **Type**: `package`
- **Description**: Information about a package in the Zopio monorepo
- **Key Attributes**:
  - `name`: Package name (follows `@repo/*` naming convention)
  - `version`: Package version
  - `description`: Package description
  - `dependencies`: List of dependencies

### 2. Component Resources

- **Type**: `component`
- **Description**: UI components in the Zopio design system
- **Key Attributes**:
  - `name`: Component name
  - `description`: Component description
  - `props`: Component props schema
  - `examples`: Usage examples

### 3. API Resources

- **Type**: `api`
- **Description**: API endpoints and their specifications
- **Key Attributes**:
  - `path`: API path
  - `method`: HTTP method
  - `parameters`: API parameters
  - `responses`: Expected responses

### 4. Data Model Resources

- **Type**: `model`
- **Description**: Data models used in the application
- **Key Attributes**:
  - `name`: Model name
  - `fields`: Model fields and their types
  - `relationships`: Relationships to other models

## Accessing Resources

AI tools can access MCP resources through the following methods:

1. **List Resources**: Get a list of available resources

   ```
   GET /mcp/resources
   ```

2. **Read Resource**: Get a specific resource by type and ID

   ```
   GET /mcp/resources/{type}/{id}
   ```

## Best Practices

When using MCP with the Zopio codebase, AI tools should:

1. **Follow Package Naming Conventions**: Always use `@repo/*` namespace for packages, not `@zopio/*`
2. **Respect Module Structure**: Understand the module categories and their relationships
3. **Use Type Information**: Leverage TypeScript types for better code generation
4. **Reference Documentation**: Link to relevant documentation when providing explanations

## Example Workflow

Here's an example of how an AI tool might use MCP to understand and work with the Zopio codebase:

1. List available packages:

   ```typescript
   const packages = await mcpClient.listResources('package');
   ```

2. Get details about a specific package:

   ```typescript
   const dataPackage = await mcpClient.readResource('package', 'data');
   ```

3. Use the package information to generate appropriate import statements:

   ```typescript
   import { DataProvider } from '@repo/data';
   ```

## Integration with AI Tools

AI tools should integrate with MCP by:

1. Initializing an MCP client at the start of a session
2. Fetching relevant resources based on the current task
3. Using the resource information to guide code generation and recommendations
4. Validating generated code against resource schemas

## Troubleshooting

If an AI tool encounters issues with MCP:

1. Check that the resource type is valid
2. Verify that the resource ID exists
3. Ensure that the client is properly configured
4. Look for error messages in the response

## Further Reading

- [MCP Package Documentation](../packages/mcp/README.md)

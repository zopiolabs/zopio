# GitHub Provider

## Overview
GitHub API data provider for Zopio framework that implements the CRUD interface for GitHub repositories.

## Installation

```bash
# From your project root
npm install @repo/data-providers
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a GitHub provider instance
const dataProvider = createDataProvider({
  type: 'github',
  config: {
    token: 'your-github-personal-access-token',
    owner: 'organization-or-username',
    repo: 'repository-name',
    // Optional base URL for GitHub Enterprise
    baseUrl: 'https://github.example.com/api/v3'
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'issues',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'created_at', order: 'desc' },
  filter: { state: 'open', labels: 'bug' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `token` | `string` | Yes | GitHub personal access token |
| `owner` | `string` | Yes | Repository owner (organization or username) |
| `repo` | `string` | Yes | Repository name |
| `baseUrl` | `string` | No | Base URL for GitHub Enterprise (defaults to GitHub.com API) |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of resources (issues, pull requests, etc.) with pagination, sorting, and filtering
- `getOne`: Retrieve a single resource by ID
- `create`: Create a new resource
- `update`: Update an existing resource
- `deleteOne`: Delete a resource by ID

## Supported Resources

The GitHub provider supports the following resources:

- `issues`: GitHub Issues
- `pulls`: Pull Requests
- `releases`: Releases
- `commits`: Repository Commits
- `branches`: Repository Branches
- `labels`: Issue Labels
- `milestones`: Project Milestones
- `users`: Repository Contributors

## Integration with GitHub

The provider translates Zopio's data queries into GitHub API calls, handling pagination, filtering, and sorting according to GitHub's API specifications. It supports both GitHub.com and GitHub Enterprise deployments.

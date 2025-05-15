# Notion Provider

## Overview
Notion data provider for Zopio framework that implements the CRUD interface for Notion databases and pages.

## Installation

```bash
# From your project root
npm install @repo/data-providers @notionhq/client
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Notion provider instance
const dataProvider = createDataProvider({
  type: 'notion',
  config: {
    apiKey: 'secret_your_notion_integration_token',
    databaseMapping: {
      posts: 'database_id_for_posts', // Maps 'posts' resource to a specific Notion database
      users: 'database_id_for_users' // Maps 'users' resource to a specific Notion database
    },
    // Optional property mapping
    propertyMapping: {
      posts: {
        id: 'ID',
        title: 'Title',
        content: 'Content',
        status: 'Status',
        author: 'Author'
      }
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'title', order: 'asc' },
  filter: { status: 'Published' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes | Notion integration token |
| `databaseMapping` | `Record<string, string>` | Yes | Maps resource names to Notion database IDs |
| `propertyMapping` | `Record<string, Record<string, string>>` | No | Maps resource fields to Notion property names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of database items with pagination, sorting, and filtering
- `getOne`: Retrieve a single database item by ID
- `create`: Create a new database item
- `update`: Update an existing database item
- `deleteOne`: Archive a database item by ID

## Integration with Notion

The provider translates Zopio's data queries into Notion API calls, handling:

- Authentication with Notion integration token
- Pagination with cursor-based pagination
- Filtering using Notion's filter objects
- Sorting by Notion properties
- Property type mapping (text, number, select, multi-select, date, etc.)
- Rich text content handling

## Property Type Support

The provider supports the following Notion property types:

- Title
- Rich Text
- Number
- Select
- Multi-select
- Date
- People
- Files & Media
- Checkbox
- URL
- Email
- Phone Number
- Formula
- Relation
- Created time
- Created by
- Last edited time
- Last edited by

## Limitations

- Notion API rate limits may affect performance with large datasets
- Some complex filtering operations may be limited by Notion's API capabilities
- Real-time updates are not supported through the Notion API

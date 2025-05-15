# Google Sheets Provider

## Overview
Google Sheets data provider for Zopio framework that implements the CRUD interface for Google Sheets as a data source.

## Installation

```bash
# From your project root
npm install @repo/data-providers googleapis
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';

// Create a Google Sheets provider instance
const dataProvider = createDataProvider({
  type: 'google-sheets',
  config: {
    apiKey: 'your-google-api-key', // For public sheets
    // OR use OAuth credentials
    credentials: {
      client_email: 'your-service-account-email',
      private_key: 'your-service-account-private-key'
    },
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    sheetMapping: {
      posts: 'Posts', // Maps 'posts' resource to 'Posts' sheet
      users: 'Users' // Maps 'users' resource to 'Users' sheet
    },
    // Optional header row configuration
    headerRow: 1,
    // Optional column mapping
    columnMapping: {
      posts: {
        id: 'ID',
        title: 'Post Title',
        content: 'Content',
        author: 'Author Name'
      }
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'title', order: 'asc' },
  filter: { author: 'John Doe' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | Yes* | Google API key (for public sheets) |
| `credentials` | `object` | Yes* | Service account credentials (for private sheets) |
| `spreadsheetId` | `string` | Yes | ID of the Google Spreadsheet |
| `sheetMapping` | `Record<string, string>` | Yes | Maps resource names to sheet names |
| `headerRow` | `number` | No | Row number containing headers (defaults to 1) |
| `columnMapping` | `Record<string, Record<string, string>>` | No | Maps resource fields to sheet columns |

*Either `apiKey` or `credentials` must be provided

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of rows with pagination, sorting, and filtering
- `getOne`: Retrieve a single row by ID
- `create`: Create a new row
- `update`: Update an existing row
- `deleteOne`: Delete a row by ID

## Integration with Google Sheets

The provider translates Zopio's data queries into Google Sheets API calls, handling:

- Row-based data storage and retrieval
- Header-based column mapping
- In-memory filtering and sorting
- Pagination through row ranges
- Authentication through API key or service account

## Limitations

- Complex filtering operations are performed in-memory after fetching data
- Performance may degrade with large spreadsheets
- Real-time updates are not supported
- Concurrent edits may cause conflicts

# @repo/jsonapi-adapter

## Overview
A utility module for parsing and flattening JSON:API-compliant server responses in the Zopio framework.

## Features

- **Normalize JSON:API Data** - Transforms `data` and `included` resources into usable objects
- **Handle Relationships** - Automatically resolves relationships between resources
- **Flatten Nested Structures** - Converts complex JSON:API entities to simple objects

## Usage

```typescript
import { normalizeJsonApi, flattenJsonApi } from '@repo/jsonapi-adapter';

// Normalize a complete JSON:API response with included resources
const apiResponse = {
  data: [
    {
      id: '1',
      type: 'articles',
      attributes: { title: 'JSON:API paints my bikeshed!' },
      relationships: {
        author: { data: { type: 'people', id: '9' } }
      }
    }
  ],
  included: [
    {
      id: '9',
      type: 'people',
      attributes: { name: 'John Doe' }
    }
  ]
};

// Normalize the response (resolves relationships)
const normalizedData = normalizeJsonApi(apiResponse);
// Result: [{ id: '1', title: 'JSON:API paints my bikeshed!', author: { id: '9', name: 'John Doe' } }]

// Flatten a single entity
const entity = {
  id: '1',
  type: 'articles',
  attributes: { title: 'JSON:API paints my bikeshed!' },
  relationships: {
    author: { data: { type: 'people', id: '9' } }
  }
};

const flattened = flattenJsonApi(entity);
// Result: { id: '1', title: 'JSON:API paints my bikeshed!', author: { type: 'people', id: '9' } }
```

## API Reference

### `normalizeJsonApi(response)`

Normalizes a JSON:API response into a flat array of entities with resolved relationships.

**Parameters:**
- `response` - A JSON:API compliant response object

**Returns:**
- An array of normalized entities with resolved relationships

### `flattenJsonApi(data)`

Flattens a JSON:API entity into a simple object.

**Parameters:**
- `data` - A JSON:API entity object

**Returns:**
- A flattened object with ID and attributes

## Integration with Zopio

This adapter is designed to work seamlessly with other Zopio data packages:

```typescript
import { normalizeJsonApi } from '@repo/jsonapi-adapter';
import { fetchData } from '@repo/http-client';
import { useQuery } from '@repo/data-hooks';

function useArticles() {
  return useQuery('articles', async () => {
    const response = await fetchData('/api/articles?include=author');
    return normalizeJsonApi(response);
  });
}
```

# @repo/adapters

## Overview
A unified collection of data format adapters for the Zopio framework. These adapters provide consistent interfaces for transforming data between different API formats and Zopio's internal data structures.

## Module Categories

### Core Adapters
- **JSON:API Adapter** - Transforms JSON:API compliant responses
- **Odoo Adapter** - Handles Odoo's unique data structures

### Common Utilities
- **Type Definitions** - Shared types across adapters
- **Utility Functions** - Helper functions for data manipulation

## Usage Guidelines

```typescript
// Import specific adapter
import { jsonapi, odoo } from '@repo/adapters';

// Using JSON:API adapter
const normalizedData = jsonapi.normalizeJsonApi(apiResponse);

// Using Odoo adapter
const odooFilter = odoo.buildOdooDomain({ name: { $contains: 'test' } });
const normalizedRecord = odoo.normalizeOdooRecord(odooResponse);
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package:

```json
{
  "dependencies": {
    "@repo/adapters": "workspace:*"
  }
}
```

## Development Guidelines

When extending or modifying adapters:

1. Maintain consistent interfaces across adapters
2. Add comprehensive JSDoc comments
3. Keep adapters focused on data transformation only
4. Place shared functionality in the common module

## Integration Examples

### JSON:API Integration

```typescript
import { jsonapi } from '@repo/adapters';
import { fetchData } from '@repo/http-client';

async function getUsers() {
  const response = await fetchData('/api/users');
  return jsonapi.normalizeJsonApi(response);
}
```

### Odoo Integration

```typescript
import { odoo } from '@repo/adapters';
import { odooClient } from '@repo/odoo-client';

async function searchProducts(query) {
  const domain = odoo.buildOdooDomain({ name: { $contains: query } });
  const results = await odooClient.search('product.template', domain);
  return results.map(odoo.normalizeOdooRecord);
}
```

## Documentation References

- [JSON:API Specification](https://jsonapi.org/)
- [Odoo API Documentation](https://www.odoo.com/documentation/16.0/developer/api.html)

## Contributing Guidelines

When adding new adapters:

1. Follow the established folder structure
2. Create comprehensive documentation
3. Implement consistent interfaces
4. Add appropriate tests
5. Update this README with new adapter details

## License Information

UNLICENSED - Proprietary Zopio software

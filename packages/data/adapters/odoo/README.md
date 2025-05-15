# @repo/odoo-adapter

## Overview
A utility and adapter layer for handling Odoo API structures within the Zopio Framework. Designed to work alongside `@repo/odoo-client`.

## Features

- **Record Normalization** - Transforms raw Odoo responses into clean JavaScript objects
- **Input Flattening** - Prepares data for Odoo create/update operations
- **Domain Building** - Simplifies creating Odoo search domains from filter objects
- **Case Conversion** - Utilities for converting between snake_case and camelCase
- **Relation Helpers** - Functions for working with Odoo's unique relation formats

## Usage

```typescript
import {
  normalizeOdooRecord,
  flattenOdooInput,
  buildOdooDomain,
  snakeToCamel,
  camelToSnake,
  isMany2One,
  parseMany2One
} from '@repo/odoo-adapter';

// Normalize an Odoo record
const odooRecord = {
  id: 1,
  name: 'Product A',
  category_id: [5, 'Electronics'],
  partner_id: [42, 'ACME Inc.']
};

const normalized = normalizeOdooRecord(odooRecord);
// Result: { id: 1, name: 'Product A', category_id: { id: 5, name: 'Electronics' }, partner_id: { id: 42, name: 'ACME Inc.' } }

// Flatten an object for Odoo input
const inputData = {
  name: 'Product B',
  category_id: { id: 5, name: 'Electronics' }
};

const flattened = flattenOdooInput(inputData);
// Result: { name: 'Product B', category_id: 5 }

// Build an Odoo domain filter
const filter = {
  name: { $contains: 'Product' },
  active: true
};

const domain = buildOdooDomain(filter);
// Result: [['name', 'ilike', 'Product'], ['active', '=', true]]

// Convert between snake_case and camelCase
const snakeObj = { product_name: 'Laptop', product_type: 'Electronics' };
const camelObj = snakeToCamel(snakeObj);
// Result: { productName: 'Laptop', productType: 'Electronics' }

const backToSnake = camelToSnake(camelObj);
// Result: { product_name: 'Laptop', product_type: 'Electronics' }

// Check and parse Many2One relations
const relation = [5, 'Electronics'];
if (isMany2One(relation)) {
  const parsed = parseMany2One(relation);
  // Result: { id: 5, name: 'Electronics' }
}
```

## API Reference

### `normalizeOdooRecord(record)`
Normalizes an Odoo record by converting many2one fields to object format.

**Parameters:**
- `record` - The raw Odoo record to normalize

**Returns:**
- A normalized record with properly formatted relation fields

### `flattenOdooInput(data)`
Flattens an object for Odoo API input by converting objects with IDs to just IDs.

**Parameters:**
- `data` - The data to flatten for Odoo API input

**Returns:**
- A flattened object suitable for Odoo API operations

### `buildOdooDomain(filter)`
Builds an Odoo domain filter array from a simple filter object.

**Parameters:**
- `filter` - The filter object with field names and values

**Returns:**
- An Odoo domain array suitable for search operations

### `snakeToCamel(obj)` / `camelToSnake(obj)`
Converts between snake_case and camelCase object keys.

**Parameters:**
- `obj` - The object to convert

**Returns:**
- A new object with converted keys

### `isMany2One(val)` / `parseMany2One(val)`
Utilities for working with Odoo's many2one relation format.

## Integration with Zopio

This adapter is designed to work seamlessly with other Zopio data packages:

```typescript
import { normalizeOdooRecord, buildOdooDomain } from '@repo/odoo-adapter';
import { OdooClient } from '@repo/odoo-client';

async function getProducts(client, nameFilter) {
  const domain = buildOdooDomain({ name: { $contains: nameFilter } });
  const results = await client.search_read('product.template', domain);
  return results.map(normalizeOdooRecord);
}
```

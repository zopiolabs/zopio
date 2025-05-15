# @repo/adapters-common

## Overview
Common utilities and type definitions shared across data adapters in the Zopio framework.

## Features

- **Type Definitions** - Shared types for consistent interfaces
- **Utility Functions** - Helper functions for data manipulation

## Usage

```typescript
import { GenericRecord, RelationObject, getNestedProperty, removeUndefined } from '@repo/adapters-common';

// Using type definitions
const record: GenericRecord = { id: 1, name: 'Test' };
const relation: RelationObject = { id: 5, name: 'Category' };

// Using utility functions
const user = {
  profile: {
    contact: {
      email: 'user@example.com'
    }
  }
};

// Access nested properties safely
const email = getNestedProperty(user, 'profile.contact.email');
// Result: 'user@example.com'

const phone = getNestedProperty(user, 'profile.contact.phone', 'N/A');
// Result: 'N/A' (default value)

// Remove undefined values
const data = {
  name: 'Product',
  description: undefined,
  price: 99.99,
  category: undefined
};

const cleaned = removeUndefined(data);
// Result: { name: 'Product', price: 99.99 }
```

## API Reference

### Types

#### `GenericRecord`
A generic record type with string keys and any values.

```typescript
type GenericRecord = Record<string, any>;
```

#### `RelationObject`
Interface for relation objects with ID and name.

```typescript
interface RelationObject {
  id: number | string;
  name: string;
}
```

#### `FilterOperator`
Type for filter operators used in query building.

```typescript
type FilterOperator = 
  | '$eq'     // Equal to
  | '$ne'     // Not equal to
  | '$gt'     // Greater than
  | '$gte'    // Greater than or equal to
  | '$lt'     // Less than
  | '$lte'    // Less than or equal to
  | '$in'     // In array
  | '$nin'    // Not in array
  | '$contains' // Contains substring
  | '$exists'; // Field exists
```

### Functions

#### `getNestedProperty(obj, path, defaultValue)`
Safely accesses a nested property in an object using a path string.

**Parameters:**
- `obj` - The object to access
- `path` - The dot-notation path to the property (e.g., 'user.profile.name')
- `defaultValue` - The default value to return if the path doesn't exist

**Returns:**
- The value at the path or the default value

#### `removeUndefined(obj)`
Removes undefined values from an object.

**Parameters:**
- `obj` - The object to clean

**Returns:**
- A new object without undefined values

## Integration with Adapters

This package is used internally by all Zopio data adapters:

```typescript
import { GenericRecord, getNestedProperty } from '@repo/adapters-common';

export function processData(data: GenericRecord): GenericRecord {
  const result: GenericRecord = {};
  
  // Use common utilities for data processing
  const name = getNestedProperty(data, 'attributes.name');
  if (name) {
    result.name = name;
  }
  
  return result;
}
```

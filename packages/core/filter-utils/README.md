# @core/filter-utils

Conditional filter resolver utility for Zopio.

## Features

- Supports `condition` flag on filters
- Returns simplified object for API query parameters
- Tree-shakable and edge-compatible

## Example

```ts
import { resolveFilters } from "@core/filter-utils";

const query = resolveFilters([
  { field: "status", operator: "eq", value: "active", condition: true },
  { field: "role", operator: "eq", value: "admin", condition: isAdmin }
]);

// Result excludes filters where condition === false
```

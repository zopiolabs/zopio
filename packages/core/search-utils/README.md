# @core/search-utils

Utility for generating search filters from text input.

## Example

```ts
import { buildSearchFilters } from "@core/search-utils";

const filters = buildSearchFilters(["name", "email"], "john");

// => [
//   { field: "name", operator: "contains", value: "john", condition: true },
//   { field: "email", operator: "contains", value: "john", condition: true }
// ]
```

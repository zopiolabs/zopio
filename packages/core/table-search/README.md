# @addon/table-search

UI and hook utilities for table search experience in Zopio.

## Includes

- `<SearchInput />`: A debounce-based input component.
- `useTableSearch()`: Hook for binding search term and generating filters.

## Example

```tsx
import { SearchInput, useTableSearch } from "@addon/table-search";

const { search, setSearch, filters } = useTableSearch(["name", "email"]);

<SearchInput onChange={setSearch} />

// filters can be used in CRUD list queries
```

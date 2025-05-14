# @repo/data-table

Composable `useTable` hook for Zopio framework.

## Features

- Pagination
- Sorting
- Filtering (basic key-value)
- Resource-based loading

## Usage

```tsx
const { tableData, loading, page, setPage, pageSize, sort, setSort } = useTable({
  resource: "users",
});
```

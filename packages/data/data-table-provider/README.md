# @repo/data-table (Advanced)

useTable hook with integration to `@repo/data-provider`.

## Features

- Pagination
- Sorting
- Filtering
- Integrated with dataProvider.getList
- Total count (for pagination)

## Usage

```tsx
const { tableData, total, loading, page, setPage, sort, setSort } = useTable({
  resource: "users",
  filters: { role: "admin" },
});
```

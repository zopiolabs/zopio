# @repo/data-table (Bulk + Columns)

Data table hook for Zopio with:

- Bulk delete
- Column visibility toggling
- Full provider integration

## Usage

```tsx
const {
  tableData,
  toggleColumn,
  visibleColumns,
  bulkDelete,
} = useTable({ resource: "users" });
```

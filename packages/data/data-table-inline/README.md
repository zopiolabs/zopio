# @repo/data-table (Inline Edit + Search)

Advanced table hook for Zopio with:

- Inline editing
- Search query input
- Persistent column visibility

## Usage

```tsx
const {
  tableData,
  editRow,
  updateRow,
  search,
  setSearch,
  visibleColumns,
  toggleColumn,
} = useTable({ resource: "products" });
```

# @repo/data-table (Advanced)

Enhanced `useTable` hook for Zopio framework with:

- Pagination, Sorting, Filtering
- dataProvider integration
- Row selection support
- Export to CSV

## Usage

```tsx
const {
  tableData,
  selectedRows,
  toggleRow,
  toggleAll,
  exportCSV,
} = useTable({ resource: "users" });
```

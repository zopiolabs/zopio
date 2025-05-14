# @addon/import-export

Powerful data import/export addon for Zopio.

## Features

- Import: CSV, JSON, XLSX
- Export: CSV, JSON, XLSX
- Type-safe and edge-compatible
- Pluggable map/validate transformers

## Example

```ts
import { importData, exportData } from "@addon/import-export";

// import
const rows = await importData({
  format: "csv",
  file,
  map: row => ({ ...row, id: String(row.id) }),
  validate: row => !!row.name
});

// export
const blob = exportData({
  format: "xlsx",
  data: rows
});
```

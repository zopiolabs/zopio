# @repo/data-table (Live Update)

Zopio useTable with automatic live polling support.

## Features

- Polling interval (default: 10s)
- Option to disable
- Future-ready for WebSocket integration

## Usage

```tsx
const { tableData, enableLive, disableLive } = useTable({ resource: "orders", live: true });
```

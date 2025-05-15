# @zopio/syncops-client

A specialized client for fetching data through **SyncOps**, Zopio's internal integration hub service.

## Features

- Fully compatible with `@repo/crud` interface
- REST connectivity to all data sources synchronized through SyncOps
- Edge-safe design (fetch-based)

## Usage

```ts
import { createSyncOpsClient } from "@repo/syncops-client";

const client = createSyncOpsClient({
  baseUrl: "https://syncops.io/",
  headers: {
    Authorization: "Bearer token"
  }
});
```
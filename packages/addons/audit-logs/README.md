# @addon/audit-logs

Minimal, pluggable audit log system for Zopio addons.

## Features

- Tracks create, read, update, delete actions
- Includes resource, user, timestamp, diff and metadata
- Pluggable logger adapters (default: console)

## Usage

```ts
import { ConsoleAuditLogger } from "@addon/audit-logs";

const logger = new ConsoleAuditLogger();

await logger.log({
  resource: "posts",
  action: "create",
  data: { id: "1", title: "New Post" },
  user: { id: "admin" }
});
```

# @repo/rest-client

REST implementation of the `@repo/crud` interface.

This module provides a flexible and edge-compatible REST client for CRUD operations using the `fetch` API.

## Usage

```ts
import { createRestClient } from "@repo/rest-client";

const client = createRestClient({ baseUrl: "/api" });

await client.getList({ resource: "users" });
```
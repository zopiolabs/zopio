# @repo/data-provider

A flexible and pluggable data provider for Zopio framework.

## Features

- Unified access to CRUD operations
- Backed by Prisma, REST, or any custom data layer
- Easily mockable for testing
- Decouples frontend from database logic

## Usage

```ts
import { dataProvider } from "@repo/data-provider";

await dataProvider.update({
  resource: "users",
  id: 1,
  variables: { name: "New Name" }
});
```

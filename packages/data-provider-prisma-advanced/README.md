# @repo/data-provider-prisma (Advanced)

Advanced Prisma implementation for `@repo/data-provider` with resource-based resolver logic.

## Features

- Field-level permission
- Resource-specific filtering
- Audit & tenant scaffolding points

## Example

```ts
await dataProvider.getList({ resource: "products" }); // filters `active: true`
await dataProvider.getList({ resource: "users" });    // limits fields
```

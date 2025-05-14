# @repo/data-provider-prisma

Prisma implementation for `@repo/data-provider` interface.

## Usage

```ts
import { dataProvider } from "@repo/data-provider-prisma";

await dataProvider.update({
  resource: "user",
  id: 1,
  variables: { name: "Updated Name" }
});
```

You must ensure your Prisma client is correctly initialized and the resource name matches your Prisma model.

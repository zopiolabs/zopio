# @repo/data-hooks

React hooks to manage data mutations (create, update, delete) for the Zopio framework.

## Features

- useCreate
- useUpdate
- useDelete
- Internally uses `@repo/data-mutation`

## Usage

```tsx
import { useUpdate } from "@repo/data-hooks";

const { mutate, loading } = useUpdate(async (input) => {
  return await fetch(`/api/posts/${input.id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  }).then((res) => res.json());
});

mutate({ id: 1, title: "Updated" });
```

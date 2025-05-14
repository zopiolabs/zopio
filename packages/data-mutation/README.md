# @repo/data-mutation

Framework-agnostic data mutation system for the Zopio framework.

## Features

- Mutation wrapper to handle success/error/invalidation
- Compatible with edge environments
- Works with fetch, axios or any async function

## Usage

```ts
import { createMutation } from "@repo/data-mutation";

const updateUser = createMutation(
  async (input) => {
    const res = await fetch(`/api/users/${input.id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return res.json();
  },
  {
    onSuccess: (data) => console.log("Updated:", data),
    onError: (err) => console.error("Failed:", err),
    invalidateKeys: ["user-list"]
  }
);

await updateUser({ id: 1, name: "Jane" });
```

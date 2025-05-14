# @repo/data-query

Simple data querying hook for the Zopio framework.

## Features

- `useQuery`: fetch data via any async function
- Built-in loading and error state
- Minimal and framework-agnostic

## Usage

```tsx
import { useQuery } from "@repo/data-query";

const { data, loading, error } = useQuery(async () => {
  return await fetch("/api/posts").then(res => res.json());
});
```

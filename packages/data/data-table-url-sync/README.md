# @repo/data-table (URL Sync)

Zopio useTable with Next.js-compatible query param synchronization.

## Features

- Syncs `page`, `sort`, `search`, `filters` with URL
- Uses Next.js `useSearchParams` and `useRouter`
- SSR friendly and deep-link shareable

## Usage

```tsx
const { page, search, setSearch } = useTable({ resource: "posts", syncToUrl: true });
```

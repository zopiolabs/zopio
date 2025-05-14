# @repo/state

This package provides core state management using [Zustand](https://github.com/pmndrs/zustand) for the Zopio framework. It is edge-compatible and designed with modular usage in mind.

## Stores
- `useSessionStore`: Holds session-level user data.
- `useTenantStore`: Handles current tenant context.
- `useFeatureFlagsStore`: Stores dynamic feature flags.

## Installation
```bash
pnpm add @repo/state
```

## Usage Example
```ts
import { useSessionStore } from '@repo/state'

const userId = useSessionStore((state) => state.userId)
const setUserId = useSessionStore((state) => state.setUserId)

useEffect(() => {
  setUserId('abc123')
}, [])
```

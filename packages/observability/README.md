# @zopio/observability

Internal logging system for Zopio packages with pluggable providers.

## Features

- Set a custom log provider with `setLogProvider()`
- Use `createMockLogProvider()` for testing
- Use `createNoopLogProvider()` to silence logs
- Base interface defined for implementing custom providers like Sentry

## Example

```ts
import { setLogProvider, createMockLogProvider } from '@zopio/observability';

const mock = createMockLogProvider();
setLogProvider(mock);

mock.log('info', 'auth.success', { userId: '123' });
console.log(mock.getLogs());
```

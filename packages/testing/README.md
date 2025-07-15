# @repo/testing

## Overview

The `@repo/testing` package provides a standardized testing configuration for Zopio applications. It includes a pre-configured Vitest setup with React testing support, path aliases, and a consistent testing environment across the monorepo.

## Module Categories

### Test Configuration

- **Vitest Config**: Pre-configured Vitest setup for React applications
- **Path Aliases**: Standardized path resolution for imports in tests

## Usage Guidelines

### Basic Usage

```typescript
// vitest.config.ts
import config from '@repo/testing';

export default config;
```

### Custom Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@repo/testing';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    // Add custom test configuration
  },
});
```

## Installation

Add the package to your project:

```bash
pnpm add -D @repo/testing
```

## Development Guidelines

### Project Structure

```
testing/
├── index.js       # Main exports with Vitest configuration
├── src/           # Additional testing utilities
└── package.json   # Package dependencies
```

### Dependencies

- `vitest`: Test runner
- `@vitejs/plugin-react`: React plugin for Vitest

### Best Practices

1. **Consistent Configuration**: Use the standard configuration across all projects in the monorepo.
2. **Path Aliases**: Utilize the provided path aliases (`@` and `@repo`) for cleaner imports.
3. **Environment**: Tests run in the `jsdom` environment by default for React component testing.
4. **Test Organization**: Keep tests alongside the code they test or in a `__tests__` directory.

## Integration Examples

### Basic Component Test

```tsx
// components/__tests__/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Test

```typescript
// api/__tests__/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET } from '../users/route';

describe('Users API', () => {
  beforeEach(() => {
    // Setup test environment
  });
  
  it('returns users successfully', async () => {
    const { req } = createMocks({
      method: 'GET',
    });
    
    const response = await GET(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.users).toBeDefined();
  });
});
```

### Custom Test Setup

```typescript
// setup-tests.ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { mockServer } from './mocks/server';

// Setup MSW
beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

// Mock environment variables
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn().mockReturnValue({ value: 'test-session' }),
  }),
}));

// Add custom matchers
expect.extend({
  // Custom matchers here
});
```

## Documentation References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Keep the testing configuration simple and focused.
3. Document any new testing utilities or changes to existing ones.
4. Ensure backward compatibility when updating the configuration.

## License

MIT

# @repo/core-utils

## Overview

The `@repo/core-utils` package provides essential utility functions for Zopio applications. It includes utilities for logging, asynchronous operations, object manipulation, string formatting, and array operations. These utilities are designed to be lightweight, type-safe, and consistent across all Zopio modules.

## Module Categories

### Logger

- **Consistent Logging**: Environment-aware logging utilities with support for different log levels
- **Production-Ready**: Configurable behavior based on NODE_ENV

### Async Utilities

- **Safe Async**: Error handling wrapper for async functions
- **Result Pattern**: Returns tuple of [result, error] for clean error handling

### Object Utilities

- **Deep Merge**: Type-safe deep merging of objects
- **Object Type Guards**: Utilities for checking object types

### String Utilities

- **Case Conversion**: Convert between camelCase and kebab-case
- **String Formatting**: Utilities for consistent string manipulation

### Array Utilities

- **Grouping**: Group arrays by specified keys
- **Collection Manipulation**: Type-safe array operations

## Usage Guidelines

### Logger

```typescript
import { logger } from '@repo/core-utils';

// Different log levels
logger.info('Application started');
logger.error('Failed to connect to database', { error: 'Connection refused' });
logger.warn('Deprecated feature used', { feature: 'oldAPI' });
logger.debug('Debug information', { requestId: '123', payload: { user: 'test' } });

// Environment-aware logging
// - info: Logged in non-production environments
// - error: Always logged
// - warn: Always logged
// - debug: Only logged in development environment
```

### Async Utilities

```typescript
import { asyncUtils } from '@repo/core-utils';

// Wrap an async function to safely handle errors
const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const safeFetch = asyncUtils.safeAsync(fetchData);

// Use the safe version
async function getData() {
  const [data, error] = await safeFetch('https://api.example.com/data');
  
  if (error) {
    logger.error('Failed to fetch data', { error });
    return null;
  }
  
  return data;
}
```

### Object Utilities

```typescript
import { objectUtils } from '@repo/core-utils';

// Deep merge objects
const defaultConfig = {
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#ff4081',
    },
    fonts: {
      main: 'Inter',
    },
  },
  features: {
    darkMode: true,
  },
};

const userConfig = {
  theme: {
    colors: {
      primary: '#1a73e8',
    },
  },
};

const mergedConfig = objectUtils.deepMerge(defaultConfig, userConfig);
// Result:
// {
//   theme: {
//     colors: {
//       primary: '#1a73e8',
//       secondary: '#ff4081',
//     },
//     fonts: {
//       main: 'Inter',
//     },
//   },
//   features: {
//     darkMode: true,
//   },
// }
```

### String Utilities

```typescript
import { stringUtils } from '@repo/core-utils';

// Convert to camelCase
const camelCased = stringUtils.toCamelCase('user profile settings');
console.log(camelCased); // 'userProfileSettings'

// Convert to kebab-case
const kebabCased = stringUtils.toKebabCase('userProfileSettings');
console.log(kebabCased); // 'user-profile-settings'
```

### Array Utilities

```typescript
import { arrayUtils } from '@repo/core-utils';

// Group an array of objects by a key
const users = [
  { id: 1, role: 'admin', name: 'Alice' },
  { id: 2, role: 'user', name: 'Bob' },
  { id: 3, role: 'admin', name: 'Charlie' },
  { id: 4, role: 'user', name: 'Dave' },
];

const groupedByRole = arrayUtils.groupBy(users, 'role');
// Result:
// {
//   admin: [
//     { id: 1, role: 'admin', name: 'Alice' },
//     { id: 3, role: 'admin', name: 'Charlie' },
//   ],
//   user: [
//     { id: 2, role: 'user', name: 'Bob' },
//     { id: 4, role: 'user', name: 'Dave' },
//   ],
// }
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/core-utils
```

## Development Guidelines

### Project Structure

```plaintext
core-utils/
├── index.ts        # Main exports with all utilities
└── package.json    # Package dependencies
```

### Dependencies

- `tslib`: TypeScript runtime library

### Best Practices

1. **Type Safety**: All utilities are fully typed for better developer experience.
2. **Pure Functions**: Utilities are designed as pure functions where possible.
3. **No Side Effects**: Avoid side effects except for logging functions.
4. **Consistent Error Handling**: Use the result pattern [data, error] for async operations.
5. **Environment Awareness**: Respect NODE_ENV for different behaviors in development vs production.

## Integration Examples

### Error Handling in API Routes

```typescript
// app/api/users/route.ts
import { asyncUtils, logger } from '@repo/core-utils';
import { db } from '@repo/database';
import { NextResponse } from 'next/server';

const getUsers = async () => {
  return db.user.findMany();
};

const safeGetUsers = asyncUtils.safeAsync(getUsers);

export async function GET() {
  const [users, error] = await safeGetUsers();
  
  if (error) {
    logger.error('Failed to fetch users', { error });
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ users });
}
```

### Configuration Management

```typescript
// lib/config.ts
import { objectUtils } from '@repo/core-utils';

type ThemeConfig = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    unit: number;
    small: number;
    medium: number;
    large: number;
  };
};

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#0070f3',
    secondary: '#ff4081',
    background: '#ffffff',
    text: '#000000',
  },
  spacing: {
    unit: 4,
    small: 8,
    medium: 16,
    large: 32,
  },
};

export function createTheme(overrides: Partial<ThemeConfig> = {}): ThemeConfig {
  return objectUtils.deepMerge(defaultTheme, overrides);
}

// Usage
const darkTheme = createTheme({
  colors: {
    background: '#121212',
    text: '#ffffff',
  },
});
```

### String Formatting for URLs

```typescript
// lib/routes.ts
import { stringUtils } from '@repo/core-utils';

export function createSlug(title: string): string {
  return stringUtils.toKebabCase(title);
}

// Usage
const articleTitle = 'How to Use Core Utils in Zopio';
const slug = createSlug(articleTitle);
// Result: 'how-to-use-core-utils-in-zopio'

const url = `/articles/${slug}`;
// Result: '/articles/how-to-use-core-utils-in-zopio'
```

### Data Processing with Array Utilities

```typescript
// lib/analytics.ts
import { arrayUtils } from '@repo/core-utils';

type PageView = {
  page: string;
  timestamp: string;
  userId: string;
  duration: number;
};

export function analyzePageViews(pageViews: PageView[]) {
  // Group page views by page
  const viewsByPage = arrayUtils.groupBy(pageViews, 'page');
  
  // Calculate average duration per page
  const analytics = Object.entries(viewsByPage).map(([page, views]) => {
    const totalDuration = views.reduce((sum, view) => sum + view.duration, 0);
    const averageDuration = totalDuration / views.length;
    
    return {
      page,
      views: views.length,
      averageDuration,
    };
  });
  
  return analytics;
}
```

## Documentation References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Error Handling Best Practices](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Keep utilities pure and side-effect free where possible.
3. Add comprehensive JSDoc comments for all exported functions.
4. Include type safety for all parameters and return values.
5. Write tests for new utilities to ensure they work as expected.

## License

MIT

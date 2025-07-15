# @repo/typescript-config

## Overview

The `@repo/typescript-config` package provides standardized TypeScript configurations for the Zopio monorepo. It includes shared base configurations and specialized presets for different project types (Next.js applications, React libraries). This package ensures consistent TypeScript settings across all projects in the Zopio ecosystem.

## Module Categories

### Base Configuration

- **Standard Settings**: Core TypeScript compiler options
- **Module System**: NodeNext module resolution
- **Target**: ES2022 JavaScript output

### Specialized Configurations

- **Next.js**: Configuration optimized for Next.js applications
- **React Library**: Configuration for React component libraries

## Usage Guidelines

### Base Configuration

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    // Additional project-specific settings
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### Next.js Configuration

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    // Additional project-specific settings
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### React Library Configuration

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    // Additional project-specific settings
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

## Installation

Add the package to your project:

```bash
pnpm add -D @repo/typescript-config
```

## Development Guidelines

### Project Structure

```plaintext
typescript-config/
├── base.json             # Base TypeScript configuration
├── nextjs.json           # Next.js-specific configuration
├── react-library.json    # React library configuration
├── index.d.ts            # Type declarations
└── package.json          # Package metadata
```

### Configuration Details

#### Base Configuration (`base.json`)

The base configuration includes:

- **Target**: ES2022
- **Module**: NodeNext
- **Module Resolution**: NodeNext
- **Strict Type Checking**: Enabled
- **Strict Null Checks**: Enabled
- **Declaration Files**: Generated with source maps
- **Isolated Modules**: Enabled for better compatibility with bundlers
- **ES Module Interop**: Enabled for better compatibility with CommonJS modules

#### Next.js Configuration (`nextjs.json`)

Extends the base configuration and adds:

- **JSX Preservation**: For Next.js optimization
- **Next.js Plugin**: For enhanced type checking
- **Path Aliases**: `@/*` for current directory and `@repo/*` for packages
- **Module**: ESNext
- **Module Resolution**: Bundler
- **No Emit**: Prevents TypeScript from generating output files (handled by Next.js)

#### React Library Configuration (`react-library.json`)

Extends the base configuration and adds:

- **JSX Factory**: React JSX transform

### Best Practices

1. **Extend Don't Override**: Always extend these configurations rather than copying them.
2. **Version Control**: Keep your project's TypeScript version in sync with the one specified in the Zopio standards (5.8.3).
3. **Path Aliases**: Use the provided path aliases (`@/*` and `@repo/*`) for imports.
4. **Type Imports**: Always use the `import type` syntax for type-only imports.
5. **Strict Mode**: Don't disable strict mode or strict null checks.

## Integration Examples

### Basic TypeScript Package

```json
// packages/example-package/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Next.js Application

```json
// apps/web/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@lib/*": ["./lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### React Component Library

```json
// packages/ui/tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "**/*.stories.tsx", "**/*.test.tsx"]
}
```

### API Package with Custom Types

```json
// packages/api/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": ["src/**/*.ts", "types/**/*.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Documentation References

- [TypeScript Configuration Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js TypeScript Documentation](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript standards (version 5.8.3).
2. Maintain backward compatibility when updating configurations.
3. Document any changes to compiler options.
4. Test configuration changes with different project types before committing.
5. Ensure all configurations have proper JSON schema references.

## License

MIT

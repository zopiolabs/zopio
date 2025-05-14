# Zopio Core Packages

This directory contains the core packages that form the foundation of the Zopio framework. These packages are essential for basic functionality and are required by most applications.

## Core Module Categories

### Authentication & Authorization
Complete authentication and authorization system with multiple approaches:
- **auth** - Main authentication module
- **auth-abac** - Attribute-Based Access Control
- **auth-acp** - Access Control Provider
- **auth-core** - Core authentication utilities
- **auth-hooks** - React hooks for access control
- **auth-policy** - Policy management
- **auth-rbac** - Role-Based Access Control
- **auth-ui** - Authentication UI components
- **token** - Token management

```typescript
import { Auth } from '@repo/auth';
import { ABAC } from '@repo/auth-abac';
import { RBAC } from '@repo/auth-rbac';
```

### Security
Comprehensive security features:
- **security** - Core security utilities
- **security-headers** - Security headers for Next.js
- **rate-limit** - Rate limiting protection

```typescript
import { Security } from '@repo/security';
import { SecurityHeaders } from '@repo/security-headers';
```

### Data & Storage
Data management and storage solutions:
- **database** - Database utilities
- **storage** - File storage system
- **caching** - Performance caching

```typescript
import { Database } from '@repo/database';
import { Storage } from '@repo/storage';
```

### Communication
Communication channels:
- **email** - Email management
- **notifications** - In-app notifications
- **webhooks** - Webhook handling

```typescript
import { Email } from '@repo/email';
import { Notifications } from '@repo/notifications';
```

### UI & Design
Frontend components and systems:
- **design-system** - Core UI components
```typescript
import { DesignSystem } from '@repo/design-system';
```

### Feature Management
Application features:
- **feature-flags** - Feature toggling
- **internationalization** - i18n support
- **cms** - Content management

```typescript
import { FeatureFlags } from '@repo/feature-flags';
import { I18n } from '@repo/internationalization';
```

### System Infrastructure
Core infrastructure components:
- **event-bus** - Event handling
- **plugin-runtime** - Plugin system
- **runtime-adapter** - Runtime abstraction
- **payments** - Payment processing

```typescript
import { EventBus } from '@repo/event-bus';
import { PluginRuntime } from '@repo/plugin-runtime';
```

## Usage Guidelines

1. Core packages are required dependencies
2. All core modules follow strict semantic versioning
3. Breaking changes are clearly documented
4. TypeScript types are included by default
5. ESM modules are used throughout

## Installation

Install core packages using pnpm:

```bash
pnpm add @repo/<package-name>
```

## Development

When working on core packages:

1. Maintain backward compatibility
2. Include comprehensive tests
3. Update documentation
4. Follow TypeScript best practices
5. Ensure proper error handling
6. Add appropriate logging

## Integration

Core packages can be used individually or as part of the full framework:

```typescript
// Individual usage
import { Auth } from '@repo/auth';
import { Database } from '@repo/database';

// With dependency injection
import { createZopioApp } from '@repo/core';
```

## Documentation

Each core package includes:
- API documentation
- Usage examples
- Type definitions
- Integration guides
- Migration guides

For detailed documentation, see each package's individual README.

## Contributing

When contributing to core packages:

1. Follow the established architecture
2. Maintain backward compatibility
3. Include tests for new features
4. Update relevant documentation
5. Add migration guides for breaking changes

## License

All core packages are licensed under the same terms as the main Zopio framework.
See LICENSE file in the root directory for details.

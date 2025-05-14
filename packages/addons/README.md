# Zopio Addons

This directory contains optional addon modules that enhance Zopio's capabilities. Each addon is designed to be independent and can be integrated based on your project's needs.

## Available Addons

### AI & Machine Learning
- **AI Module** - AI integration module for machine learning and AI-powered features
  ```typescript
  import { AI } from '@repo/ai';
  ```

### Analytics & Monitoring
- **Analytics** - Analytics integration for tracking user behavior and application metrics
  ```typescript
  import { Analytics } from '@repo/analytics';
  ```
- **Better Stack** - Better Stack integration for uptime monitoring and logging
  ```typescript
  import { BetterStack } from '@repo/betterstack';
  ```
- **Observability** - Application observability with OpenTelemetry integration
  ```typescript
  import { Observability } from '@repo/observability';
  ```

### Team & Collaboration
- **Collaboration** - Real-time collaboration features and team workspace tools
  ```typescript
  import { Collaboration } from '@repo/collaboration';
  ```

### Security & Compliance
- **Compliance** - Compliance tools and security policy enforcement
  ```typescript
  import { Compliance } from '@repo/compliance';
  ```

### User Experience
- **Onboarding** - User onboarding flows and guided tutorials
  ```typescript
  import { Onboarding } from '@repo/onboarding';
  ```

### Infrastructure
- **Queue** - Background job processing and message queue system
  ```typescript
  import { Queue } from '@repo/queue';
  ```
- **Trigger.dev** - Integration module for Trigger.dev background jobs and workflows
  ```typescript
  import { TriggerDev } from '@repo/trigger-dev';
  ```

### SEO & Marketing
- **SEO** - Search engine optimization tools and meta tag management
  ```typescript
  import { SEO } from '@repo/seo';
  ```

### State Management
- **State** - Global state management and persistence
  ```typescript
  import { State } from '@repo/state';
  ```

### Development & Testing
- **Testing** - Testing utilities and test data generation
  ```typescript
  import { Testing } from '@repo/testing';
  ```

## Usage

1. Install the desired addon:
```bash
pnpm add @repo/<addon-name>
```

2. Import and use in your code:
```typescript
import { ModuleName } from '@repo/<addon-name>';
```

## Guidelines

- All addons follow the same package structure and naming conventions
- Addons must declare core dependencies as peerDependencies
- Each addon is independently versioned and maintained
- All addons are tree-shakable and follow ESM conventions
- Side effects are disabled by default for better optimization

## Contributing

When creating a new addon:

1. Follow the existing package structure
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Ensure all core dependencies are marked as peerDependencies
5. Add appropriate test coverage
6. Update this README when adding new modules

## License

See the LICENSE file in each addon's directory for specific terms.

# Zopio

**Ship faster with a production-grade Turborepo template for Next.js applications**

[Zopio](https://github.com/zopiolabs/zopio) is an enterprise-ready monorepo starter for building modern web applications with Next.js. Stop wasting time on boilerplate and infrastructure setup — Zopio provides a solid, opinionated foundation that lets you focus on delivering value to your users from day one.

## 🚀 Quick Start

```sh
npx zopio@latest init
cd my-app
pnpm install
pnpm dev
```

## 🏗️ Architecture

Zopio is built on [Turborepo](https://turbo.build/repo) and follows a carefully designed monorepo structure with apps and packages:

### Apps

- **app** (port 3000): Main user-facing application with authentication, database integration, and collaboration features
- **web** (port 3001): Marketing website with CMS, SEO, and analytics integration
- **api**: API server with authentication and database integration
- **docs**: Documentation site built with Fumadocs
- **email**: Email preview server for testing email templates
- **studio**: Admin dashboard for content management
- **dev-dashboard**: Developer UI for managing local development tools

### Core Packages

- **authentication**: User authentication via Clerk with sign-in/sign-up flows
- **database**: Type-safe ORM (Prisma) with PostgreSQL (Neon) integration
- **design-system**: Shared UI components, hooks, and utilities built on shadcn/ui
- **cms**: Content management system for blogs and documentation
- **observability**: Error tracking, logging, and performance monitoring
- **analytics**: User behavior tracking and analytics
- **flags**: Feature flag management
- **cron**: Scheduled job management
- **queue**: Background job processing
- **event-bus**: Event-driven architecture support

## ✨ Key Features

- **Authentication & Authorization**: Complete auth system with role-based access control and policy-based authorization
- **Database Integration**: Type-safe database client with migration support and visual database editor
- **Design System**: Comprehensive UI component library with dark mode support and consistent theming
- **Collaboration**: Real-time collaboration with live cursors and avatar stacks
- **Internationalization**: Multi-language support with type-safe translations
- **Testing**: End-to-end and unit testing setup with Playwright and Vitest
- **Deployment**: Vercel and Netlify deployment configurations with CI/CD pipelines
- **Security**: Built-in security headers, rate limiting, and IP geolocation
- **SEO**: Metadata optimization, JSON-LD, and sitemap generation
- **Performance**: Bundle analysis, caching strategies, and optimized builds

## 💻 Development Workflow

```sh
# Start all applications
pnpm dev

# Start specific application
pnpm dev --filter=app

# Run database migrations
pnpm migrate

# Run tests
pnpm test

# Build all applications
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🔧 Environment Setup

Copy the example environment files and configure your environment variables:

```sh
cp .env.example .env
```

Refer to the [documentation](https://docs.zopio.dev) for detailed information on environment variables and configuration.

## 📦 Package Structure

Zopio follows a modular architecture with well-defined responsibilities:

```
├── apps/                # User-facing applications
├── packages/            # Shared internal packages
│   ├── ai/              # AI integration utilities
│   ├── analytics/       # Analytics integration
│   ├── api-keys/        # API key management
│   ├── auth-policy/     # Authorization policies
│   ├── auth-rbac/       # Role-based access control
│   ├── authentication/  # User authentication
│   ├── caching/         # Data caching strategies
│   ├── cms/             # Content management
│   ├── collaboration/   # Real-time collaboration
│   ├── cron/            # Scheduled jobs
│   ├── database/        # Database client and schema
│   ├── design-system/   # UI components and theming
│   ├── email/           # Email templates and sending
│   ├── event-bus/       # Event publishing/subscribing
│   ├── flags/           # Feature flag management
│   └── ... and more
```

## 🛠️ Customization

Zopio is designed to be customized to your needs. You can:

- Replace the default authentication provider with your own
- Switch to a different database provider (PlanetScale, Supabase, etc.)
- Use a different ORM (Drizzle, Kysely, etc.)
- Customize the design system to match your brand
- Add or remove packages as needed

## 📚 Documentation

For comprehensive documentation, visit [docs.zopio.dev](https://docs.zopio.dev).

## 🤝 Community

Join our community to get help, share your work, and contribute to Zopio:

- [GitHub Discussions](https://github.com/zopiolabs/zopio/discussions)
- [Discord](https://discord.gg/zopiolabs)
- [Twitter](https://twitter.com/zopiolabs)

## 📄 License

Zopio is open-source software licensed under the MIT license.

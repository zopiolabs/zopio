# @repo/project-setup-mcp

This package implements a monorepo-aware **Project Setup MCP** for Zopio. It drives
an interactive interview, generates a concrete setup plan, and applies idempotent
changes to bootstrap a new project inside this repository.

## What it does

- Guides you through a short, structured interview about:
  - Project name and description
  - Target users (internal tool, public SaaS, B2B, etc.)
  - Which apps to use (`apps/app`, `apps/api`, `apps/web`)
  - Architecture (single-tenant vs multi-tenant)
  - Primary domain entity (e.g. workspace, organization, project)
  - Basic auth, database, observability, analytics, storage, and rate limit needs
- Derives a **project profile** and creates a **setup plan** describing:
  - Prisma schema template to use (single-tenant or multi-tenant)
  - Files to create or update across apps and packages
  - Environment variable templates for core infrastructure
  - Example wiring for storage and rate limiting
- Applies the plan in an idempotent way and records a changeset resource.

## CLI usage

From the monorepo root:

```bash
pnpm build        # builds the zopio CLI (optional if already built)
zopio project:setup
```

The command will:

1. Start a new MCP setup session.
2. Ask you a series of questions in the terminal.
3. Show a brief summary of the generated setup plan.
4. Ask for confirmation before applying changes.
5. Apply the plan and print a summary of created/updated files.

## Artifacts and wiring

Depending on your answers, the setup plan will typically touch:

- **Database schema**
  - `packages/database/prisma/schema.prisma` is replaced with a minimal, realistic
    template:
    - Single-tenant: `User` and `Project` models
    - Multi-tenant: `User`, `Organization`, and `Membership` models
- **Environment templates**
  - `packages/database/.env.example` for `DATABASE_URL`
  - `packages/storage/.env.example` for `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
  - `.env.example` files in selected apps (`apps/app`, `apps/api`, `apps/web`),
    ensuring placeholders exist for:
    - Database (Neon/Postgres)
    - Clerk auth keys
    - Observability (BetterStack, Sentry)
    - Analytics (PostHog, GA)
    - Storage (Vercel Blob)
    - Rate limiting (Upstash Redis) where relevant
- **Example routes (if `apps/api` is selected)**
  - `apps/api/app/storage/example-upload/route.ts`:
    - Minimal example of using `@repo/storage` (Vercel Blob) with placeholders.
  - `apps/api/app/rate-limited/ping/route.ts`:
    - Minimal example of using `@repo/rate-limit` with Upstash Redis.

All file operations are designed to be idempotent:

- Schema is overwritten with a well-defined template.
- `.env.example` files are merged, not replaced; existing variables are preserved.
- Example routes are created only if the files do not already exist.

## Automated validation

This package includes a small, non-interactive validation script that exercises
the full flow with canned answers:

```bash
pnpm --filter @repo/project-setup-mcp run build
pnpm --filter @repo/project-setup-mcp run validate
```

The validation script:

- Starts a new setup session with a fixed multi-tenant scenario.
- Generates and applies a setup plan.
- Verifies that:
  - The Prisma schema contains a `User` model and no longer contains the stub
    `Page` model.
  - `packages/storage/.env.example` exists and includes `BLOB_READ_WRITE_TOKEN`.
  - `apps/api/.env.example` includes Upstash rate limit variables.
  - Example storage and rate-limited routes exist and import the expected helpers.


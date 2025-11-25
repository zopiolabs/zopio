# Project Setup MCP

This package provides an MCP server and logic for bootstrapping new Zopio projects within the monorepo.

## Usage

This MCP is integrated into the Zopio CLI. To start a new project setup session:

```bash
pnpm zopio project:setup
```

## Features

The setup process is interactive and covers:

1. **Project Metadata**: Name, description, target audience.
2. **App Selection**: Choosing which apps (`app`, `api`, `web`) to include.
3. **Architecture**: Single-tenant vs Multi-tenant (defines database schema structure).
4. **Service Wiring**:
    * **Database**: Generates a Prisma schema with User/Organization models based on your domain entity name.
    * **Environment**: Generates `.env.example` templates with placeholders for:
        * Auth (Clerk)
        * Database (Neon)
        * Observability (Sentry)
        * Analytics (PostHog)
        * Storage (Vercel Blob)
        * Rate Limiting (Upstash)

## Artifacts

The setup generates:

* `packages/database/prisma/schema.prisma`: A starter schema customized for your domain.
* `apps/*/.env.example`: Environment variable templates for selected apps.

## Architecture

* `src/server.ts`: The MCP Server entry point.
* `src/session-manager.ts`: Handles the interview state machine.
* `src/plan-generator.ts`: Converts the interview profile into a file modification plan.
* `src/plan-executor.ts`: Applies the plan to the filesystem idempotently.

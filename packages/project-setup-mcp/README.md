# Project Setup MCP

An MCP (Model Context Protocol) server for interactive project setup and bootstrapping of new Zopio-based projects in the monorepo.

## Overview

This package provides a conversational, step-by-step interview flow that collects project requirements and generates a complete setup plan for configuring a new Zopio project. It handles:

- **Interactive Interview**: Collects project metadata, app selection, architecture choices, and infrastructure preferences
- **Plan Generation**: Creates a detailed setup plan with all files to be created/modified
- **Idempotent Apply**: Safely applies the plan to the repository with change tracking

## Quick Start

Run the setup command from the monorepo root:

```bash
pnpm zopio project:setup
```

Or use dry-run mode to preview changes without applying them:

```bash
pnpm zopio project:setup --dry-run
```

## Interview Questions

The setup interview collects the following information:

### 1. Project Metadata

- **Project Name**: A unique identifier for your project (e.g., `my-saas-app`)
- **Description**: Optional short description
- **Target Users**: Internal tool, Public SaaS, B2B Portal, or Other

### 2. App Selection

Choose which Zopio apps to include:

- `apps/app` - Main SaaS dashboard application
- `apps/api` - Backend API service
- `apps/web` - Public marketing website
- `apps/docs` - Documentation site

### 3. Architecture

- **Tenancy Model**: Single-tenant or Multi-tenant
- **Primary Entity**: Name of the main business entity (e.g., "organization", "workspace", "team")

### 4. Cross-Cutting Concerns

- **Authentication**: Enable Clerk auth integration
- **Role-Based Access**: Add user roles within organizations
- **Observability**: Set up Sentry/Logtail error tracking
- **Analytics**: PostHog, Google Analytics, Vercel Analytics
- **Storage**: Vercel Blob file storage
- **Rate Limiting**: Upstash Redis rate limiting

## Generated Artifacts

Based on your answers, the setup generates:

### Database Schema

- `packages/database/prisma/schema.prisma` - Updated with User, Organization/Entity, and Membership models

### Environment Templates

- `apps/app/.env.example` - Environment variables for the main app
- `apps/api/.env.example` - Environment variables for the API
- `apps/web/.env.example` - Environment variables for the web app
- `packages/database/.env.example` - Database connection string

### Wiring Code (based on selections)

- `apps/api/lib/rate-limit.ts` - Rate limiting middleware
- `apps/app/lib/storage.ts` - File storage utilities
- `apps/app/components/providers/analytics-provider.tsx` - Analytics provider

### Documentation

- `PROJECT_SETUP.md` - Summary of the setup configuration

## Programmatic Usage

You can also use the MCP server programmatically:

```typescript
import { createProjectSetupServer } from '@repo/project-setup-mcp';

const server = createProjectSetupServer();

// Start a session
const { session, firstQuestion } = server.startSession();

// Submit answers
let question = firstQuestion;
while (question) {
  const result = server.submitAnswer(session.id, {
    questionId: question.id,
    value: yourAnswer,
  });
  question = result.nextQuestion;
}

// Generate plan
const planResult = server.generatePlan(session.id);
console.log(planResult.summary);

// Apply plan
const applyResult = server.applyPlan(session.id, {
  rootDir: process.cwd(),
  dryRun: false,
});
console.log(applyResult.summary);
```

### Running with Predefined Answers

For automation or testing:

```typescript
const result = server.runWithAnswers({
  project_name: 'my-project',
  target_users: 'public_saas',
  selected_apps: ['app', 'api'],
  tenancy_model: 'multi_tenant',
  primary_entity: 'organization',
  auth_enabled: true,
  auth_roles: false,
  observability_enabled: true,
  analytics_providers: ['posthog'],
  storage_enabled: false,
  rate_limit_enabled: true,
}, {
  rootDir: process.cwd(),
  dryRun: false,
});
```

## MCP Resources

The package exposes the following MCP resource types:

### Setup Session

Tracks the state of a setup run:

- `id`: Unique session identifier
- `status`: pending | in_progress | interview_complete | plan_generated | applying | completed | failed
- `currentStep`: Current interview step index
- `totalSteps`: Total number of interview steps

### Project Profile

Structured summary of collected project information:

- `metadata`: Project name, description, target users
- `selectedApps`: Which apps are enabled
- `architecture`: Tenancy model and primary entity
- `crossCuttingConcerns`: Auth, observability, analytics, storage, rate limiting config

### Setup Plan

Description of planned repository changes:

- `changes`: Array of planned file operations
- `summary`: Counts by category and change type

### Applied Changeset

Record of what changed when the plan was applied:

- `changes`: Array of applied changes with results
- `summary`: Success/skip/fail counts
- `notes` and `warnings`: Important messages

## Testing

Run the test suite:

```bash
pnpm test
```

The tests cover:

- Session management
- Interview flow and validation
- Plan generation
- Idempotent plan application
- Profile building

### Validation Scripts

Run end-to-end validation with predefined answers:

```bash
# Dry run - preview what would happen
pnpm validate:dry

# Full validation - creates and verifies files in a temp directory
pnpm validate
```

The validation script:

1. Creates a temporary test directory
2. Runs a complete setup flow with representative answers
3. Verifies all expected files are created
4. Checks schema content for expected models
5. Cleans up the test directory

## Architecture

```text
packages/project-setup-mcp/
├── src/
│   ├── schemas/          # Zod schemas for MCP resources
│   │   ├── session.ts    # Setup session schema
│   │   ├── profile.ts    # Project profile schema
│   │   ├── plan.ts       # Setup plan schema
│   │   └── changeset.ts  # Applied changeset schema
│   ├── interview/        # Interview logic
│   │   ├── types.ts      # Question types
│   │   ├── questions.ts  # Interview question definitions
│   │   └── state-machine.ts # Interview state machine
│   ├── templates/        # Code generation templates
│   │   ├── prisma-schema.ts
│   │   ├── env-templates.ts
│   │   └── wiring-templates.ts
│   ├── generator/        # Plan generation
│   │   └── plan-generator.ts
│   ├── applicator/       # Plan application
│   │   └── plan-applicator.ts
│   ├── server/           # MCP server
│   │   └── setup-mcp-server.ts
│   └── index.ts          # Public exports
└── README.md
```

## Next Steps After Setup

1. **Configure Environment Variables**: Fill in the actual values in each app's `.env.local` file
2. **Run Database Migration**: `pnpm migrate` to apply the Prisma schema
3. **Review Generated Code**: Customize the wiring code for your specific needs
4. **Start Development**: `pnpm dev` to start all apps

## License

MIT

/**
 * SPDX-License-Identifier: MIT
 */

import type { ProjectProfile, SetupPlan } from './types.js';

export class PlanGenerator {
  generate(profile: ProjectProfile): SetupPlan {
    const plan: SetupPlan = {
      id: crypto.randomUUID(),
      targetFiles: [],
      prismaSchema: this.generatePrismaSchema(profile),
      envTemplates: {},
      serviceWiring: [],
    };

    // Env templates
    if (profile.apps.includes('app')) {
      plan.envTemplates['apps/app/.env.example'] = this.generateEnvTemplate(
        profile,
        'app'
      );
      plan.targetFiles.push('apps/app/.env.example');
    }
    if (profile.apps.includes('api')) {
      plan.envTemplates['apps/api/.env.example'] = this.generateEnvTemplate(
        profile,
        'api'
      );
      plan.targetFiles.push('apps/api/.env.example');
    }
    if (profile.apps.includes('web')) {
      plan.envTemplates['apps/web/.env.example'] = this.generateEnvTemplate(
        profile,
        'web'
      );
      plan.targetFiles.push('apps/web/.env.example');
    }

    // Add prisma schema to target files
    plan.targetFiles.push('packages/database/prisma/schema.prisma');

    // Wiring info
    if (profile.features.auth) {
      plan.serviceWiring.push({
        service: 'auth',
        status: 'stubbed',
        notes: 'Clerk auth keys added to env templates',
      });
    }
    if (profile.features.database) {
      plan.serviceWiring.push({
        service: 'database',
        status: 'stubbed',
        notes: 'Prisma schema generated with user/org models',
      });
    }
    if (profile.features.observability) {
      plan.serviceWiring.push({
        service: 'observability',
        status: 'stubbed',
        notes: 'Sentry keys added to env templates',
      });
    }
    if (profile.features.analytics) {
      plan.serviceWiring.push({
        service: 'analytics',
        status: 'stubbed',
        notes: 'PostHog keys added to env templates',
      });
    }
    if (profile.features.storage) {
      plan.serviceWiring.push({
        service: 'storage',
        status: 'stubbed',
        notes: 'Vercel Blob keys added to env templates',
      });
    }
    if (profile.features.rateLimit) {
      plan.serviceWiring.push({
        service: 'rateLimit',
        status: 'stubbed',
        notes: 'Upstash Redis keys added to env templates',
      });
    }

    return plan;
  }

  private generatePrismaSchema(profile: ProjectProfile): string {
    const entity = profile.architecture.domainEntity;
    // Capitalize first letter
    const entityModel =
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();

    let schema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
  output          = "../generated/client"
}

datasource db {
  provider     = "postgresql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
`;

    if (profile.architecture.type === 'multi_tenant') {
      schema += `
  memberships Membership[]
}

model ${entityModel} {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships Membership[]
}

model Membership {
  id             String   @id @default(cuid())
  role           String   @default("MEMBER")
  userId         String

  // Foreign key to ${entityModel}
  ${entityModel.toLowerCase()}Id String

  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  ${entityModel.toLowerCase()} ${entityModel} @relation(fields: [${entityModel.toLowerCase()}Id], references: [id], onDelete: Cascade)

  @@unique([userId, ${entityModel.toLowerCase()}Id])
  @@index([userId])
  @@index([${entityModel.toLowerCase()}Id])
}
`;
    } else {
      // Single tenant - maybe user owns data directly, or just one global tenant context.
      // For simplicity, we'll just end User model.
      schema += `
}
`;
    }
    return schema;
  }

  private generateEnvTemplate(
    profile: ProjectProfile,
    appName: string
  ): string {
    let env = `# ${profile.name} - ${appName} Environment Variables\n\n`;

    if (profile.features.database) {
      env += '# Database\nDATABASE_URL="postgresql://neondb_owner:...\n\n';
    }
    if (profile.features.auth) {
      env +=
        '# Auth (Clerk)\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...\nCLERK_SECRET_KEY=sk_test_...\n\n';
    }
    if (profile.features.observability) {
      env +=
        '# Observability (Sentry)\nNEXT_PUBLIC_SENTRY_DSN=https://...\nSENTRY_AUTH_TOKEN=...\n\n';
    }
    if (profile.features.analytics) {
      env +=
        '# Analytics (PostHog)\nNEXT_PUBLIC_POSTHOG_KEY=phc_...\nNEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com\n\n';
    }
    if (profile.features.rateLimit) {
      env +=
        '# Rate Limiting (Upstash)\nUPSTASH_REDIS_REST_URL=...\nUPSTASH_REDIS_REST_TOKEN=...\n\n';
    }
    if (profile.features.storage) {
      env += '# Storage (Vercel Blob)\nBLOB_READ_WRITE_TOKEN=...\n\n';
    }

    return env;
  }
}

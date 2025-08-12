# syntax=docker/dockerfile:1

# ========================================
# Base stage - Setup Node with pnpm
# ========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate
WORKDIR /app

# ========================================
# Development stage - For local development
# ========================================
FROM base AS development
ENV NODE_ENV=development

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY turbo.json ./

# Install all dependencies for development
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Generate Prisma client
RUN cd packages/database && npx prisma generate --no-hints --schema=./prisma/schema.prisma

EXPOSE 3002
CMD ["pnpm", "--filter=api", "dev"]

# ========================================
# Pruner stage - Prepare pruned monorepo
# ========================================
FROM base AS pruner
RUN apk add --no-cache libc6-compat
COPY . .
RUN pnpm dlx turbo prune api --docker

# ========================================
# Builder stage - Build the application
# ========================================
FROM base AS builder

# Add build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Generate Prisma client with linux-musl binary target
RUN cd packages/database && npx prisma generate --no-hints --schema=./prisma/schema.prisma

# Build arguments for optional remote caching
ARG TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TEAM=${TURBO_TEAM}
ENV TURBO_TOKEN=${TURBO_TOKEN}

# Build the application
RUN pnpm turbo build --filter=api

# ========================================
# Runner stage - Production runtime
# ========================================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/api/public ./apps/api/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/api/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/api/.next/static ./apps/api/.next/static

# Copy Prisma client
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/generated ./packages/database/generated
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma ./packages/database/prisma

# Switch to non-root user
USER nextjs

EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "server.js"]
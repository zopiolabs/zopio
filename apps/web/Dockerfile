# syntax=docker/dockerfile:1

# ========================================
# Base stage - Setup Node with pnpm
# ========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
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
RUN pnpm --filter=@repo/database exec prisma generate

EXPOSE 3001
CMD ["pnpm", "--filter=web", "dev"]

# ========================================
# Pruner stage - Prepare pruned monorepo
# ========================================
FROM base AS pruner
RUN apk add --no-cache libc6-compat
COPY . .
RUN pnpm dlx turbo prune web --docker

# ========================================
# Builder stage - Build the application
# ========================================
FROM base AS builder

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Generate Prisma client with linux-musl binary target
RUN pnpm --filter=@repo/database exec prisma generate

# Build arguments for optional remote caching
ARG TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TEAM=${TURBO_TEAM}
ENV TURBO_TOKEN=${TURBO_TOKEN}

# Build the application
RUN pnpm turbo build --filter=web

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
ENV PORT=3001

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copy Prisma client
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/generated ./packages/database/generated
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma ./packages/database/prisma

# Switch to non-root user
USER nextjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "server.js"]
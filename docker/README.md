# Docker Setup for Zopio Monorepo

This directory contains Docker configurations for running the Zopio monorepo in both development and production environments.

## Prerequisites

- Docker Desktop 4.20+ (includes Docker Compose v2)
- 8GB+ RAM allocated to Docker
- 20GB+ free disk space

## Quick Start

### Development Environment

1. Copy the environment template:
```bash
cp docker/dev.env.example docker/dev.env
```

2. Edit `docker/dev.env` with your configuration

3. Start all services:
```bash
cd docker
docker compose -f docker-compose.dev.yml up
```

4. Access the applications:
- App: http://localhost:3000
- Web: http://localhost:3001
- API: http://localhost:3002
- Zopio Splash: http://localhost:7007
- Database: localhost:5432

5. Run database migrations (first time only):
```bash
docker compose -f docker-compose.dev.yml run --rm migrate
```

### Production Environment

1. Copy and configure environment:
```bash
cp docker/prod.env.example docker/prod.env
# Edit prod.env with production values
```

2. Build and start services:
```bash
cd docker
docker compose -f docker-compose.prod.yml up -d
```

3. Run database migrations:
```bash
docker compose -f docker-compose.prod.yml run --rm migrate
```

## Service Architecture

```
┌─────────────────────────────────────────────────┐
│                   nginx/Traefik                  │
│                  (reverse proxy)                 │
└─────────────┬───────────┬───────────┬───────────┘
              │           │           │
    ┌─────────▼──┐ ┌─────▼────┐ ┌───▼──────┐
    │    web     │ │   app    │ │   api    │
    │  (Next.js) │ │(Next.js) │ │(Next.js) │
    │   :3001    │ │  :3000   │ │  :3002   │
    └─────────┬──┘ └─────┬────┘ └───┬──────┘
              │           │           │
              └───────────┼───────────┘
                          │
                    ┌─────▼─────┐
                    │ PostgreSQL│
                    │   :5432    │
                    └────────────┘
```

## Development Features

- **Hot Reload**: All Next.js apps support hot module replacement
- **Volume Mounts**: Source code is mounted for live editing
- **Shared pnpm Store**: Faster installs with cached dependencies
- **Database Persistence**: PostgreSQL data persists between restarts
- **Health Checks**: Automatic service dependency management

### Using Docker Compose Profiles

Optional services are organized with profiles for selective startup:

```bash
# Start core services only (db, web, app, api)
docker compose -f docker-compose.dev.yml up

# Include marketing website
docker compose -f docker-compose.dev.yml --profile marketing up

# Include documentation server
docker compose -f docker-compose.dev.yml --profile docs up

# Include Prisma Studio
docker compose -f docker-compose.dev.yml --profile dbstudio up

# Include Storybook
docker compose -f docker-compose.dev.yml --profile storybook up

# Include email testing with Mailpit
docker compose -f docker-compose.dev.yml --profile mailpit up

# Include Redis cache
docker compose -f docker-compose.dev.yml --profile redis up

# Include Stripe CLI for webhook forwarding
docker compose -f docker-compose.dev.yml --profile stripe-cli up

# Combine multiple profiles
docker compose -f docker-compose.dev.yml --profile marketing --profile docs up

# Run database migrations (one-time operation)
docker compose -f docker-compose.dev.yml run --rm migrate
```

Available profiles:
- `migrate`: Database migration service
- `marketing`: Zopio splash marketing website
- `docs`: Mintlify documentation server
- `dbstudio`: Prisma Studio database GUI
- `storybook`: Component development environment
- `mailpit`: Email testing server
- `redis`: Redis cache service
- `stripe-cli`: Stripe webhook forwarding

## Production Features

- **Multi-stage Builds**: Optimized image sizes using Next.js standalone mode
- **Non-root Users**: Enhanced security with dedicated app users
- **Resource Limits**: CPU and memory constraints for stability
- **Health Checks**: Automated health monitoring and restarts
- **Network Isolation**: Services communicate through internal network

## Common Commands

### Development

```bash
# Start all services
docker compose -f docker-compose.dev.yml up

# Start specific service
docker compose -f docker-compose.dev.yml up app

# Rebuild after dependency changes
docker compose -f docker-compose.dev.yml build --no-cache

# View logs
docker compose -f docker-compose.dev.yml logs -f app

# Execute commands in container
docker compose -f docker-compose.dev.yml exec app pnpm test

# Stop all services
docker compose -f docker-compose.dev.yml down

# Clean everything (including volumes)
docker compose -f docker-compose.dev.yml down -v
```

### Production

```bash
# Build images
docker compose -f docker-compose.prod.yml build

# Start services (detached)
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Scale services
docker compose -f docker-compose.prod.yml up -d --scale api=3

# Update single service
docker compose -f docker-compose.prod.yml up -d --no-deps app

# Backup database
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres zopio > backup.sql
```

## Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to `development` or `production`

### Optional Variables

See `dev.env.example` and `prod.env.example` for all available options.

## Troubleshooting

### macOS File Watching Issues

If hot reload isn't working on macOS, the compose files already include:
- `CHOKIDAR_USEPOLLING=1`
- `WATCHPACK_POLLING=true`

### Port Conflicts

If ports are already in use, either:
1. Stop conflicting services
2. Or modify port mappings in docker-compose files

### Database Connection Issues

1. Ensure database is healthy:
```bash
docker compose -f docker-compose.dev.yml ps db
```

2. Check database logs:
```bash
docker compose -f docker-compose.dev.yml logs db
```

3. Reset database (warning: data loss):
```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up db
```

### Build Cache Issues

Clear Docker build cache:
```bash
docker builder prune -af
```

### Memory Issues

Increase Docker Desktop memory allocation:
1. Open Docker Desktop settings
2. Go to Resources → Advanced
3. Increase Memory to 8GB+
4. Apply & Restart

## CI/CD Integration

For CI/CD pipelines, use build arguments:

```bash
docker build \
  --build-arg TURBO_TEAM=your-team \
  --build-arg TURBO_TOKEN=your-token \
  --target production \
  -f apps/app/Dockerfile \
  -t your-registry/app:latest \
  .
```

## Multi-Architecture Builds

Build for multiple platforms:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f apps/app/Dockerfile \
  -t your-registry/app:latest \
  --push \
  .
```

## Security Notes

1. **Never commit** `.env` files with real credentials
2. Use **strong passwords** for production databases
3. Enable **TLS/SSL** for production deployments
4. Regularly **update base images** for security patches
5. Use **secrets management** for sensitive data
6. Implement **network policies** in Kubernetes deployments

## Performance Optimization

1. **BuildKit**: Enabled by default in Docker Desktop 4.0+
2. **Layer Caching**: Optimized Dockerfile order for better caching
3. **pnpm Store**: Shared across builds for faster installs
4. **Turbo Cache**: Optional remote caching with Turborepo
5. **Standalone Mode**: Next.js standalone reduces image size by 70%

## Support

For issues specific to Docker setup, check:
1. This README
2. Docker logs: `docker compose logs`
3. Application logs in containers
4. GitHub issues for the project
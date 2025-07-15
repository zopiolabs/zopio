# @repo/database

## Overview

The `@repo/database` package provides a streamlined database integration for Zopio applications using Prisma ORM with Neon PostgreSQL. It offers a type-safe, server-side database client with connection pooling, optimized for both development and production environments.

## Module Categories

### Core Components

- **Database Client**: Type-safe Prisma client with Neon adapter
- **Connection Management**: Optimized connection pooling for serverless environments
- **Environment Configuration**: Type-safe environment variable handling

### Database Features

- **PostgreSQL Integration**: Full support for Neon's serverless PostgreSQL
- **Type Generation**: Automatic TypeScript type generation from Prisma schema
- **Schema Management**: Prisma schema definition and migration tools

## Usage Guidelines

### Basic Setup

1. Add your database connection string to your environment variables:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

2. Import and use the database client in your application:

```tsx
import { database } from '@repo/database';

// In your server component or API route
export async function getData() {
  const pages = await database.page.findMany();
  return pages;
}
```

### Querying Data

```tsx
import { database } from '@repo/database';

// Find a single record
const page = await database.page.findUnique({
  where: { id: 1 },
});

// Find multiple records with filtering
const pages = await database.page.findMany({
  where: {
    name: {
      contains: 'Home',
    },
  },
  orderBy: {
    name: 'asc',
  },
});

// Create a new record
const newPage = await database.page.create({
  data: {
    name: 'New Page',
  },
});

// Update a record
const updatedPage = await database.page.update({
  where: { id: 1 },
  data: {
    name: 'Updated Page Name',
  },
});

// Delete a record
const deletedPage = await database.page.delete({
  where: { id: 1 },
});
```

### Using Transactions

```tsx
import { database } from '@repo/database';

// Perform multiple operations in a transaction
const result = await database.$transaction(async (tx) => {
  // Create a new page
  const page = await tx.page.create({
    data: {
      name: 'Transaction Page',
    },
  });
  
  // Update another page
  const updatedPage = await tx.page.update({
    where: { id: 1 },
    data: {
      name: 'Updated in Transaction',
    },
  });
  
  return { page, updatedPage };
});
```

### Using Raw SQL Queries

```tsx
import { database, Prisma } from '@repo/database';

// Execute a raw SQL query
const result = await database.$queryRaw`
  SELECT * FROM "Page" WHERE "name" LIKE ${`%${searchTerm}%`}
`;
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/database
```

## Environment Variables

| Variable | Description | Format |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:port/database` |

## Development Guidelines

### Extending the Schema

To add new models to your database schema:

1. Edit the `prisma/schema.prisma` file:

```prisma
// Example: Adding a User model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Example: Adding a Post model with relations
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

2. Generate the Prisma client:

```bash
pnpm run -F @repo/database build
```

3. Use the new models in your application:

```tsx
import { database } from '@repo/database';

// Create a user with posts
const user = await database.user.create({
  data: {
    email: 'user@example.com',
    name: 'Example User',
    posts: {
      create: [
        {
          title: 'First Post',
          content: 'This is my first post',
        },
      ],
    },
  },
  include: {
    posts: true,
  },
});
```

### Managing Database Migrations

To create and apply database migrations:

1. Make changes to your Prisma schema
2. Create a migration:

```bash
cd packages/database
npx prisma migrate dev --name add_user_model
```

3. Apply the migration to your database:

```bash
npx prisma migrate deploy
```

### Working with Neon Database

This package is configured to work with Neon's serverless PostgreSQL. Some best practices:

1. Use connection pooling for optimal performance
2. Keep transactions short to avoid connection timeouts
3. Consider using edge-compatible queries for global deployments
4. Monitor query performance in the Neon dashboard

## Integration Examples

### With Next.js App Router

```tsx
// app/pages/route.ts
import { database } from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pages = await database.page.findMany();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
```

### With TanStack Query

```tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch pages
function usePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const response = await fetch('/api/pages');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}

// Create a new page
function useCreatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create page');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}
```

### With Server Actions

```tsx
'use server';

import { database } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function createPage(formData: FormData) {
  const name = formData.get('name') as string;
  
  if (!name) {
    return { error: 'Name is required' };
  }
  
  try {
    await database.page.create({
      data: { name },
    });
    
    revalidatePath('/pages');
    return { success: true };
  } catch (error) {
    console.error('Failed to create page:', error);
    return { error: 'Failed to create page' };
  }
}
```

## Database Schema Visualization

You can visualize your database schema using Prisma Studio:

```bash
cd packages/database
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can browse and edit your database.

## Documentation References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new database models and queries
5. Follow the project's naming conventions
6. Update the Prisma schema documentation when adding new models

## License

MIT

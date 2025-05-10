import { PrismaClient } from './generated/client';

// Define a global variable for Prisma to enable connection reuse
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a Prisma client instance or reuse the existing one
export const database =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// In non-production environments, save the client instance to the global object
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

// Export all types from the generated client
export * from './generated/client';


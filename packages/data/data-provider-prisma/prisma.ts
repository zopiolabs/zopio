import { PrismaClient } from "@prisma/client";
import type { DataProvider, DataParams } from "@repo/data-core";

const prisma = new PrismaClient();

/**
 * Creates a Prisma-based data provider
 * This is a basic implementation that works with standard Prisma models
 */
export function createPrismaDataProvider(): DataProvider {
  return {
    async getOne({ resource, id }: DataParams) {
      const result = await prisma[resource].findUnique({
        where: { id: Number(id) },
      });
      return result;
    },
    
    async getList({ resource, query }: DataParams) {
      // Basic filtering support
      if (query && Object.keys(query).length > 0) {
        const results = await prisma[resource].findMany({
          where: query,
        });
        return results;
      }
      
      const results = await prisma[resource].findMany();
      return results;
    },
    
    async create({ resource, variables }: DataParams) {
      const result = await prisma[resource].create({
        data: variables || {},
      });
      return result;
    },
    
    async update({ resource, id, variables }: DataParams) {
      const result = await prisma[resource].update({
        where: { id: Number(id) },
        data: variables || {},
      });
      return result;
    },
    
    async delete({ resource, id }: DataParams) {
      const result = await prisma[resource].delete({
        where: { id: Number(id) },
      });
      return result;
    },
  };
}

// Default instance with standard configuration
export const dataProvider = createPrismaDataProvider();

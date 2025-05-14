import { PrismaClient } from "@prisma/client";
import type { DataProvider, DataParams } from "@repo/data-core";

const prisma = new PrismaClient();

/**
 * Resource-specific handlers for advanced Prisma data operations
 */
type ResourceHandlers = {
  [resource: string]: {
    getOne?: (id: number | string, params: DataParams) => Promise<unknown>;
    getList?: (params: DataParams) => Promise<unknown[]>;
    create?: (data: Record<string, unknown>, params: DataParams) => Promise<unknown>;
    update?: (id: number | string, data: Record<string, unknown>, params: DataParams) => Promise<unknown>;
    delete?: (id: number | string, params: DataParams) => Promise<unknown>;
  };
};

/**
 * Creates an advanced Prisma-based data provider with resource-specific handlers
 * This allows for customized behavior per resource type
 */
export function createAdvancedPrismaDataProvider(
  resourceHandlers: ResourceHandlers = {}
): DataProvider {
  return {
    async getOne({ resource, id, ...params }: DataParams) {
      // Use resource-specific handler if available
      if (resourceHandlers[resource]?.getOne && id) {
        return resourceHandlers[resource].getOne(id, { resource, id, ...params });
      }
      
      // Default resource-specific behavior
      if (resource === "users" && id) {
        const result = await prisma.user.findUnique({
          where: { id: Number(id) },
          select: { id: true, email: true }, // hide sensitive fields
        });
        return result;
      }
      
      // Default behavior
      const result = await prisma[resource].findUnique({
        where: { id: Number(id) },
      });
      return result;
    },
    
    async getList({ resource, query, ...params }: DataParams) {
      // Use resource-specific handler if available
      if (resourceHandlers[resource]?.getList) {
        return resourceHandlers[resource].getList({ resource, query, ...params });
      }
      
      // Default resource-specific behavior
      if (resource === "products") {
        const results = await prisma.product.findMany({
          where: { active: true, ...query }, // filter for active only + any query params
        });
        return results;
      }
      
      // Apply query filters if provided
      if (query && Object.keys(query).length > 0) {
        const results = await prisma[resource].findMany({
          where: query,
        });
        return results;
      }
      
      // Default behavior
      const results = await prisma[resource].findMany();
      return results;
    },
    
    async create({ resource, variables, ...params }: DataParams) {
      // Use resource-specific handler if available
      if (resourceHandlers[resource]?.create && variables) {
        return resourceHandlers[resource].create(variables, { resource, variables, ...params });
      }
      
      // Default resource-specific behavior
      if (resource === "orders") {
        console.log("Creating order log...");
        // Add audit trail or validation
        await prisma.auditLog.create({
          data: {
            action: 'create',
            resource,
            details: JSON.stringify(variables)
          }
        }).catch((error: Error) => console.error('Audit log error:', error));
      }
      
      // Default behavior
      const result = await prisma[resource].create({
        data: variables || {},
      });
      return result;
    },
    
    async update({ resource, id, variables, ...params }: DataParams) {
      // Use resource-specific handler if available
      if (resourceHandlers[resource]?.update && id && variables) {
        return resourceHandlers[resource].update(id, variables, { resource, id, variables, ...params });
      }
      
      // Default resource-specific behavior
      if (resource === "users" && id) {
        console.log("Updating user with audit logging...");
        // Add audit trail
        await prisma.auditLog.create({
          data: {
            action: 'update',
            resource,
            resourceId: String(id),
            details: JSON.stringify(variables)
          }
        }).catch((error: Error) => console.error('Audit log error:', error));
      }
      
      // Default behavior
      const result = await prisma[resource].update({
        where: { id: Number(id) },
        data: variables || {},
      });
      return result;
    },
    
    async delete({ resource, id, ...params }: DataParams) {
      // Use resource-specific handler if available
      if (resourceHandlers[resource]?.delete && id) {
        return resourceHandlers[resource].delete(id, { resource, id, ...params });
      }
      
      // Default resource-specific behavior
      if (resource === "orders" && id) {
        console.log("Soft delete orders...");
        // Implement soft delete instead of hard delete
        const result = await prisma[resource].update({
          where: { id: Number(id) },
          data: { deleted: true, deletedAt: new Date() },
        });
        return result;
      }
      
      // Default behavior
      const result = await prisma[resource].delete({
        where: { id: Number(id) },
      });
      return result;
    },
  };
}

// Default instance with standard configuration
export const dataProvider = createAdvancedPrismaDataProvider();

// Example of creating a provider with custom resource handlers
export function createCustomDataProvider() {
  // Example of creating a provider with custom resource handlers
  return createAdvancedPrismaDataProvider({
    users: {
      getList: async () => {
        const results = await prisma.user.findMany({
          where: { active: true },
          select: { id: true, name: true, email: true }
        });
        return results;
      }
    }
  });
}

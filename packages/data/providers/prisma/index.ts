/**
 * Prisma provider implementation
 */

import type { 
  CrudProvider, 
  GetListParams, 
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult
} from '@repo/data-base';

export interface PrismaProviderConfig {
  client: any; // Prisma client instance
  modelMapping?: Record<string, string>; // Maps resource names to Prisma models
}

/**
 * Create a Prisma provider
 */
export function createPrismaProvider(config: PrismaProviderConfig): CrudProvider {
  const { 
    client,
    modelMapping = {}
  } = config;

  // Helper to get Prisma model from resource name
  const getPrismaModel = (resource: string): string => {
    return modelMapping[resource] || resource;
  };

  // Helper to get Prisma model client
  const getModelClient = (resource: string): any => {
    const model = getPrismaModel(resource);
    const modelClient = (client as any)[model];
    
    if (!modelClient) {
      throw new Error(`Prisma model not found: ${model}`);
    }
    
    return modelClient;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const modelClient = getModelClient(resource);
        
        // Build where clause from filter
        const where = filter || {};
        
        // Build orderBy from sort
        const buildOrderBy = (sort: any): Record<string, string> => {
          const orderBy: Record<string, string> = {};
          if (sort) {
            orderBy[sort.field] = sort.order;
          }
          return orderBy;
        };
        
        const orderBy = buildOrderBy(sort);
        
        // Build pagination
        const buildPagination = (pagination: any): { skip: number | undefined; take: number | undefined } => {
          const skip = pagination ? (pagination.page - 1) * pagination.perPage : undefined;
          const take = pagination ? pagination.perPage : undefined;
          return { skip, take };
        };
        
        const { skip, take } = buildPagination(pagination);
        
        // Get total count
        const total = await modelClient.count({
          where
        });
        
        // Get data
        const data = await modelClient.findMany({
          where,
          orderBy,
          skip,
          take
        });
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const modelClient = getModelClient(resource);
        
        // Get data
        const data = await modelClient.findUnique({
          where: { id }
        });
        
        if (!data) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const modelClient = getModelClient(resource);
        
        // Create data
        const data = await modelClient.create({
          data: variables
        });
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const modelClient = getModelClient(resource);
        
        // Update data
        const data = await modelClient.update({
          where: { id },
          data: variables
        });
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const modelClient = getModelClient(resource);
        
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Delete data
        await modelClient.delete({
          where: { id }
        });
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

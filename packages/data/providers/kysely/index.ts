/**
 * Kysely provider implementation
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

// Define interfaces for Kysely types without direct import
// Type used for table structure

interface KyselyInstance {
  selectFrom: (table: string) => KyselySelectBuilder;
  insertInto: (table: string) => KyselyInsertBuilder;
  updateTable: (table: string) => KyselyUpdateBuilder;
  deleteFrom: (table: string) => KyselyDeleteBuilder;
}

interface KyselySelectBuilder {
  selectAll: () => KyselySelectBuilder;
  select: (selector: (eb: KyselyExpressionBuilder) => KyselyCountExpression | string) => KyselySelectBuilder;
  where: (field: string, operator: string, value: unknown) => KyselySelectBuilder;
  orderBy: (field: string, direction?: 'asc' | 'desc') => KyselySelectBuilder;
  limit: (limit: number) => KyselySelectBuilder;
  offset: (offset: number) => KyselySelectBuilder;
  execute: () => Promise<Record<string, unknown>[]>;
}

interface KyselyInsertBuilder {
  values: (values: Record<string, unknown>) => KyselyInsertBuilder;
  returning: (columns: string | string[]) => KyselyInsertBuilder;
  returningAll: () => KyselyInsertBuilder;
  execute: () => Promise<Record<string, unknown>[]>;
}

interface KyselyUpdateBuilder {
  set: (values: Record<string, unknown>) => KyselyUpdateBuilder;
  where: (field: string, operator: string, value: unknown) => KyselyUpdateBuilder;
  returning: (columns: string | string[]) => KyselyUpdateBuilder;
  returningAll: () => KyselyUpdateBuilder;
  execute: () => Promise<Record<string, unknown>[]>;
}

interface KyselyDeleteBuilder {
  where: (field: string, operator: string, value: unknown) => KyselyDeleteBuilder;
  returning: (columns: string | string[]) => KyselyDeleteBuilder;
  returningAll: () => KyselyDeleteBuilder;
  execute: () => Promise<Record<string, unknown>[]>;
}

interface KyselyExpressionBuilder {
  fn: {
    count: (column: string) => KyselyCountExpression;
  };
}

interface KyselyCountExpression {
  as: (alias: string) => KyselyCountExpression;
}

export interface KyselyProviderConfig {
  db: KyselyInstance; // Kysely database instance
  schema?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a Kysely provider
 */
export function createKyselyProvider(config: KyselyProviderConfig): CrudProvider {
  const { 
    db,
    schema = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return schema[resource] || resource;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const tableName = getTableName(resource);
        
        // Build query
        let query = db.selectFrom(tableName).selectAll();
        
        // Apply filters
        if (filter) {
          for (const [field, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              query = query.where(field, '=', value);
            }
          }
        }
        
        // Get total count
        const countQuery = db.selectFrom(tableName)
          .select((eb: KyselyExpressionBuilder) => eb.fn.count('id').as('count'));
          
        // Apply filters to count query as well
        if (filter) {
          for (const [field, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              countQuery.where(field, '=', value);
            }
          }
        }
        
        const [{ count }] = await countQuery.execute();
        const total = Number(count);
        
        // Apply sorting
        if (sort) {
          query = query.orderBy(sort.field, sort.order === 'asc' ? 'asc' : 'desc');
        }
        
        // Apply pagination
        if (pagination) {
          const { page, perPage } = pagination;
          const offset = (page - 1) * perPage;
          query = query.limit(perPage).offset(offset);
        }
        
        // Execute query
        const data = await query.execute();
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const tableName = getTableName(resource);
        
        // Build query
        const query = db.selectFrom(tableName)
          .selectAll()
          .where('id', '=', id)
          .limit(1);
        
        // Execute query
        const [data] = await query.execute();
        
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
        const tableName = getTableName(resource);
        
        // Build query
        const query = db.insertInto(tableName)
          .values(variables as Record<string, unknown>)
          .returningAll();
        
        // Execute query
        const [data] = await query.execute();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const tableName = getTableName(resource);
        
        // Build query
        const query = db.updateTable(tableName)
          .set(variables)
          .where('id', '=', id)
          .returningAll();
        
        // Execute query
        const [data] = await query.execute();
        
        if (!data) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const tableName = getTableName(resource);
        
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Build query
        const query = db.deleteFrom(tableName)
          .where('id', '=', id)
          .returningAll();
        
        // Execute query
        await query.execute();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

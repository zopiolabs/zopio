/**
 * Drizzle provider implementation
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

// Import Drizzle operators
import type { SQL } from 'drizzle-orm';

// Define a minimal DrizzleDB interface with just the methods we need
interface DrizzleDB {
  select: <T = unknown>(...args: unknown[]) => DrizzleQueryBuilder<T>;
  insert: (table: unknown) => DrizzleInsertBuilder;
  update: (table: unknown) => DrizzleUpdateBuilder;
  delete: (table: unknown) => DrizzleDeleteBuilder;
}

interface DrizzleQueryBuilder<T> {
  from: (table: unknown) => DrizzleQueryBuilder<T>;
  where: (condition: unknown) => DrizzleQueryBuilder<T>;
  orderBy: (order: unknown) => DrizzleQueryBuilder<T>;
  limit: (limit: number) => DrizzleQueryBuilder<T>;
  offset: (offset: number) => DrizzleQueryBuilder<T>;
  then: <U>(onfulfilled?: (value: T[]) => U | PromiseLike<U>) => Promise<U>;
}

interface DrizzleInsertBuilder {
  values: (values: unknown) => DrizzleInsertBuilder;
  returning: () => Promise<unknown[]>;
}

interface DrizzleUpdateBuilder {
  set: (values: unknown) => DrizzleUpdateBuilder;
  where: (condition: unknown) => DrizzleUpdateBuilder;
  returning: () => Promise<unknown[]>;
}

interface DrizzleDeleteBuilder {
  where: (condition: unknown) => DrizzleDeleteBuilder;
  returning: () => Promise<unknown[]>;
}

export interface DrizzleClientConfig {
  db: DrizzleDB; // Drizzle DB instance
  schema: Record<string, Record<string, unknown>>;
  operators?: {
    eq: (column: unknown, value: unknown) => SQL<unknown>;
    asc: (column: unknown) => SQL<unknown>;
    desc: (column: unknown) => SQL<unknown>;
    count: () => SQL<unknown>;
  };
}

/**
 * Create a Drizzle provider
 */
export function createDrizzleProvider(config: DrizzleClientConfig): CrudProvider {
  const { db, schema, operators } = config;
  
  // Use provided operators or create placeholders
  const { eq, asc, desc, count } = operators || {
    eq: (column: unknown, value: unknown) => ({ type: 'eq', column, value }) as SQL<unknown>,
    asc: (column: unknown) => ({ type: 'asc', column }) as SQL<unknown>,
    desc: (column: unknown) => ({ type: 'desc', column }) as SQL<unknown>,
    count: () => ({ type: 'count' }) as SQL<unknown>
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Get the table from the schema
        const table = schema[resource];
        if (!table) {
          throw new Error(`Resource ${resource} not found in schema`);
        }

        // Build query
        let query = db.select().from(table);

        // Apply filters
        if (filter && Object.keys(filter).length > 0) {
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              query = query.where(eq((table as Record<string, unknown>)[key], value));
            }
          }
        }

        // Apply sorting
        if (sort) {
          query = query.orderBy(
            sort.order === 'asc' 
              ? asc(table[sort.field]) 
              : desc(table[sort.field])
          );
        }

        // Get total count
        const countQuery = db.select({ count: count() }).from(table);
        const countResult = await countQuery;
        const total = countResult[0] ? (countResult[0] as Record<string, number>).count : 0;

        // Apply pagination
        if (pagination) {
          const { page, perPage } = pagination;
          const offset = (page - 1) * perPage;
          query = query.limit(perPage).offset(offset);
        }

        // Execute query
        const data = await query;

        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Get the table from the schema
        const table = schema[resource];
        if (!table) {
          throw new Error(`Resource ${resource} not found in schema`);
        }

        // Build query
        const query = db.select().from(table).where(eq((table as Record<string, unknown>).id, id)).limit(1);

        // Execute query
        const [data] = await query;

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
        // Get the table from the schema
        const table = schema[resource];
        if (!table) {
          throw new Error(`Resource ${resource} not found in schema`);
        }

        // Build query
        const query = db.insert(table).values(variables).returning();

        // Execute query
        const [data] = await query;

        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Get the table from the schema
        const table = schema[resource];
        if (!table) {
          throw new Error(`Resource ${resource} not found in schema`);
        }

        // Build query
        const query = db
          .update(table)
          .set(variables)
          .where(eq((table as Record<string, unknown>).id, id))
          .returning();

        // Execute query
        const [data] = await query;

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
        // Get the table from the schema
        const table = schema[resource];
        if (!table) {
          throw new Error(`Resource ${resource} not found in schema`);
        }

        // Get the record before deleting
        const [record] = await db
          .select()
          .from(table)
          .where(eq((table as Record<string, unknown>).id, id))
          .limit(1);

        if (!record) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }

        // Build query
        const query = db
          .delete(table)
          .where(eq((table as Record<string, unknown>).id, id))
          .returning();

        // Execute query
        await query;

        return { data: record };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

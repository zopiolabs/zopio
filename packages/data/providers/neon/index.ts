/**
 * Neon provider implementation
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

export interface NeonProviderConfig {
  connectionString: string;
  pool?: unknown; // Database pool instance
  schema?: string;
  tableMapping?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a Neon provider
 */
export function createNeonProvider(config: NeonProviderConfig): CrudProvider {
  const { 
    // connectionString is not directly used but kept for future reference
    pool,
    schema = 'public',
    tableMapping = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to get fully qualified table name
  const getFullTableName = (resource: string): string => {
    const tableName = getTableName(resource);
    return `${schema}.${tableName}`;
  };

  // Helper to execute SQL queries
  const executeQuery = async (sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> => {
    // Use provided pool or create a new connection
    const client = pool as { query: (sql: string, params: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> };
    
    if (!client || typeof client.query !== 'function') {
      throw new Error('Database pool not provided or invalid');
    }
    
    try {
      const result = await client.query(sql, params);
      return result.rows || [];
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  };

  // Helper to build WHERE clause from filter
  type FilterType = Record<string, unknown>;
  const buildWhereClause = (filter: FilterType = {}): { clause: string; params: unknown[] } => {
    const conditions: string[] = [];
    let paramIndex = 1;
    const params: unknown[] = [];
    
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }
    
    const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    return { clause, params };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const tableName = getFullTableName(resource);
        
        // Build WHERE clause from filter
        const { clause: whereClause, params: whereParams } = buildWhereClause(filter);
        
        // Build ORDER BY clause from sort
        let orderClause = '';
        if (sort) {
          orderClause = `ORDER BY ${sort.field} ${sort.order === 'asc' ? 'ASC' : 'DESC'}`;
        }
        
        // Build LIMIT and OFFSET clauses from pagination
        let limitClause = '';
        let offsetClause = '';
        let limitParams: unknown[] = [];
        
        if (pagination) {
          const { page, perPage } = pagination;
          limitClause = `LIMIT $${whereParams.length + 1}`;
          offsetClause = `OFFSET $${whereParams.length + 2}`;
          limitParams = [perPage, (page - 1) * perPage];
        }
        
        // Get total count
        const countSql = `SELECT COUNT(*) AS total FROM ${tableName} ${whereClause}`;
        const countResult = await executeQuery(countSql, whereParams);
        const totalRecord = countResult[0] as Record<string, unknown>;
        const total = totalRecord && typeof totalRecord.total === 'string' ? Number.parseInt(totalRecord.total, 10) : 0;
        
        // Get data
        const dataSql = `
          SELECT * FROM ${tableName}
          ${whereClause}
          ${orderClause}
          ${limitClause}
          ${offsetClause}
        `;
        
        const data = await executeQuery(dataSql, [...whereParams, ...limitParams]);
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const tableName = getFullTableName(resource);
        
        // Get data
        const sql = `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`;
        const result = await executeQuery(sql, [id]);
        
        if (result.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data: result[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const tableName = getFullTableName(resource);
        
        // Build column names and placeholders
        // Ensure variables is treated as a proper object
        const variablesObj = variables as Record<string, unknown>;
        const columns = Object.keys(variablesObj);
        const placeholders = columns.map((_, index) => `$${index + 1}`);
        const values = Object.values(variablesObj);
        
        // Create data
        const sql = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders.join(', ')})
          RETURNING *
        `;
        
        const result = await executeQuery(sql, values);
        
        return { data: result[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const tableName = getFullTableName(resource);
        
        // Build SET clause
        const setColumns = Object.keys(variables).map((key, index) => `${key} = $${index + 1}`);
        const values = [...Object.values(variables), id];
        
        // Update data
        const sql = `
          UPDATE ${tableName}
          SET ${setColumns.join(', ')}
          WHERE id = $${values.length}
          RETURNING *
        `;
        
        const result = await executeQuery(sql, values);
        
        if (result.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data: result[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const tableName = getFullTableName(resource);
        
        // Get data before deleting
        const data = await this.getOne({ resource, id });
        
        // Delete data
        const sql = `DELETE FROM ${tableName} WHERE id = $1`;
        await executeQuery(sql, [id]);
        
        // Return the data that was deleted
        return { data: data.data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

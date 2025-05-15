/**
 * Odoo provider implementation
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
import { odoo } from '../../adapters/index.js';

export interface OdooProviderConfig {
  url: string;
  db: string;
  username: string;
  password: string;
  modelMapping?: Record<string, string>;
}

/**
 * Create an Odoo provider
 */
export function createOdooProvider(config: OdooProviderConfig): CrudProvider {
  const { 
    url, 
    db, 
    username, 
    password,
    modelMapping = {}
  } = config;

  // Helper to get Odoo model from resource name
  const getOdooModel = (resource: string): string => {
    return modelMapping[resource] || resource;
  };

  // Helper to build JSON-RPC request
  const jsonRpcRequest = async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
    const response = await fetch(`${url}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Unknown Odoo error');
    }
    
    return result.result as T;
  };

  // Authentication helper
  let uid = 0; // Default to 0 instead of null
  
  const authenticate = async (): Promise<number> => {
    if (uid !== 0) {
      return uid;
    }
    
    const result = await jsonRpcRequest<number>('call', {
      service: 'common',
      method: 'authenticate',
      args: [db, username, password, {}]
    });
    
    if (!result) {
      throw new Error('Authentication failed');
    }
    
    uid = result;
    return uid;
  };

  // Helper to call Odoo model methods
  const callModel = async <T>(model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<T> => {
    const userId = await authenticate();
    
    return jsonRpcRequest<T>('call', {
      service: 'object',
      method: 'execute_kw',
      args: [db, userId, password, model, method, args, kwargs]
    });
  };

  // Helper to build kwargs for search_read
  const buildKwargs = (
    pagination?: { page: number; perPage: number },
    sort?: { field: string; order: string }
  ): Record<string, unknown> => {
    const kwargs: Record<string, unknown> = {};
    
    if (pagination) {
      kwargs.limit = pagination.perPage;
      kwargs.offset = (pagination.page - 1) * pagination.perPage;
    }
    
    if (sort) {
      kwargs.order = `${sort.field} ${sort.order === 'asc' ? 'ASC' : 'DESC'}`;
    }
    
    return kwargs;
  };

  return {
    async getList({ resource, pagination, filter }: GetListParams): Promise<GetListResult> {
      try {
        const model = getOdooModel(resource);
        
        // Build domain from filter using the adapter
        const domain = filter ? odoo.buildOdooDomain(filter) : [];
        
        // Build kwargs for search_read
        const kwargs = buildKwargs(pagination);
        
        // Get total count
        const count = await callModel<number>(model, 'search_count', [domain]);
        
        // Get data
        const rawData = await callModel<Record<string, unknown>[]>(model, 'search_read', [domain], kwargs);
        
        // Normalize data using the adapter
        const data = rawData.map(record => odoo.normalizeOdooRecord(record));
        
        return { data, total: count };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const model = getOdooModel(resource);
        
        // Build domain to find by ID
        const domain: [string, string, unknown][] = [['id', '=', id]];
        
        // Get data
        const results = await callModel<Record<string, unknown>[]>(model, 'search_read', [domain], { limit: 1 });
        
        if (!results || results.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        // Normalize data using the adapter
        const normalizedRecord = odoo.normalizeOdooRecord(results[0]);
        
        return { data: normalizedRecord };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const model = getOdooModel(resource);
        
        // Create record
        const recordId = await callModel<number>(model, 'create', [variables]);
        
        // Get the created record
        const data = await callModel<Record<string, unknown>[]>(model, 'read', [[recordId]]);
        
        return { data: data[0] || {} as Record<string, unknown> };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const model = getOdooModel(resource);
        
        // Update record
        await callModel<boolean>(model, 'write', [[id], variables]);
        
        // Get the updated record
        const data = await callModel<Record<string, unknown>[]>(model, 'read', [[id]]);
        
        return { data: data[0] || {} as Record<string, unknown> };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const model = getOdooModel(resource);
        
        // Get the record before deleting
        const results = await callModel<Record<string, unknown>[]>(model, 'read', [[id]]);
        
        if (!results || results.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        const recordData = results[0];
        
        // Delete record
        await callModel<boolean>(model, 'unlink', [[id]]);
        
        return { data: recordData };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

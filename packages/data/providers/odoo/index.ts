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

export interface OdooProviderConfig {
  url: string;
  db: string;
  username: string;
  password: string;
  modelMapping?: Record<string, string>; // Maps resource names to Odoo models
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
  const jsonRpcRequest = async (method: string, params: any): Promise<any> => {
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
    
    if (!response.ok) {
      throw new Error(`Odoo request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Unknown Odoo error');
    }
    
    return result.result;
  };

  // Authentication helper
  let uid: number | null = null;
  
  const authenticate = async (): Promise<number> => {
    if (uid !== null) {
      return uid;
    }
    
    const result = await jsonRpcRequest('call', {
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
  const callModel = async (model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<any> => {
    const userId = await authenticate();
    
    return jsonRpcRequest('call', {
      service: 'object',
      method: 'execute_kw',
      args: [db, userId, password, model, method, args, kwargs]
    });
  };

  // Helper to build domain (Odoo's filter format)
  const buildDomain = (filter: any): [string, string, any][] => {
    const domain: [string, string, any][] = [];
    
    if (filter) {
      for (const [field, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          domain.push([field, '=', value]);
        }
      }
    }
    
    return domain;
  };

  // Helper to build kwargs for search_read
  const buildKwargs = (pagination: any, sort: any): Record<string, any> => {
    const kwargs: Record<string, any> = {};
    
    // Add pagination
    if (pagination) {
      kwargs.limit = pagination.perPage;
      kwargs.offset = (pagination.page - 1) * pagination.perPage;
    }
    
    // Add sort
    if (sort) {
      kwargs.order = `${sort.field} ${sort.order === 'asc' ? 'asc' : 'desc'}`;
    }
    
    return kwargs;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const model = getOdooModel(resource);
        
        const domain = buildDomain(filter);
        const kwargs = buildKwargs(pagination, sort);
          }
        }
        
        // Build kwargs for search_read
        const kwargs: Record<string, any> = {};
        
        // Add pagination
        if (pagination) {
          kwargs.limit = pagination.perPage;
          kwargs.offset = (pagination.page - 1) * pagination.perPage;
        }
        
        // Add sort
        if (sort) {
          kwargs.order = `${sort.field} ${sort.order === 'asc' ? 'asc' : 'desc'}`;
        }
        
        // Get total count
        const count = await callModel(model, 'search_count', [domain]);
        
        // Get data
        const data = await callModel(model, 'search_read', [domain], kwargs);
        
        return { data, total: count };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const model = getOdooModel(resource);
        
        // Build domain to find by ID
        const domain = [['id', '=', id]];
        
        // Get data
        const results = await callModel(model, 'search_read', [domain], { limit: 1 });
        
        if (!results || results.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data: results[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const model = getOdooModel(resource);
        
        // Create record
        const id = await callModel(model, 'create', [variables]);
        
        // Get created record
        const data = await callModel(model, 'read', [[id]]);
        
        return { data: data[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const model = getOdooModel(resource);
        
        // Update record
        await callModel(model, 'write', [[id], variables]);
        
        // Get updated record
        const data = await callModel(model, 'read', [[id]]);
        
        return { data: data[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const model = getOdooModel(resource);
        
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Delete record
        await callModel(model, 'unlink', [[id]]);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

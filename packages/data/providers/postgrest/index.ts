/**
 * PostgREST data provider implementation
 * 
 * This provider integrates with PostgREST (https://postgrest.org)
 * for database operations using the PostgREST REST API.
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

export interface PostgRESTProviderConfig {
  /**
   * PostgREST API URL
   * @example 'https://api.example.com'
   */
  apiUrl: string;
  
  /**
   * JWT token for authentication
   */
  token?: string;
  
  /**
   * Optional custom headers to include in all requests
   */
  customHeaders?: Record<string, string>;
  
  /**
   * Optional mapping of resource names to table names
   * @example { posts: 'blog_posts' }
   */
  resources?: Record<string, string>;
  
  /**
   * Optional primary key field name (defaults to 'id')
   */
  primaryKeyField?: string;
}

/**
 * Create a PostgREST data provider
 */
export function createPostgRESTProvider(config: PostgRESTProviderConfig): CrudProvider {
  const {
    apiUrl,
    token,
    customHeaders = {},
    resources = {},
    primaryKeyField = 'id'
  } = config;
  
  // Helper function to get the table name for a resource
  const getTableName = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const tableName = getTableName(resource);
    
    if (id) {
      // For single item operations, use the primary key in the query
      return `${baseUrl}/${tableName}?${primaryKeyField}=eq.${id}`;
    }
    
    return `${baseUrl}/${tableName}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
      ...additionalHeaders
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  // Helper function to build filter parameters for PostgREST
  const buildFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
    if (!filter) {
      return;
    }
    
    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined || value === null) {
        continue;
      }
      
      if (typeof value === 'object' && value !== null) {
        // Handle operator objects like { $eq: 'value' }
        for (const [operator, operatorValue] of Object.entries(value as Record<string, unknown>)) {
          if (operatorValue === undefined || operatorValue === null) {
            continue;
          }
          
          const postgrestOperator = mapOperatorToPostgREST(operator);
          url.searchParams.append(`${key}`, `${postgrestOperator}.${operatorValue}`);
        }
      } else {
        // Simple equality filter
        url.searchParams.append(`${key}`, `eq.${value}`);
      }
    }
  };
  
  // Helper function to map common operators to PostgREST's format
  const mapOperatorToPostgREST = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: 'eq',
      $ne: 'neq',
      $lt: 'lt',
      $lte: 'lte',
      $gt: 'gt',
      $gte: 'gte',
      $like: 'like',
      $ilike: 'ilike',
      $in: 'in',
      $is: 'is',
      $contains: 'cs',
      $containedBy: 'cd',
      $overlaps: 'ov',
      $startsWith: 'sw',
      $endsWith: 'ew',
      $range: 'sl',
      $rangeGt: 'sr',
      $rangeLt: 'nxl',
      $rangeGte: 'nxr',
      $rangeLte: 'adj'
    };
    
    return operatorMap[operator] || operator.replace('$', '');
  };
  
  // Helper function to build sort parameters for PostgREST
  const buildSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (!sort) {
      return;
    }
    
    const direction = sort.order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    url.searchParams.append('order', `${sort.field}.${direction}`);
  };
  
  // Helper function to process list response
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Get total count from header
    const totalCount = response.headers.get('Content-Range')
      ? parseInt(response.headers.get('Content-Range')?.split('/')[1] || '0', 10)
      : data.length;
    
    return { 
      data,
      total: totalCount
    };
  };
  
  // Helper function to process a single item response
  const processSingleItemResponse = async (response: Response): Promise<{ data: unknown }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // PostgREST returns an array for single item queries
    return { data: Array.isArray(result) && result.length > 0 ? result[0] : result };
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL
        const url = new URL(buildUrl({ resource }));
        
        // Add pagination
        if (pagination) {
          url.searchParams.append('limit', String(pagination.perPage));
          url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
        }
        
        // Add filtering
        buildFilterParams(url, filter);
        
        // Add sorting
        buildSortParams(url, sort);
        
        // Add header for count
        const headers = getHeaders({
          'Prefer': 'count=exact'
        });
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        // Process response
        return await processListResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        if (!id) {
          throw new Error('ID is required for getOne operation');
        }
        
        // Fetch data
        const response = await fetch(buildUrl({ resource, id }), { 
          headers: getHeaders()
        });
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Create data
        const response = await fetch(buildUrl({ resource }), {
          method: 'POST',
          headers: getHeaders({
            'Prefer': 'return=representation'
          }),
          body: JSON.stringify(variables)
        });
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        if (!id) {
          throw new Error('ID is required for update operation');
        }
        
        // Update data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'PATCH',
          headers: getHeaders({
            'Prefer': 'return=representation'
          }),
          body: JSON.stringify(variables)
        });
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        if (!id) {
          throw new Error('ID is required for delete operation');
        }
        
        // Delete data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'DELETE',
          headers: getHeaders({
            'Prefer': 'return=representation'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

/**
 * Directus data provider implementation
 * 
 * This provider integrates with Directus (https://github.com/directus/directus)
 * for database operations using the Directus REST API.
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

export interface DirectusProviderConfig {
  /**
   * Directus API URL
   * @example 'https://example.directus.app'
   */
  apiUrl: string;
  
  /**
   * Directus access token
   */
  token?: string;
  
  /**
   * Optional custom headers to include in all requests
   */
  customHeaders?: Record<string, string>;
  
  /**
   * Optional mapping of resource names to collection names
   * @example { posts: 'blog_posts' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a Directus data provider
 */
export function createDirectusProvider(config: DirectusProviderConfig): CrudProvider {
  const {
    apiUrl,
    token,
    customHeaders = {},
    resources = {}
  } = config;
  
  // Helper function to get the collection name for a resource
  const getCollectionName = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const collectionName = getCollectionName(resource);
    
    if (id) {
      return `${baseUrl}/items/${collectionName}/${id}`;
    }
    
    return `${baseUrl}/items/${collectionName}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  // Helper function to build filter parameters for Directus
  const buildFilterParams = (filter?: Record<string, unknown>): Record<string, unknown> => {
    if (!filter) {
      return {};
    }
    
    const directusFilter: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined || value === null) {
        continue;
      }
      
      if (typeof value === 'object' && value !== null) {
        // Handle operator objects like { $eq: 'value' }
        const operatorFilter: Record<string, unknown> = {};
        
        for (const [operator, operatorValue] of Object.entries(value as Record<string, unknown>)) {
          if (operatorValue === undefined || operatorValue === null) {
            continue;
          }
          
          const directusOperator = mapOperatorToDirectus(operator);
          operatorFilter[directusOperator] = operatorValue;
        }
        
        if (Object.keys(operatorFilter).length > 0) {
          directusFilter[key] = operatorFilter;
        }
      } else {
        // Simple equality filter
        directusFilter[key] = { _eq: value };
      }
    }
    
    return directusFilter;
  };
  
  // Helper function to map common operators to Directus's format
  const mapOperatorToDirectus = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: '_eq',
      $ne: '_neq',
      $lt: '_lt',
      $lte: '_lte',
      $gt: '_gt',
      $gte: '_gte',
      $contains: '_contains',
      $ncontains: '_ncontains',
      $in: '_in',
      $nin: '_nin',
      $null: '_null',
      $nnull: '_nnull',
      $between: '_between',
      $nbetween: '_nbetween',
      $empty: '_empty',
      $nempty: '_nempty'
    };
    
    return operatorMap[operator] || operator.replace('$', '_');
  };
  
  // Helper function to build sort parameters for Directus
  const buildSortParams = (sort?: { field: string; order: string }): string[] => {
    if (!sort) {
      return [];
    }
    
    const direction = sort.order.toLowerCase() === 'asc' ? '' : '-';
    return [`${direction}${sort.field}`];
  };
  
  // Helper function to process list response
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Directus returns data in a specific format
    const data = result.data || [];
    const total = result.meta?.total_count || data.length;
    
    return { 
      data,
      total
    };
  };
  
  // Helper function to process a single item response
  const processSingleItemResponse = async (response: Response): Promise<{ data: unknown }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    return { data: result.data || {} };
  };

  // Extracted helper for getList
  function buildDirectusListUrl(
    resource: string,
    pagination?: { page: number; perPage: number },
    sort?: { field: string; order: string },
    filter?: Record<string, unknown>
  ): string {
    const directusFilter = buildFilterParams(filter);
    const sortParams = buildSortParams(sort);
    const url = new URL(buildUrl({ resource }));
    if (pagination) {
      url.searchParams.append('limit', String(pagination.perPage));
      url.searchParams.append('page', String(pagination.page));
    }
    if (sortParams.length > 0) {
      url.searchParams.append('sort', sortParams.join(','));
    }
    if (Object.keys(directusFilter).length > 0) {
      url.searchParams.append('filter', JSON.stringify(directusFilter));
    }
    url.searchParams.append('meta', '*');
    return url.toString();
  }

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const url = buildDirectusListUrl(resource, pagination, sort, filter);
        const response = await fetch(url, { headers: getHeaders() });
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
          headers: getHeaders(),
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
          headers: getHeaders(),
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
          headers: getHeaders()
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }
        
        // Return empty data object for successful deletion
        return { data: {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

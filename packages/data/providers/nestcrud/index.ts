/**
 * NestJSX CRUD client provider implementation
 * 
 * This provider integrates with NestJS applications that follow the NestJSX CRUD patterns
 * for RESTful API endpoints.
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

export interface NestCrudClientConfig {
  /**
   * Base URL of the NestJS API
   */
  apiUrl: string;
  
  /**
   * Optional authentication token
   */
  authToken?: string;
  
  /**
   * Optional custom headers to include in all requests
   */
  customHeaders?: Record<string, string>;
  
  /**
   * Optional resource mapping to override default endpoint paths
   * @example { users: 'api/users' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a NestJSX CRUD client provider
 */
export function createNestCrudClientProvider(config: NestCrudClientConfig): CrudProvider {
  const {
    apiUrl,
    authToken,
    customHeaders = {},
    resources = {}
  } = config;
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const resourcePath = resources[resource] || resource;
    
    return id 
      ? `${baseUrl}/${resourcePath}/${id}`
      : `${baseUrl}/${resourcePath}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    
    return headers;
  };
  
  // Helper function to add pagination parameters to URL
  const addPaginationParams = (
    url: URL,
    pagination?: { page: number; perPage: number }
  ): void => {
    if (pagination) {
      // NestJSX CRUD uses limit/offset pagination by default
      url.searchParams.append('limit', String(pagination.perPage));
      url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
    }
  };
  
  // Helper function to add sort parameters to URL
  const addSortParams = (
    url: URL,
    sort?: { field: string; order: string }
  ): void => {
    if (sort) {
      // NestJSX CRUD uses sort[field]=ASC|DESC format
      url.searchParams.append(`sort[${sort.field}]`, sort.order.toUpperCase());
    }
  };
  
  // Helper function to handle a single filter operator
  const addFilterOperator = (
    url: URL,
    key: string,
    operator: string,
    operatorValue: unknown
  ): void => {
    if (operatorValue !== undefined && operatorValue !== null) {
      url.searchParams.append(`filter[${key}][${operator}]`, String(operatorValue));
    }
  };

  // Helper function to handle object-based filters with operators
  const addObjectFilter = (
    url: URL,
    key: string,
    value: Record<string, unknown>
  ): void => {
    for (const [operator, operatorValue] of Object.entries(value)) {
      addFilterOperator(url, key, operator, operatorValue);
    }
  };

  // Helper function to add filter parameters to URL
  const addFilterParams = (
    url: URL,
    filter?: Record<string, unknown>
  ): void => {
    if (!filter) {
      return;
    }

    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined || value === null) {
        continue;
      }
      
      // NestJSX CRUD supports various filter operators
      if (typeof value === 'object' && value !== null) {
        // Handle operator objects like { $eq: 'value' }
        addObjectFilter(url, key, value as Record<string, unknown>);
      } else {
        // Simple equality filter
        addFilterOperator(url, key, '$eq', value);
      }
    }
  };
  
  // Helper function to process response and extract data and total
  const processResponse = async (response: Response): Promise<{ data: unknown; total?: number }> => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // NestJSX CRUD typically returns data in a specific format for lists
    if (Array.isArray(result.data) && typeof result.total === 'number') {
      return {
        data: result.data,
        total: result.total
      };
    }
    
    // For single item responses or custom formats
    return {
      data: result
    };
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl({ resource }));
        
        // Add parameters
        addPaginationParams(url, pagination);
        addSortParams(url, sort);
        addFilterParams(url, filter);
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        // Process response
        const { data, total } = await processResponse(response);
        
        return { 
          data: Array.isArray(data) ? data : [],
          total: total || (Array.isArray(data) ? data.length : 0)
        };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl({ resource, id }), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
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
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Delete data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'DELETE',
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        // Some APIs return no content on delete
        let data = {};
        try {
          if (response.headers.get('Content-Length') !== '0') {
            data = await response.json();
          }
        } catch (_) {
          // Ignore JSON parsing errors for empty responses
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

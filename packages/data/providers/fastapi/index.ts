/**
 * FastAPI data provider implementation
 * 
 * This provider integrates with FastAPI (https://github.com/tiangolo/fastapi)
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

export interface FastAPIProviderConfig {
  /**
   * FastAPI endpoint URL
   * @example 'https://api.example.com'
   */
  apiUrl: string;
  
  /**
   * Authentication token (Bearer token)
   */
  token?: string;
  
  /**
   * Optional custom headers to include in all requests
   */
  customHeaders?: Record<string, string>;
  
  /**
   * Optional mapping of resource names to endpoint paths
   * @example { posts: 'blog/posts' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a FastAPI data provider
 */
export function createFastAPIProvider(config: FastAPIProviderConfig): CrudProvider {
  const {
    apiUrl,
    token,
    customHeaders = {},
    resources = {}
  } = config;
  
  // Helper function to get the endpoint path for a resource
  const getResourcePath = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const resourcePath = getResourcePath(resource);
    
    if (id) {
      return `${baseUrl}/${resourcePath}/${id}`;
    }
    
    return `${baseUrl}/${resourcePath}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  // Helper function to add pagination parameters to URL
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (!pagination) {
      return;
    }
    
    url.searchParams.append('skip', String((pagination.page - 1) * pagination.perPage));
    url.searchParams.append('limit', String(pagination.perPage));
  };
  
  // Helper function to add sorting parameters to URL
  const addSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (!sort) {
      return;
    }
    
    const direction = sort.order.toLowerCase() === 'asc' ? '' : '-';
    url.searchParams.append('sort_by', `${direction}${sort.field}`);
  };
  
  // Helper function to add filter parameters to URL
  const addFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
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
          
          const fastApiOperator = mapOperatorToFastAPI(operator);
          url.searchParams.append(`${key}${fastApiOperator}`, String(operatorValue));
        }
      } else {
        // Simple equality filter
        url.searchParams.append(key, String(value));
      }
    }
  };
  
  // Helper function to map common operators to FastAPI's format
  const mapOperatorToFastAPI = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: '',
      $ne: '__ne',
      $lt: '__lt',
      $lte: '__lte',
      $gt: '__gt',
      $gte: '__gte',
      $contains: '__contains',
      $icontains: '__icontains',
      $startsWith: '__startswith',
      $endsWith: '__endswith',
      $in: '__in',
      $nin: '__nin',
      $null: '__isnull',
      $regex: '__regex'
    };
    
    return operatorMap[operator] || operator.replace('$', '__');
  };
  
  // Extracted helpers for response handling
  function handleSimpleArrayResponse(result: any[]): { data: any[]; total: number } {
    return {
      data: result,
      total: result.length
    };
  }
  function handlePaginatedResponse(result: any): { data: any[]; total: number } {
    return {
      data: result.items,
      total: result.total || result.count || result.items.length
    };
  }
  function handleDataMetaResponse(result: any): { data: any[]; total: number } {
    return {
      data: result.data,
      total: result.meta?.total || result.total || result.data.length
    };
  }
  function handleFallbackResponse(): { data: any[]; total: number } {
    return {
      data: [],
      total: 0
    };
  }

  // Helper function to process list response
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Handle different response formats
    if (Array.isArray(result)) {
      // Simple array response
      return handleSimpleArrayResponse(result);
    }
    if (result.items && Array.isArray(result.items)) {
      // Paginated response with items and total
      return handlePaginatedResponse(result);
    }
    if (result.data && Array.isArray(result.data)) {
      // Response with data and meta
      return handleDataMetaResponse(result);
    }
    // Fallback for unexpected formats
    return handleFallbackResponse();
  };
  
  // Helper function to process a single item response
  const processSingleItemResponse = async (response: Response): Promise<{ data: unknown }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    return { data: result };
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL
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
          method: 'PUT',
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

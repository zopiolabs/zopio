/**
 * Strapi client provider implementation
 * 
 * This provider integrates with Strapi CMS (https://github.com/strapi/strapi)
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

export interface StrapiClientConfig {
  /**
   * Base URL of the Strapi API
   */
  apiUrl: string;
  
  /**
   * Optional authentication token (JWT)
   */
  authToken?: string;
  
  /**
   * Optional custom headers to include in all requests
   */
  customHeaders?: Record<string, string>;
  
  /**
   * Optional resource mapping to override default endpoint paths
   * @example { articles: 'api/articles' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a Strapi client provider
 */
export function createStrapiClientProvider(config: StrapiClientConfig): CrudProvider {
  const {
    apiUrl,
    authToken,
    customHeaders = {},
    resources = {}
  } = config;
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const resourcePath = resources[resource] || `api/${resource}`;
    
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
  
  // Helper function to handle a single filter operator
  const addFilterOperator = (
    url: URL,
    key: string,
    operator: string,
    operatorValue: unknown
  ): void => {
    if (operatorValue !== undefined && operatorValue !== null) {
      // Strapi uses a specific filter format
      url.searchParams.append(`filters[${key}][${operator}]`, String(operatorValue));
    }
  };

  // Helper function to handle object-based filters with operators
  const addObjectFilter = (
    url: URL,
    key: string,
    value: Record<string, unknown>
  ): void => {
    for (const [operator, operatorValue] of Object.entries(value)) {
      // Map common operators to Strapi's format
      const strapiOperator = mapOperatorToStrapi(operator);
      addFilterOperator(url, key, strapiOperator, operatorValue);
    }
  };
  
  // Helper function to map common operators to Strapi's format
  const mapOperatorToStrapi = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: 'eq',
      $ne: 'ne',
      $lt: 'lt',
      $lte: 'lte',
      $gt: 'gt',
      $gte: 'gte',
      $contains: 'contains',
      $containsi: 'containsi',
      $in: 'in',
      $notIn: 'notIn',
      $null: 'null',
      $notNull: 'notNull',
      $between: 'between',
      $startsWith: 'startsWith',
      $endsWith: 'endsWith'
    };
    
    return operatorMap[operator] || operator.replace('$', '');
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
      
      // Strapi supports various filter operators
      if (typeof value === 'object' && value !== null) {
        // Handle operator objects like { $eq: 'value' }
        addObjectFilter(url, key, value as Record<string, unknown>);
      } else {
        // Simple equality filter
        addFilterOperator(url, key, 'eq', value);
      }
    }
  };
  
  // Helper function to add pagination parameters to URL
  const addPaginationParams = (
    url: URL,
    pagination?: { page: number; perPage: number }
  ): void => {
    if (pagination) {
      // Strapi uses page and pageSize for pagination
      url.searchParams.append('pagination[page]', String(pagination.page));
      url.searchParams.append('pagination[pageSize]', String(pagination.perPage));
    }
  };
  
  // Helper function to add sort parameters to URL
  const addSortParams = (
    url: URL,
    sort?: { field: string; order: string }
  ): void => {
    if (sort) {
      // Strapi uses sort[field]=asc|desc format
      const order = sort.order.toLowerCase();
      url.searchParams.append('sort', `${sort.field}:${order}`);
    }
  };
  
  // Helper function to process response and extract data and total
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Strapi v4 returns data in a specific format
    const data = result.data || [];
    
    // Extract metadata
    const total = result.meta?.pagination?.total || data.length;
    
    // Transform data to include id from attributes if needed
    const transformedData = data.map((item: any) => {
      if (item.id && item.attributes) {
        return {
          id: item.id,
          ...item.attributes
        };
      }
      return item;
    });
    
    return { 
      data: transformedData,
      total
    };
  };
  
  // Helper function to process a single item response
  const processSingleItemResponse = async (response: Response): Promise<{ data: unknown }> => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Strapi v4 returns data in a specific format
    const item = result.data;
    
    if (item && item.id && item.attributes) {
      return {
        data: {
          id: item.id,
          ...item.attributes
        }
      };
    }
    
    return { data: item || {} };
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
        
        // Add populate parameter to include relations
        url.searchParams.append('populate', '*');
        
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
        // Build URL
        const url = new URL(buildUrl({ resource, id }));
        
        // Add populate parameter to include relations
        url.searchParams.append('populate', '*');
        
        // Fetch data
        const response = await fetch(url.toString(), { 
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
        // Strapi v4 expects data to be wrapped in a data object
        const requestBody = {
          data: variables
        };
        
        // Create data
        const response = await fetch(buildUrl({ resource }), {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(requestBody)
        });
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Strapi v4 expects data to be wrapped in a data object
        const requestBody = {
          data: variables
        };
        
        // Update data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(requestBody)
        });
        
        // Process response
        return await processSingleItemResponse(response);
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
        
        // Process response
        return await processSingleItemResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

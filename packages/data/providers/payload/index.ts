/**
 * PayloadCMS client provider implementation
 * 
 * This provider integrates with PayloadCMS (https://github.com/payloadcms/payload)
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

export interface PayloadCMSClientConfig {
  /**
   * Base URL of the PayloadCMS API
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
   * Optional resource mapping to override default collection names
   * @example { posts: 'blog-posts' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a PayloadCMS client provider
 */
export function createPayloadCMSClientProvider(config: PayloadCMSClientConfig): CrudProvider {
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
      ? `${baseUrl}/api/${resourcePath}/${id}`
      : `${baseUrl}/api/${resourcePath}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    if (authToken) {
      headers.Authorization = `JWT ${authToken}`;
    }
    
    return headers;
  };
  
  // Helper function to handle a single where condition
  const addWhereCondition = (
    conditions: Record<string, unknown>[],
    key: string,
    operator: string,
    value: unknown
  ): void => {
    if (value !== undefined && value !== null) {
      conditions.push({
        [key]: {
          [operator]: value
        }
      });
    }
  };

  // Helper function to handle object-based filters with operators
  const processObjectFilter = (
    conditions: Record<string, unknown>[],
    key: string,
    value: Record<string, unknown>
  ): void => {
    for (const [operator, operatorValue] of Object.entries(value)) {
      // Map common operators to PayloadCMS's format
      const payloadOperator = mapOperatorToPayload(operator);
      addWhereCondition(conditions, key, payloadOperator, operatorValue);
    }
  };
  
  // Helper function to map common operators to PayloadCMS's format
  const mapOperatorToPayload = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: 'equals',
      $ne: 'not_equals',
      $lt: 'less_than',
      $lte: 'less_than_or_equal_to',
      $gt: 'greater_than',
      $gte: 'greater_than_or_equal_to',
      $contains: 'like',
      $in: 'in',
      $notIn: 'not_in',
      $exists: 'exists'
    };
    
    return operatorMap[operator] || operator.replace('$', '');
  };

  // Helper function to build where conditions for PayloadCMS
  const buildWhereConditions = (
    filter?: Record<string, unknown>
  ): Record<string, unknown> => {
    if (!filter) {
      return {};
    }

    const conditions: Record<string, unknown>[] = [];

    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined || value === null) {
        continue;
      }
      
      // PayloadCMS supports various filter operators
      if (typeof value === 'object' && value !== null) {
        // Handle operator objects like { $eq: 'value' }
        processObjectFilter(conditions, key, value as Record<string, unknown>);
      } else {
        // Simple equality filter
        addWhereCondition(conditions, key, 'equals', value);
      }
    }

    // If there are multiple conditions, combine them with AND
    if (conditions.length > 1) {
      return { and: conditions };
    } else if (conditions.length === 1) {
      return conditions[0];
    }
    
    return {};
  };
  
  // Helper function to build sort parameters for PayloadCMS
  const buildSortParams = (
    sort?: { field: string; order: string }
  ): Record<string, unknown> => {
    if (!sort) {
      return {};
    }
    
    return {
      sort: sort.field,
      order: sort.order.toLowerCase()
    };
  };
  
  // Helper function to build pagination parameters for PayloadCMS
  const buildPaginationParams = (
    pagination?: { page: number; perPage: number }
  ): Record<string, unknown> => {
    if (!pagination) {
      return {};
    }
    
    return {
      page: pagination.page,
      limit: pagination.perPage
    };
  };
  
  // Helper function to process list response
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // PayloadCMS returns data in a specific format
    const docs = result.docs || [];
    const total = result.totalDocs || docs.length;
    
    return { 
      data: docs,
      total
    };
  };
  
  // Helper function to process a single item response
  const processSingleItemResponse = async (response: Response): Promise<{ data: unknown }> => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return { data: result || {} };
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build query parameters
        const where = buildWhereConditions(filter);
        const sortParams = buildSortParams(sort);
        const paginationParams = buildPaginationParams(pagination);
        
        // Combine all parameters
        const queryParams = {
          where: Object.keys(where).length > 0 ? JSON.stringify(where) : undefined,
          ...sortParams,
          ...paginationParams,
          depth: 1 // Include relationships one level deep
        };
        
        // Build URL
        const url = new URL(buildUrl({ resource }));
        
        // Add query parameters
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        }
        
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
        // Build URL with depth parameter for relationships
        const url = new URL(buildUrl({ resource, id }));
        url.searchParams.append('depth', '1');
        
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

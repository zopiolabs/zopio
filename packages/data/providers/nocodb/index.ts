/**
 * NocoDB provider implementation
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

export interface NocoDBProviderConfig {
  apiUrl: string;
  apiKey: string;
  projectId?: string;
  tableMapping?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a NocoDB provider
 */
export function createNocodbProvider(config: NocoDBProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey,
    projectId,
    tableMapping = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const tableName = getTableName(resource);
    const baseUrl = `${apiUrl}/api/v1/${projectId ? `${projectId}/` : ''}${tableName}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'xc-auth': apiKey,
    'Content-Type': 'application/json'
  };

  // Helper functions to build URL parameters
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (!pagination) {
      return;
    }
    
    // NocoDB uses 'limit' for perPage and 'offset' for pagination
    url.searchParams.append('limit', String(pagination.perPage));
    
    // Always calculate offset even for page 1 (consistent behavior)
    const offset = (pagination.page - 1) * pagination.perPage;
    url.searchParams.append('offset', String(offset));
  };

  const addSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (!sort) {
      return;
    }
    
    url.searchParams.append('sort', sort.field);
    url.searchParams.append('order', sort.order.toLowerCase());
  };

  // Helper function to map operator to NocoDB filter format
  const mapOperatorToNocoDBFilter = (operator: string, value: unknown): Record<string, unknown> => {
    const operatorMap: Record<string, string> = {
      eq: 'eq',
      ne: 'neq',
      gt: 'gt',
      gte: 'gte',
      lt: 'lt',
      lte: 'lte',
      contains: 'like',
      startsWith: 'like',
      endsWith: 'like',
      in: 'in',
      notIn: 'nin',
      isNull: 'is',
      isNotNull: 'is'
    };

    // Handle special cases for text search and null checks
    if (operator === 'contains') {
      return { like: `%${value}%` };
    }
    
    if (operator === 'startsWith') {
      return { like: `${value}%` };
    }
    
    if (operator === 'endsWith') {
      return { like: `%${value}` };
    }
    
    if (operator === 'isNull') {
      return { is: null };
    }
    
    if (operator === 'isNotNull') {
      return { is: 'not null' };
    }

    // Use the operator map or default to equality
    const nocoOperator = operatorMap[operator] || 'eq';
    return { [nocoOperator]: value };
  };

  // Process a single filter value
  const processFilterValue = (key: string, value: unknown): Record<string, Record<string, unknown>> => {
    const result: Record<string, Record<string, unknown>> = {};

    // Skip undefined or null values
    if (value === undefined || value === null) {
      return result;
    }

    // Handle operator objects
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const operatorValue = value as Record<string, unknown>;
      
      if ('operator' in operatorValue && 'value' in operatorValue) {
        const operator = operatorValue.operator as string;
        const operatorVal = operatorValue.value;
        result[key] = mapOperatorToNocoDBFilter(operator, operatorVal);
        return result;
      }
      
      // If it's a regular object but not an operator, use it directly
      result[key] = value as Record<string, unknown>;
      return result;
    }
    
    // Handle basic value types
    if (typeof value === 'string') {
      result[key] = { like: `%${value}%` };
    } else if (Array.isArray(value)) {
      result[key] = { in: value };
    } else {
      result[key] = { eq: value };
    }
    
    return result;
  };

  // Main filter building function
  const buildFilterObject = (filter?: Record<string, unknown>): string | null => {
    if (!filter) {
      return null;
    }
    
    const filterObj: Record<string, Record<string, unknown>> = {};
    
    for (const [key, value] of Object.entries(filter)) {
      const processedFilter = processFilterValue(key, value);
      Object.assign(filterObj, processedFilter);
    }
    
    return JSON.stringify(filterObj);
  };
  
  // Helper function to fetch data from NocoDB API
  const fetchData = async (url: URL): Promise<Response> => {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    return response;
  };
  
  // Helper function to process response and extract data and total
  const processResponse = async (response: Response): Promise<GetListResult> => {
    const result = await response.json();
    
    // Get total count from headers if available
    const totalCount = response.headers.get('x-total-count');
    const total = totalCount ? Number.parseInt(totalCount, 10) : (Array.isArray(result) ? result.length : 0);
    
    // NocoDB returns an array of records
    const data = Array.isArray(result) ? result : result.list || [];
    
    return { data, total };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add parameters
        addPaginationParams(url, pagination);
        addSortParams(url, sort);
        
        // Add filter params
        const filterString = buildFilterObject(filter);
        if (filterString) {
          url.searchParams.append('where', filterString);
        }
        
        // Fetch and process data
        const response = await fetchData(url);
        return processResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { headers });
        
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
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
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
        const response = await fetch(buildUrl(resource, id), {
          method: 'PATCH',
          headers,
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
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Delete data
        const response = await fetch(buildUrl(resource, id), {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

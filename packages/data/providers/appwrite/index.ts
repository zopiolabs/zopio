/**
 * Appwrite data provider implementation
 * 
 * This provider integrates with Appwrite (https://github.com/appwrite/appwrite)
 * for database operations using the Appwrite SDK.
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

export interface AppwriteProviderConfig {
  /**
   * Appwrite endpoint URL
   * @example 'https://cloud.appwrite.io/v1'
   */
  endpoint: string;
  
  /**
   * Appwrite project ID
   */
  projectId: string;
  
  /**
   * Appwrite API key or JWT token
   */
  apiKey?: string;
  
  /**
   * Optional database ID (defaults to 'default')
   */
  databaseId?: string;
  
  /**
   * Optional mapping of resource names to collection IDs
   * @example { posts: 'blog_posts' }
   */
  resources?: Record<string, string>;
}

/**
 * Create an Appwrite data provider
 */
export function createAppwriteProvider(config: AppwriteProviderConfig): CrudProvider {
  const {
    endpoint,
    projectId,
    apiKey,
    databaseId = 'default',
    resources = {}
  } = config;
  
  // Helper function to get the collection ID for a resource
  const getCollectionId = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string }): string => {
    const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const collectionId = getCollectionId(resource);
    
    if (id) {
      return `${baseUrl}/databases/${databaseId}/collections/${collectionId}/documents/${id}`;
    }
    
    return `${baseUrl}/databases/${databaseId}/collections/${collectionId}/documents`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': projectId
    };
    
    if (apiKey) {
      headers['X-Appwrite-Key'] = apiKey;
    }
    
    return headers;
  };
  
  // Helper function to build query parameters for filtering
  const buildFilterParams = (filter?: Record<string, unknown>): string[] => {
    if (!filter) {
      return [];
    }
    
    const queries: string[] = [];
    
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
          
          const appwriteOperator = mapOperatorToAppwrite(operator);
          queries.push(buildQueryString(key, appwriteOperator, operatorValue));
        }
      } else {
        // Simple equality filter
        queries.push(buildQueryString(key, 'equal', value));
      }
    }
    
    return queries;
  };
  
  // Helper function to map common operators to Appwrite's format
  const mapOperatorToAppwrite = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      $eq: 'equal',
      $ne: 'notEqual',
      $lt: 'lessThan',
      $lte: 'lessThanEqual',
      $gt: 'greaterThan',
      $gte: 'greaterThanEqual',
      $contains: 'search',
      $startsWith: 'startsWith',
      $endsWith: 'endsWith',
      $in: 'isIn',
      $notIn: 'notIn',
      $isNull: 'isNull',
      $isNotNull: 'isNotNull'
    };
    
    return operatorMap[operator] || operator.replace('$', '');
  };
  
  // Helper function to build a query string for Appwrite
  const buildQueryString = (key: string, operator: string, value: unknown): string => {
    // Handle special cases for certain operators
    if (operator === 'isNull') {
      return `isNull("${key}")`;
    }
    
    if (operator === 'isNotNull') {
      return `isNotNull("${key}")`;
    }
    
    if (operator === 'isIn' || operator === 'notIn') {
      if (Array.isArray(value)) {
        return `${operator}("${key}", [${value.map(v => JSON.stringify(v)).join(', ')}])`;
      }
      return `${operator}("${key}", [${JSON.stringify(value)}])`;
    }
    
    // Default case
    return `${operator}("${key}", ${JSON.stringify(value)})`;
  };
  
  // Helper function to build sort parameters
  const buildSortParams = (sort?: { field: string; order: string }): string[] => {
    if (!sort) {
      return [];
    }
    
    const order = sort.order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [`orderBy("${sort.field}", "${order}")`];
  };
  
  // Helper function to process list response
  const processListResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Appwrite returns data in a specific format
    const documents = result.documents || [];
    const total = result.total || documents.length;
    
    return { 
      data: documents,
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
    
    return { data: result || {} };
  };
  
  // Extracted helpers for getList
  function buildAppwriteQueries(filter?: Record<string, unknown>, sort?: { field: string; order: string }): string[] {
    return [
      ...buildFilterParams(filter),
      ...buildSortParams(sort)
    ];
  }
  function getPaginationParams(pagination?: { page: number; perPage: number }): { limit: number; offset: number } {
    const limit = pagination?.perPage || 25;
    const offset = pagination ? (pagination.page - 1) * pagination.perPage : 0;
    return { limit, offset };
  }
  function buildAppwriteListUrl(resource: string, limit: number, offset: number, queries: string[]): string {
    const url = new URL(buildUrl({ resource }));
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));
    if (queries.length > 0) {
      url.searchParams.append('queries', JSON.stringify(queries));
    }
    return url.toString();
  }

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const queries = buildAppwriteQueries(filter, sort);
        const { limit, offset } = getPaginationParams(pagination);
        const url = buildAppwriteListUrl(resource, limit, offset, queries);
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
        const response = await fetch(buildUrl({ resource, id: String(id) }), { 
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
          body: JSON.stringify({
            data: variables,
            // Generate a unique ID if not provided
            documentId: (variables as Record<string, unknown>).$id || 'unique()'
          })
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
        const response = await fetch(buildUrl({ resource, id: String(id) }), {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({
            data: variables
          })
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
        const response = await fetch(buildUrl({ resource, id: String(id) }), {
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

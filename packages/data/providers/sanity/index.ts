/**
 * Sanity.io data provider implementation
 * 
 * This provider integrates with Sanity.io (https://github.com/sanity-io/sanity)
 * for content operations using the GROQ query language.
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

export interface SanityProviderConfig {
  /**
   * Sanity project ID
   */
  projectId: string;
  
  /**
   * Sanity dataset (defaults to 'production')
   */
  dataset?: string;
  
  /**
   * Sanity API version (defaults to 'v2021-10-21')
   */
  apiVersion?: string;
  
  /**
   * Sanity token for authenticated requests
   */
  token?: string;
  
  /**
   * Optional CDN flag (defaults to true)
   */
  useCdn?: boolean;
  
  /**
   * Optional mapping of resource names to document types
   * @example { posts: 'post' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a Sanity data provider
 */
export function createSanityProvider(config: SanityProviderConfig): CrudProvider {
  const {
    projectId,
    dataset = 'production',
    apiVersion = 'v2021-10-21',
    token,
    useCdn = true,
    resources = {}
  } = config;
  
  // Helper function to get the document type for a resource
  const getDocumentType = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the API URL
  const buildApiUrl = (): string => {
    const cdnOrApi = useCdn && !token ? 'apicdn' : 'api';
    return `https://${projectId}.${cdnOrApi}.sanity.io/${apiVersion}`;
  };
  
  // Helper function to get request headers
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  // Helper function to build a GROQ filter from a filter object
  const buildGroqFilter = (filter?: Record<string, unknown>): string => {
    if (!filter || Object.keys(filter).length === 0) {
      return '';
    }
    
    const conditions: string[] = [];
    
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
          
          const condition = buildOperatorCondition(key, operator, operatorValue);
          if (condition) {
            conditions.push(condition);
          }
        }
      } else {
        // Simple equality filter
        conditions.push(`${key} == ${JSON.stringify(value)}`);
      }
    }
    
    if (conditions.length === 0) {
      return '';
    }
    
    return conditions.length === 1 
      ? conditions[0] 
      : `(${conditions.join(' && ')})`;
  };
  
  // Helper function to build a condition for an operator
  const buildOperatorCondition = (key: string, operator: string, value: unknown): string => {
    switch (operator) {
      case '$eq':
        return `${key} == ${JSON.stringify(value)}`;
      case '$ne':
        return `${key} != ${JSON.stringify(value)}`;
      case '$lt':
        return `${key} < ${JSON.stringify(value)}`;
      case '$lte':
        return `${key} <= ${JSON.stringify(value)}`;
      case '$gt':
        return `${key} > ${JSON.stringify(value)}`;
      case '$gte':
        return `${key} >= ${JSON.stringify(value)}`;
      case '$contains':
        return `${key} match ${JSON.stringify(`*${value}*`)}`;
      case '$startsWith':
        return `${key} match ${JSON.stringify(`${value}*`)}`;
      case '$endsWith':
        return `${key} match ${JSON.stringify(`*${value}`)}`;
      case '$in':
        if (Array.isArray(value)) {
          return `${key} in [${value.map(v => JSON.stringify(v)).join(', ')}]`;
        }
        return `${key} == ${JSON.stringify(value)}`;
      case '$defined':
        return value ? `defined(${key})` : `!defined(${key})`;
      default:
        return '';
    }
  };
  
  // Helper function to build a GROQ sort expression
  const buildGroqSort = (sort?: { field: string; order: string }): string => {
    if (!sort) {
      return 'order(_createdAt desc)';
    }
    
    const direction = sort.order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    return `order(${sort.field} ${direction})`;
  };
  
  // Helper function to execute a GROQ query
  const executeGroqQuery = async (query: string): Promise<unknown> => {
    const url = new URL(`${buildApiUrl()}/data/query/${dataset}`);
    url.searchParams.append('query', query);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Sanity API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result.result;
  };
  
  // Helper function to execute a mutation
  const executeMutation = async (mutations: unknown[]): Promise<unknown> => {
    const url = `${buildApiUrl()}/data/mutate/${dataset}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mutations })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Sanity API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result.results?.[0]?.document;
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const documentType = getDocumentType(resource);
        const filterExpr = buildGroqFilter(filter);
        const sortExpr = buildGroqSort(sort);
        
        // Build the GROQ query
        let query = `*[_type == "${documentType}"`;
        
        if (filterExpr) {
          query += ` && ${filterExpr}`;
        }
        
        query += `] | ${sortExpr}`;
        
        // Add pagination
        if (pagination) {
          const limit = pagination.perPage;
          const offset = (pagination.page - 1) * pagination.perPage;
          query += `[${offset}...${offset + limit}]`;
        }
        
        // Add count query for total
        const countQuery = `count(*[_type == "${documentType}"${filterExpr ? ` && ${filterExpr}` : ''}])`;
        const fullQuery = `{
          "items": ${query},
          "total": ${countQuery}
        }`;
        
        // Execute query
        const result = await executeGroqQuery(fullQuery) as { items: unknown[]; total: number };
        
        return {
          data: result.items || [],
          total: result.total || 0
        };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        if (!id) {
          throw new Error('ID is required for getOne operation');
        }
        
        const documentType = getDocumentType(resource);
        
        // Build the GROQ query
        const query = `*[_type == "${documentType}" && _id == "${id}"][0]`;
        
        // Execute query
        const result = await executeGroqQuery(query);
        
        if (!result) {
          throw new Error(`Document not found: ${resource}/${id}`);
        }
        
        return { data: result };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        if (!token) {
          throw new Error('Token is required for create operation');
        }
        
        const documentType = getDocumentType(resource);
        
        // Prepare the document
        const document = {
          _type: documentType,
          ...variables
        };
        
        // Execute mutation
        const result = await executeMutation([
          {
            create: document
          }
        ]);
        
        return { data: result || {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        if (!token) {
          throw new Error('Token is required for update operation');
        }
        
        if (!id) {
          throw new Error('ID is required for update operation');
        }
        
        // Prepare the patch
        const patches = Object.entries(variables).map(([key, value]) => ({
          set: { [key]: value }
        }));
        
        // Execute mutation
        const result = await executeMutation([
          {
            patch: {
              id: String(id),
              ...patches.reduce((acc, patch) => ({ ...acc, ...patch }), {})
            }
          }
        ]);
        
        return { data: result || {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        if (!token) {
          throw new Error('Token is required for delete operation');
        }
        
        if (!id) {
          throw new Error('ID is required for delete operation');
        }
        
        // Execute mutation
        await executeMutation([
          {
            delete: {
              id: String(id)
            }
          }
        ]);
        
        // Return empty data object for successful deletion
        return { data: {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

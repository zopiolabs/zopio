/**
 * GraphQL provider implementation
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

export interface GraphQLProviderConfig {
  url: string;
  headers?: Record<string, string>;
  queryMapping?: Record<string, {
    getList?: string;
    getOne?: string;
    create?: string;
    update?: string;
    delete?: string;
  }>;
  resourceMapping?: Record<string, string>; // Maps resource names to GraphQL types
}

/**
 * Create a GraphQL provider
 */
export function createGraphQLProvider(config: GraphQLProviderConfig): CrudProvider {
  const { 
    url, 
    headers = {},
    queryMapping = {},
    resourceMapping = {}
  } = config;

  // Helper to get GraphQL type from resource name
  const getGraphQLType = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Define a type for GraphQL errors
  type GraphQLError = {
    message: string;
    locations?: { line: number; column: number }[];
    path?: string[];
  };

  // Define a type for the response data
  type ResponseData = {
    data: Record<string, unknown>;
    errors?: GraphQLError[];
    [key: string]: unknown;
  };

  // Helper to execute GraphQL queries
  const executeQuery = async (query: string, variables: Record<string, unknown> = {}): Promise<ResponseData> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors.map((e: GraphQLError) => e.message).join(', '));
    }
    
    return result.data;
  };

  // Helper function to process custom query results
  const processCustomQueryResult = (data: Record<string, unknown>, resource: string): GetListResult => {
    // Extract data and total from the response
    const result: {
      items?: unknown[];
      data?: unknown[];
      total?: number;
    } = data[resource] || data[`${resource}s`] || data.result || data;
    
    return { 
      data: result.items || result.data || (Array.isArray(result) ? result : []), 
      total: result.total || (Array.isArray(result) ? result.length : 0) 
    };
  };
  
  // Helper function to create default GraphQL query
  const createDefaultQuery = (type: string): string => {
    return `
      query GetList($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: ${type}Filter) {
        ${type}s(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
          data {
            id
            # This is a placeholder, actual fields would depend on the resource
            # and should be customized for each implementation
            ...${type}Fields
          }
          total
        }
      }
    `;
  };
  
  // Helper function to create variables for GraphQL query
  const createQueryVariables = (pagination?: { page?: number; perPage?: number }, 
                              sort?: { field?: string; order?: string },
                              filter?: Record<string, unknown>): Record<string, unknown> => {
    return {
      page: pagination?.page,
      perPage: pagination?.perPage,
      sortField: sort?.field,
      sortOrder: sort?.order,
      filter
    };
  };

  // Helper function to execute a custom query if available
  const executeCustomQuery = async (
    resource: string,
    pagination?: { page: number; perPage: number },
    sort?: { field: string; order: string },
    filter?: Record<string, unknown>
  ): Promise<{ data: unknown[]; total: number } | null> => {
    const customQuery = queryMapping[resource]?.getList;
    
    if (customQuery) {
      const variables = createQueryVariables(pagination, sort, filter);
      const data = await executeQuery(customQuery, variables);
      return processCustomQueryResult(data, resource);
    }
    
    return null;
  };

  // Helper function to execute a default query
  const executeDefaultQuery = async (
    type: string,
    pagination?: { page: number; perPage: number },
    sort?: { field: string; order: string },
    filter?: Record<string, unknown>
  ): Promise<{ data: unknown[]; total: number }> => {
    const defaultQuery = createDefaultQuery(type);
    const variables = createQueryVariables(pagination, sort, filter);
    const data = await executeQuery(defaultQuery, variables);
    
    // Define the expected response type to avoid TypeScript errors
    interface GraphQLResponse {
      data: unknown[];
      total: number;
    }
    
    // Cast the response data to the expected type
    const responseData = (data[`${type}s`] || {}) as GraphQLResponse;
    return { 
      data: responseData.data || [], 
      total: responseData.total || 0 
    };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const type = getGraphQLType(resource);
        
        // Try to execute a custom query first
        const customResult = await executeCustomQuery(resource, pagination, sort, filter);
        if (customResult) {
          return customResult;
        }
        
        // Fall back to default query
        return await executeDefaultQuery(type, pagination, sort, filter);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const type = getGraphQLType(resource);
        
        // Use custom query if provided
        const customQuery = queryMapping[resource]?.getOne;
        
        if (customQuery) {
          const variables = { id };
          
          const data = await executeQuery(customQuery, variables);
          
          // Extract data from the response
          return { data: data[resource] || data[type] || data };
        }
        
        // Default query if no custom query is provided
        const defaultQuery = `
          query GetOne($id: ID!) {
            ${type}(id: $id) {
              id
              # This is a placeholder, actual fields would depend on the resource
              # and should be customized for each implementation
              ...${type}Fields
            }
          }
        `;
        
        const variables = { id };
        
        const data = await executeQuery(defaultQuery, variables);
        
        return { data: data[type] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const type = getGraphQLType(resource);
        
        // Use custom query if provided
        const customQuery = queryMapping[resource]?.create;
        
        if (customQuery) {
          const data = await executeQuery(customQuery, { input: variables });
          
          // Extract data from the response
          return { data: data[`create${type}`] || data[`create${type.charAt(0).toUpperCase() + type.slice(1)}`] || data };
        }
        
        // Default query if no custom query is provided
        const defaultQuery = `
          mutation Create($input: ${type}Input!) {
            create${type.charAt(0).toUpperCase() + type.slice(1)}(input: $input) {
              id
              # This is a placeholder, actual fields would depend on the resource
              # and should be customized for each implementation
              ...${type}Fields
            }
          }
        `;
        
        const data = await executeQuery(defaultQuery, { input: variables });
        
        return { data: data[`create${type.charAt(0).toUpperCase() + type.slice(1)}`] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const type = getGraphQLType(resource);
        
        // Use custom query if provided
        const customQuery = queryMapping[resource]?.update;
        
        if (customQuery) {
          const data = await executeQuery(customQuery, { id, input: variables });
          
          // Extract data from the response
          return { data: data[`update${type}`] || data[`update${type.charAt(0).toUpperCase() + type.slice(1)}`] || data };
        }
        
        // Default query if no custom query is provided
        const defaultQuery = `
          mutation Update($id: ID!, $input: ${type}Input!) {
            update${type.charAt(0).toUpperCase() + type.slice(1)}(id: $id, input: $input) {
              id
              # This is a placeholder, actual fields would depend on the resource
              # and should be customized for each implementation
              ...${type}Fields
            }
          }
        `;
        
        const data = await executeQuery(defaultQuery, { id, input: variables });
        
        return { data: data[`update${type.charAt(0).toUpperCase() + type.slice(1)}`] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const type = getGraphQLType(resource);
        
        // Get the record before deleting
        const { data: recordToDelete } = await this.getOne({ resource, id });
        
        // Use custom query if provided
        const customQuery = queryMapping[resource]?.delete;
        
        if (customQuery) {
          await executeQuery(customQuery, { id });
          
          return { data: recordToDelete };
        }
        
        // Default query if no custom query is provided
        const defaultQuery = `
          mutation Delete($id: ID!) {
            delete${type.charAt(0).toUpperCase() + type.slice(1)}(id: $id) {
              id
            }
          }
        `;
        
        await executeQuery(defaultQuery, { id });
        
        return { data: recordToDelete };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

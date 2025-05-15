/**
 * SAP provider implementation
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

export interface SAPProviderConfig {
  baseUrl: string;
  username: string;
  password: string;
  client?: string;
  language?: string;
  entityMapping?: Record<string, string>; // Maps resource names to SAP OData entities
}

/**
 * Create a SAP provider
 */
export function createSAPProvider(config: SAPProviderConfig): CrudProvider {
  const { 
    baseUrl, 
    username,
    password,
    client = '100',
    language = 'EN',
    entityMapping = {}
  } = config;

  // Helper to get SAP entity from resource name
  const getSAPEntity = (resource: string): string => {
    return entityMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const entity = getSAPEntity(resource);
    const baseODataUrl = `${baseUrl}/sap/opu/odata/sap/${entity}`;
    return id ? `${baseODataUrl}(${id})` : baseODataUrl;
  };

  // Helper to get authorization header
  const getAuthHeader = (): string => {
    const auth = btoa(`${username}:${password}`);
    return `Basic ${auth}`;
  };

  // Default headers
  const getHeaders = (): Record<string, string> => {
    return {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'sap-client': client,
      'sap-language': language
    };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add $format=json
        url.searchParams.append('$format', 'json');
        
        // Add $filter for OData
        if (filter && Object.keys(filter).length > 0) {
          const filterStrings = [];
          
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              // Handle different types of values
              if (typeof value === 'string') {
                filterStrings.push(`${key} eq '${value}'`);
              } else {
                filterStrings.push(`${key} eq ${value}`);
              }
            }
          }
          
          if (filterStrings.length > 0) {
            url.searchParams.append('$filter', filterStrings.join(' and '));
          }
        }
        
        // Add $orderby for sorting
        if (sort) {
          url.searchParams.append('$orderby', `${sort.field} ${sort.order === 'asc' ? 'asc' : 'desc'}`);
        }
        
        // Add $skip and $top for pagination
        if (pagination) {
          const skip = (pagination.page - 1) * pagination.perPage;
          url.searchParams.append('$skip', String(skip));
          url.searchParams.append('$top', String(pagination.perPage));
          
          // Add $inlinecount to get total
          url.searchParams.append('$inlinecount', 'allpages');
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SAP OData responses typically have a specific structure
        const data = result.d?.results || [];
        
        // Get total count
        let total = data.length;
        if (result.d?.__count) {
          total = parseInt(result.d.__count, 10);
        }
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Build URL
        const url = new URL(buildUrl(resource, id));
        url.searchParams.append('$format', 'json');
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SAP OData responses typically have a specific structure
        const data = result.d || {};
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Build URL
        const url = new URL(buildUrl(resource));
        
        // Create data
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SAP OData responses typically have a specific structure
        const data = result.d || {};
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Build URL
        const url = new URL(buildUrl(resource, id));
        
        // Update data
        const response = await fetch(url.toString(), {
          method: 'PATCH', // Some SAP OData services use MERGE instead of PATCH
          headers: {
            ...getHeaders(),
            'X-HTTP-Method': 'MERGE' // For SAP OData services that require this header
          },
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        // Get updated record
        const { data } = await this.getOne({ resource, id });
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Build URL
        const url = new URL(buildUrl(resource, id));
        
        // Delete data
        const response = await fetch(url.toString(), {
          method: 'DELETE',
          headers: getHeaders()
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

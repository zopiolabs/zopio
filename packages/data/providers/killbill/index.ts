/**
 * KillBill provider implementation
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

export interface KillBillProviderConfig {
  apiUrl: string;
  username: string;
  password: string;
  apiKey?: string;
  apiSecret?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to KillBill resources
}

/**
 * Create a KillBill provider
 */
export function createKillbillProvider(config: KillBillProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    username, 
    password,
    apiKey,
    apiSecret,
    resourceMapping = {
      accounts: 'accounts',
      invoices: 'invoices',
      payments: 'payments',
      subscriptions: 'subscriptions',
      bundles: 'bundles',
      catalogs: 'catalogs',
      tenants: 'tenants'
    }
  } = config;

  // Helper to get KillBill resource from resource name
  const getKillBillResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const killbillResource = getKillBillResource(resource);
    const baseUrl = `${apiUrl}/1.0/kb/${killbillResource}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Basic authentication headers
  const getBasicHeaders = () => {
    const basicAuth = btoa(`${username}:${password}`);
    
    const headers: Record<string, string> = {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (apiKey && apiSecret) {
      headers['X-Killbill-ApiKey'] = apiKey;
      headers['X-Killbill-ApiSecret'] = apiSecret;
    }
    
    return headers;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params if supported
        if (pagination) {
          url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
          url.searchParams.append('limit', String(pagination.perPage));
        }
        
        // Add filter params if supported
        if (filter) {
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              url.searchParams.append(key, String(value));
            }
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getBasicHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Get total count from headers if available
        const totalCount = response.headers.get('X-Killbill-Pagination-TotalNbRecords');
        const total = totalCount ? Number.parseInt(totalCount, 10) : (Array.isArray(data) ? data.length : 0);
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { 
          headers: getBasicHeaders()
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
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers: {
            ...getBasicHeaders(),
            'X-Killbill-CreatedBy': username
          },
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        // KillBill often returns the location of the created resource in the Location header
        const location = response.headers.get('Location');
        
        if (location) {
          // Fetch the created resource
          const createdResponse = await fetch(location, { 
            headers: getBasicHeaders()
          });
          
          if (createdResponse.ok) {
            const data = await createdResponse.json();
            return { data };
          }
        }
        
        // If we can't get the created resource, return the variables with the ID if available
        const data = await response.json();
        return { data: data || variables };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'PUT',
          headers: {
            ...getBasicHeaders(),
            'X-Killbill-UpdatedBy': username
          },
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        // Fetch the updated resource
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
        
        // Delete data
        const response = await fetch(buildUrl(resource, id), {
          method: 'DELETE',
          headers: {
            ...getBasicHeaders(),
            'X-Killbill-CreatedBy': username
          }
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

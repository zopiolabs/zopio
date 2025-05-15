/**
 * Medusa provider implementation
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

// Pre-defined regex patterns for better performance
const trailingS = /s$/;

export interface MedusaProviderConfig {
  apiUrl: string;
  apiKey?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to Medusa resources
}

/**
 * Create a Medusa provider
 */
export function createMedusaProvider(config: MedusaProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey,
    resourceMapping = {
      products: 'products',
      orders: 'orders',
      customers: 'customers',
      collections: 'collections',
      regions: 'regions',
      discounts: 'discounts',
      gift_cards: 'gift-cards',
      carts: 'carts',
      shipping_options: 'shipping-options',
      payments: 'payments'
    }
  } = config;

  // Helper to get Medusa resource from resource name
  const getMedusaResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const medusaResource = getMedusaResource(resource);
    const baseUrl = `${apiUrl}/store/${medusaResource}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    
    return headers;
  };

  return {
    async getList({ resource, pagination, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params
        if (pagination) {
          url.searchParams.append('limit', String(pagination.perPage));
          url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
        }
        
        // Add filter params
        if (filter) {
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              url.searchParams.append(key, String(value));
            }
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Medusa API typically returns data in a specific format
        // e.g. { products: [...], count: 10, offset: 0, limit: 50 }
        const resourceKey = getMedusaResource(resource);
        const data = result[resourceKey] || result.data || [];
        const total = result.count || data.length;
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Medusa API typically returns data in a specific format
        // e.g. { product: {...} }
        const resourceKey = getMedusaResource(resource).replace(trailingS, ''); // Remove trailing 's'
        const data = result[resourceKey] || result;
        
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
          headers: getHeaders(),
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Medusa API typically returns data in a specific format
        // e.g. { product: {...} }
        const resourceKey = getMedusaResource(resource).replace(trailingS, ''); // Remove trailing 's'
        const data = result[resourceKey] || result.data || result;
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'POST', // Medusa uses POST for updates with a primary key
          headers: getHeaders(),
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Medusa API typically returns data in a specific format
        // e.g. { product: {...} }
        const resourceKey = getMedusaResource(resource).replace(trailingS, ''); // Remove trailing 's'
        const data = result[resourceKey] || result.data || result;
        
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

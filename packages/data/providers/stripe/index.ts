/**
 * Stripe provider implementation
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

export interface StripeProviderConfig {
  apiKey: string;
  apiVersion?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to Stripe resources
}

/**
 * Create a Stripe provider
 */
export function createStripeProvider(config: StripeProviderConfig): CrudProvider {
  const { 
    apiKey, 
    apiVersion = '2023-10-16',
    resourceMapping = {
      customers: 'customers',
      products: 'products',
      prices: 'prices',
      subscriptions: 'subscriptions',
      invoices: 'invoices',
      payment_methods: 'payment_methods',
      payment_intents: 'payment_intents',
      charges: 'charges',
      refunds: 'refunds'
    }
  } = config;

  // Helper to get Stripe resource from resource name
  const getStripeResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const stripeResource = getStripeResource(resource);
    const baseUrl = `https://api.stripe.com/v1/${stripeResource}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const getHeaders = (): Record<string, string> => {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': apiVersion
    };
  };

  // Helper to convert object to URL encoded form data
  const objectToFormData = (obj: Record<string, unknown>): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (value === null || value === undefined) {
          return null;
        }
        
        if (typeof value === 'object') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
        }
        
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .filter(Boolean)
      .join('&');
  };

  // Helper functions to build URL parameters
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (!pagination) {
      return;
    }
    
    url.searchParams.append('limit', String(pagination.perPage));
    
    if (pagination.page > 1) {
      // Stripe uses cursor-based pagination
      // This is a simplified approach - in a real implementation,
      // you would need to store and use the 'starting_after' cursor
      const offset = (pagination.page - 1) * pagination.perPage;
      url.searchParams.append('offset', String(offset));
    }
  };

  const addFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
    if (!filter) {
      return;
    }
    
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    }
  };

  return {
    async getList({ resource, pagination, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add parameters
        addPaginationParams(url, pagination);
        addFilterParams(url, filter);
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Stripe returns data in a specific format
        // e.g. { data: [...], has_more: true }
        const data = result.data || [];
        
        // Stripe doesn't provide a total count, so we estimate it
        const total = result.has_more ? data.length * 2 : data.length;
        
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
          headers: getHeaders(),
          body: objectToFormData(variables as Record<string, unknown>)
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
          method: 'POST', // Stripe uses POST for updates
          headers: getHeaders(),
          body: objectToFormData(variables as Record<string, unknown>)
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
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Stripe usually returns { deleted: true, id: '...' }
        return { data: result.deleted ? data : result };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

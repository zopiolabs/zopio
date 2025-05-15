/**
 * Shopify provider implementation
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
const lastPageRegex = /page=(\d+)>; rel="last"/

export interface ShopifyProviderConfig {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to Shopify resources
}

/**
 * Create a Shopify provider
 */
export function createShopifyProvider(config: ShopifyProviderConfig): CrudProvider {
  const { 
    shopDomain, 
    accessToken,
    apiVersion = '2023-10',
    resourceMapping = {
      products: 'products',
      orders: 'orders',
      customers: 'customers',
      collections: 'collections',
      inventory: 'inventory_items',
      fulfillments: 'fulfillments',
      discounts: 'price_rules'
    }
  } = config;

  // Helper to get Shopify resource from resource name
  const getShopifyResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const shopifyResource = getShopifyResource(resource);
    const baseUrl = `https://${shopDomain}/admin/api/${apiVersion}/${shopifyResource}`;
    return id ? `${baseUrl}/${id}.json` : `${baseUrl}.json`;
  };

  // Default headers
  type HeadersType = {
    'X-Shopify-Access-Token': string;
    'Content-Type': string;
  };
  const headers: HeadersType = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json'
  };

  // Helper functions to build URL parameters
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (!pagination) {
      return;
    }
    
    url.searchParams.append('limit', String(pagination.perPage));
    
    if (pagination.page > 1) {
      // Shopify uses page-based pagination
      url.searchParams.append('page', String(pagination.page));
    }
  };

  const addFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
    if (!filter) {
      return;
    }
    
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
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
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Shopify returns data in a specific format
        // e.g. { products: [...] }
        const shopifyResource = getShopifyResource(resource);
        const data = result[shopifyResource] || [];
        
        // Get total count from headers if available
        let total = data.length;
        const linkHeader = response.headers.get('Link');
        
        if (linkHeader) {
          // Parse Link header to get total pages
          const matches = linkHeader.match(lastPageRegex);
          if (matches && pagination) {
            const lastPage = Number.parseInt(matches[1], 10);
            total = lastPage * pagination.perPage;
          }
        }
        
        return { data, total };
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
        
        const result = await response.json();
        
        // Shopify returns data in a specific format
        // e.g. { product: {...} }
        const shopifyResource = getShopifyResource(resource);
        // Remove trailing 's' for singular resource
        const singularResource = shopifyResource.endsWith('s') 
          ? shopifyResource.slice(0, -1) 
          : shopifyResource;
          
        const data = result[singularResource];
        
        if (!data) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Shopify expects a specific format
        // e.g. { product: {...} }
        const shopifyResource = getShopifyResource(resource);
        // Remove trailing 's' for singular resource
        const singularResource = shopifyResource.endsWith('s') 
          ? shopifyResource.slice(0, -1) 
          : shopifyResource;
          
        const body = {
          [singularResource]: variables
        };
        
        // Create data
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Shopify returns data in a specific format
        // e.g. { product: {...} }
        const data = result[singularResource];
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Shopify expects a specific format
        // e.g. { product: {...} }
        const shopifyResource = getShopifyResource(resource);
        // Remove trailing 's' for singular resource
        const singularResource = shopifyResource.endsWith('s') 
          ? shopifyResource.slice(0, -1) 
          : shopifyResource;
          
        const body = {
          [singularResource]: variables
        };
        
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Shopify returns data in a specific format
        // e.g. { product: {...} }
        const data = result[singularResource];
        
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

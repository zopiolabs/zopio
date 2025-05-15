/**
 * n8n provider implementation
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

export interface N8nProviderConfig {
  apiUrl: string;
  apiKey: string;
  webhookPath?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to n8n workflow IDs
}

/**
 * Create an n8n provider
 */
export function createN8nProvider(config: N8nProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey,
    webhookPath = 'webhook',
    resourceMapping = {}
  } = config;

  // Helper to get workflow ID from resource name
  const getWorkflowId = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, operation: string, id?: string | number): string => {
    const workflowId = getWorkflowId(resource);
    const baseUrl = `${apiUrl}/${webhookPath}/${workflowId}`;
    return `${baseUrl}/${operation}${id ? `/${id}` : ''}`;
  };

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': apiKey
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL for the list operation
        const url = buildUrl(resource, 'list');
        
        // Prepare request body with parameters
        const body = {
          pagination,
          sort,
          filter
        };
        
        // Fetch data
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // n8n webhook responses can be customized, but we expect a standard format
        const data = result.data || [];
        const total = result.total || data.length;
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Build URL for the get operation
        const url = buildUrl(resource, 'get', id);
        
        // Fetch data
        const response = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // n8n webhook responses can be customized, but we expect a standard format
        const data = result.data || result;
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Build URL for the create operation
        const url = buildUrl(resource, 'create');
        
        // Create data
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // n8n webhook responses can be customized, but we expect a standard format
        const data = result.data || result;
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Build URL for the update operation
        const url = buildUrl(resource, 'update', id);
        
        // Update data
        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // n8n webhook responses can be customized, but we expect a standard format
        const data = result.data || result;
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Build URL for the delete operation
        const url = buildUrl(resource, 'delete', id);
        
        // Delete data
        const response = await fetch(url, {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // n8n webhook responses can be customized, but we expect a standard format
        const data = result.data || result;
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

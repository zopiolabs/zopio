/**
 * Airtable provider implementation
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

export interface AirtableProviderConfig {
  apiKey: string;
  baseId: string;
  apiVersion?: string;
  tables?: Record<string, string>; // Map resource names to table IDs
}

/**
 * Create an Airtable provider
 */
export function createAirtableProvider(config: AirtableProviderConfig): CrudProvider {
  const { 
    apiKey, 
    baseId, 
    apiVersion = 'v0',
    tables = {}
  } = config;

  // Helper function to get the table ID for a resource
  const getTableId = (resource: string) => {
    return tables[resource] || resource;
  };

  // Helper function to build URLs
  const buildUrl = (resource: string, id?: string) => {
    const tableId = getTableId(resource);
    const baseUrl = `https://api.airtable.com/${apiVersion}/${baseId}/${tableId}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  // Helper function to add pagination parameters to URL
  const addPaginationParams = (
    url: URL,
    pagination?: { page: number; perPage: number }
  ): void => {
    if (pagination) {
      const maxRecords = pagination.perPage;
      const offset = (pagination.page - 1) * pagination.perPage;
      
      url.searchParams.append('maxRecords', String(maxRecords));
      
      if (offset > 0) {
        // Airtable uses offset token instead of page number
        url.searchParams.append('offset', String(offset));
      }
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (
    url: URL,
    sort?: { field: string; order: string }
  ): void => {
    if (sort) {
      const sortParam = JSON.stringify([{
        field: sort.field,
        direction: sort.order === 'asc' ? 'asc' : 'desc'
      }]);
      
      url.searchParams.append('sort', sortParam);
    }
  };

  // Helper function to build filter formula for Airtable
  const buildFilterFormula = (filter?: Record<string, unknown>): string | null => {
    if (!filter || Object.keys(filter).length === 0) {
      return null;
    }
    
    // Airtable uses formula for filtering
    const filterFormulas = Object.entries(filter).map(([field, value]) => {
      if (typeof value === 'string') {
        return `FIND("${value}", {${field}})`;
      }
      return `{${field}} = "${value}"`;
    });
    
    return filterFormulas.join(' AND ');
  };

  // Helper function to transform Airtable records to data objects
  const transformRecords = (data: { records: Array<{ id: string; fields: Record<string, unknown> }>; offset?: string }): {
    data: Record<string, unknown>[];
    total: number;
  } => {
    const records = data.records.map((record) => ({
      id: record.id,
      ...record.fields
    }));
    
    return { 
      data: records,
      total: data.offset ? records.length + Number.parseInt(data.offset, 10) : records.length
    };
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
        const filterFormula = buildFilterFormula(filter);
        if (filterFormula) {
          url.searchParams.append('filterByFormula', filterFormula);
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform and return data
        return transformRecords(data);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, String(id)), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const record = await response.json();
        
        // Transform Airtable record format
        const data = {
          id: record.id,
          ...record.fields
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Airtable expects a specific format
        const body = JSON.stringify({
          records: [
            {
              fields: variables
            }
          ]
        });
        
        // Create data
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
          body
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const record = result.records[0];
        
        // Transform Airtable record format
        const data = {
          id: record.id,
          ...record.fields
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Airtable expects a specific format
        const body = JSON.stringify({
          records: [
            {
              id: String(id),
              fields: variables
            }
          ]
        });
        
        // Update data
        const response = await fetch(buildUrl(resource), {
          method: 'PATCH',
          headers,
          body
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const record = result.records[0];
        
        // Transform Airtable record format
        const data = {
          id: record.id,
          ...record.fields
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the record first to return it after deletion
        const { data: record } = await this.getOne({ resource, id });
        
        // Delete data
        const url = new URL(buildUrl(resource));
        url.searchParams.append('records[]', String(id));
        
        const response = await fetch(url.toString(), {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        return { data: record };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

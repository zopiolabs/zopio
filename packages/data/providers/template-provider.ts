/**
 * Template provider implementation
 * Use this as a starting point for implementing other providers
 */

import type {
  CreateParams,
  CreateResult,
  CrudProvider,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  UpdateResult,
} from '@repo/data-base';

export interface TemplateProviderConfig {
  baseUrl?: string;
  headers?: HeadersInit;
  // Add other configuration options as needed
}

/**
 * Create a template provider
 */
export function createTemplateProvider(
  config: TemplateProviderConfig = {}
): CrudProvider {
  const { baseUrl = '/api', headers = {} } = config;

  // Helper function to build URLs
  const buildUrl = (resource: string, id?: string | number) =>
    `${baseUrl}/${resource}${id ? `/${id}` : ''}`;

  // Helper function to add pagination parameters to URL
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (pagination) {
      url.searchParams.append('page', String(pagination.page));
      url.searchParams.append('per_page', String(pagination.perPage));
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (sort) {
      url.searchParams.append('sort', sort.field);
      url.searchParams.append('order', sort.order);
    }
  };

  // Helper function to add filter parameters to URL
  const addFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }
  };

  // Helper function to process response data
  const processResponseData = (data: unknown): { data: unknown[]; total: number } => {
    return {
      data: Array.isArray(data) ? data : (data as Record<string, unknown>).data as unknown[] || [],
      total: (data as Record<string, unknown>).total as number || (Array.isArray(data) ? data.length : 0),
    };
  };

  return {
    async getList({
      resource,
      pagination,
      sort,
      filter,
    }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource), window.location.origin);

        // Add query parameters
        addPaginationParams(url, pagination);
        addSortParams(url, sort);
        addFilterParams(url, filter);

        // Fetch data
        const response = await fetch(url.toString(), { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${resource}: ${response.statusText}`
          );
        }

        const data = await response.json();
        return processResponseData(data);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${resource}/${id}: ${response.statusText}`
          );
        }

        const data = await response.json();

        return { data: data.data || data };
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
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to create ${resource}: ${response.statusText}`
          );
        }

        const data = await response.json();

        return { data: data.data || data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({
      resource,
      id,
      variables,
    }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to update ${resource}/${id}: ${response.statusText}`
          );
        }

        const data = await response.json();

        return { data: data.data || data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Delete data
        const response = await fetch(buildUrl(resource, id), {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to delete ${resource}/${id}: ${response.statusText}`
          );
        }

        const data = await response.json();

        return { data: data.data || data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
  };
}

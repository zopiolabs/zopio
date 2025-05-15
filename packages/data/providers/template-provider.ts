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

        // Add pagination params
        if (pagination) {
          url.searchParams.append('page', String(pagination.page));
          url.searchParams.append('per_page', String(pagination.perPage));
        }

        // Add sort params
        if (sort) {
          url.searchParams.append('sort', sort.field);
          url.searchParams.append('order', sort.order);
        }

        // Add filter params
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              url.searchParams.append(key, String(value));
            }
          });
        }

        // Fetch data
        const response = await fetch(url.toString(), { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${resource}: ${response.statusText}`
          );
        }

        const data = await response.json();

        return {
          data: Array.isArray(data) ? data : data.data || [],
          total: data.total || (Array.isArray(data) ? data.length : 0),
        };
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

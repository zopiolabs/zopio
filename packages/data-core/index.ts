/**
 * @repo/data-core
 * 
 * Core data utilities for Zopio framework that provides a standardized interface
 * for data operations while allowing developers to use only what they need.
 */

// Common types used across all data modules
export type DataParams = {
  resource: string;
  id?: number | string;
  variables?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export type DataResult<T = unknown> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

export type DataProvider = {
  getOne: (params: DataParams) => Promise<unknown>;
  getList: (params: DataParams) => Promise<unknown[]>;
  create: (params: DataParams) => Promise<unknown>;
  update: (params: DataParams) => Promise<unknown>;
  delete: (params: DataParams) => Promise<unknown>;
};

// Simple fetch-based data provider for basic usage
export const createFetchDataProvider = (apiUrl = '/api'): DataProvider => {
  return {
    async getOne({ resource, id }: DataParams) {
      const res = await fetch(`${apiUrl}/${resource}/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${resource} with id ${id}`);
      }
      return res.json();
    },
    
    async getList({ resource, query }: DataParams) {
      const qs = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : "";
      const res = await fetch(`${apiUrl}/${resource}${qs}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${resource} list`);
      }
      return res.json();
    },
    
    async create({ resource, variables }: DataParams) {
      const res = await fetch(`${apiUrl}/${resource}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      if (!res.ok) {
        throw new Error(`Failed to create ${resource}`);
      }
      return res.json();
    },
    
    async update({ resource, id, variables }: DataParams) {
      const res = await fetch(`${apiUrl}/${resource}/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      if (!res.ok) {
        throw new Error(`Failed to update ${resource} with id ${id}`);
      }
      return res.json();
    },
    
    async delete({ resource, id }: DataParams) {
      const res = await fetch(`${apiUrl}/${resource}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete ${resource} with id ${id}`);
      }
      return res.json();
    },
  };
};

// Default instance with standard configuration
export const dataProvider = createFetchDataProvider();

// Basic mutation utilities
export type MutationFn<TInput, TResult> = (input: TInput) => Promise<TResult>;

export type MutationOptions<TResult> = {
  onSuccess?: (result: TResult) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[]; // keys to invalidate in cache
};

export function createMutation<TInput, TResult>(
  mutationFn: MutationFn<TInput, TResult>,
  options?: MutationOptions<TResult>
) {
  return async (input: TInput): Promise<TResult> => {
    try {
      const result = await mutationFn(input);
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (options?.onError) {
        options.onError(error);
      }
      throw error;
    }
  };
}

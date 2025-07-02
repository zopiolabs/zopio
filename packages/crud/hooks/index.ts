/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
/**
 * @repo/crud-hooks
 *
 * React hooks for CRUD operations that integrate with the engine package.
 * These hooks provide a convenient way to use the CRUD engine in React components.
 * Includes internationalization support with next-intl for client-side translations.
 */

import type { CrudEngine } from '@repo/crud-engine';
import type {
  CreateParams,
  DeleteParams,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from '@repo/data-base';
import { useCallback, useEffect, useState } from 'react';

// This would be imported from the internationalization package in a real implementation
// import { useTranslations } from 'next-intl';

/**
 * Internationalization configuration based on the memory
 */
interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
}

/**
 * Default internationalization configuration
 * Based on the memory: English (en), Turkish (tr), Spanish (es), German (de)
 */
const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'tr', 'es', 'de'],
};

/**
 * Global engine instance for use in hooks
 */
let globalEngine: CrudEngine | null = null;

/**
 * Current internationalization configuration
 */
let i18nConfig: I18nConfig = { ...DEFAULT_I18N_CONFIG };

/**
 * Initialize the CRUD engine for use in hooks
 */
export function initializeCrudEngine(
  engine: CrudEngine,
  config?: Partial<I18nConfig>
): void {
  globalEngine = engine;

  // Set internationalization config from provided config or engine
  if (config) {
    i18nConfig = {
      ...DEFAULT_I18N_CONFIG,
      ...config,
    };
  } else if (engine && typeof engine === 'object') {
    // Try to extract i18n config from engine
    const engineAny = engine as any;
    if (engineAny.defaultLocale || engineAny.supportedLocales) {
      i18nConfig = {
        defaultLocale:
          engineAny.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale,
        supportedLocales:
          engineAny.supportedLocales || DEFAULT_I18N_CONFIG.supportedLocales,
      };
    }
  }
}

/**
 * Hook for accessing the CRUD engine
 */
export function useCrudEngine(): CrudEngine {
  if (!globalEngine) {
    throw new Error(
      'CRUD engine not initialized. Call initializeCrudEngine first.'
    );
  }
  return globalEngine;
}

/**
 * Hook for getting a list of resources
 */
export function useGetList<TData = unknown>(
  resource: string,
  params?: Partial<GetListParams>
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await engine.getList({
        resource,
        ...params,
      } as GetListParams);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [engine, resource, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}

/**
 * Hook for getting a single resource
 */
export function useGetOne<TData = unknown>(
  resource: string,
  id: string | number
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await engine.getOne({
        resource,
        id,
      } as GetOneParams);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [engine, resource, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for creating a resource
 */
export function useCreate<TData = unknown, TVariables = unknown>(
  resource: string
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (variables: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.create({
          resource,
          data: variables,
        } as CreateParams);
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { create, data, loading, error };
}

/**
 * Hook for updating a resource
 */
export function useUpdate<TData = unknown, TVariables = unknown>(
  resource: string
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (id: string | number, variables: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.update({
          resource,
          id,
          data: variables,
        } as UpdateParams);
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { update, data, loading, error };
}

/**
 * Hook for deleting a resource
 */
export function useDelete<TData = unknown>(resource: string) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteOne = useCallback(
    async (id: string | number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.delete({
          resource,
          id,
        } as DeleteParams);
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { deleteOne, data, loading, error };
}

/**
 * Hook for internationalization support in CRUD components
 * This integrates with next-intl for client-side translations
 */
export function useCrudTranslation() {
  // In a real implementation, this would use the internationalization package
  // const t = useTranslations('crud');

  // For now, we'll return a simple implementation that mimics the next-intl API
  // but in a real implementation, this would use the actual next-intl package
  return {
    t: (key: string, params?: Record<string, string>) => {
      // In a real implementation, this would use the next-intl package
      return key;
    },
    locale: i18nConfig.defaultLocale,
    supportedLocales: i18nConfig.supportedLocales,
  };
}

/**
 * Hook for getting a list of resources
 */
export function useGetList<TData = unknown>(
  resource: string,
  params?: Partial<GetListParams>
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await engine.getList({
        resource,
        ...params,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [engine, resource, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}

/**
 * Hook for getting a single resource
 */
export function useGetOne<TData = unknown>(
  resource: string,
  id: string | number
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await engine.getOne({
        resource,
        id,
      });
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [engine, resource, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for creating a resource
 */
export function useCreate<TData = unknown, TVariables = unknown>(
  resource: string
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (variables: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.create({
          resource,
          data: variables,
        });
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { create, data, loading, error };
}

/**
 * Hook for updating a resource
 */
export function useUpdate<TData = unknown, TVariables = unknown>(
  resource: string
) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (id: string | number, variables: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.update({
          resource,
          id,
          data: variables,
        });
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { update, data, loading, error };
}

/**
 * Hook for deleting a resource
 */
export function useDelete<TData = unknown>(resource: string) {
  const engine = useCrudEngine();
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteOne = useCallback(
    async (id: string | number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await engine.delete({
          resource,
          id,
        });
        setData(result.data);
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [engine, resource]
  );

  return { deleteOne, data, loading, error };
}

/**
 * Hook for internationalization support in CRUD components
 */
export function useCrudTranslation() {
  const engine = useCrudEngine();
  const defaultLocale = engine['defaultLocale'] || 'en';
  const supportedLocales = engine['supportedLocales'] || ['en'];

  // This would integrate with the internationalization package
  // For now, we'll return a simple implementation
  return {
    t: (key: string, params?: Record<string, string>) => {
      // In a real implementation, this would use the internationalization package
      return key;
    },
    locale: defaultLocale,
    supportedLocales,
  };
}

/**
 * Export all hooks
 */
export {
  useGetList,
  useGetOne,
  useCreate,
  useUpdate,
  useDelete,
  useCrudEngine,
  useCrudTranslation,
};

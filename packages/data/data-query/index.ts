import { useEffect, useState, useCallback } from "react";
import type { DataProvider } from "@repo/data-core";
import { dataProvider as defaultDataProvider } from "@repo/data-core";

type QueryOptions<TData> = {
  enabled?: boolean;
  initialData?: TData | null;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  dataProvider?: DataProvider;
  refetchInterval?: number;
};

/**
 * Base hook for data queries
 */
export function useQuery<TData>(
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData>
) {
  const {
    enabled = true,
    initialData = null,
    onSuccess,
    onError,
    refetchInterval
  } = options || {};

  const [data, setData] = useState<TData | null>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
    return;
  }
    
    setLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    
    if (enabled) {
      fetchData().catch(() => {});
      
      if (refetchInterval && refetchInterval > 0) {
        intervalId = setInterval(() => {
          fetchData().catch(() => {
            // Errors are handled in the fetchData function
          });
        }, refetchInterval);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, enabled, refetchInterval]);

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching a single resource by ID
 */
export function useGetOne<TData = Record<string, unknown>>(
  resource: string,
  id?: number | string,
  options?: QueryOptions<TData>
) {
  const dp = options?.dataProvider || defaultDataProvider;
  
  return useQuery<TData>(
    () => dp.getOne({ resource, id }) as Promise<TData>,
    options
  );
}

/**
 * Hook for fetching a list of resources
 */
export function useGetList<TData = Record<string, unknown>[]>(
  resource: string,
  query?: Record<string, unknown>,
  options?: QueryOptions<TData>
) {
  const dp = options?.dataProvider || defaultDataProvider;
  
  return useQuery<TData>(
    () => dp.getList({ resource, query }) as Promise<TData>,
    options
  );
}

/**
 * Legacy compatibility for direct query functions
 */
export function useCustomQuery<TData>(
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData>
) {
  return useQuery(queryFn, options);
}

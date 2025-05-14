import { useState, useCallback } from "react";
import type { MutationOptions, DataProvider } from "@repo/data-core";
import { createMutation, dataProvider as defaultDataProvider } from "@repo/data-core";

/**
 * Base hook for data mutations (create, update, delete)
 */
export function useMutation<TInput, TResult>(
  fn: (input: TInput) => Promise<TResult>,
  options?: MutationOptions<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResult | null>(null);
  
  const mutateFn = createMutation(fn, {
    ...options,
    onSuccess: (result) => {
      setData(result);
      options?.onSuccess?.(result);
    },
    onError: (err) => {
      setError(err);
      options?.onError?.(err);
    }
  });

  const mutate = useCallback(async (input: TInput): Promise<TResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mutateFn(input);
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, [mutateFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, data, reset };
}

/**
 * Hook for creating resources
 */
export function useCreate<TVariables = Record<string, unknown>, TResult = unknown>(
  resource: string,
  options?: MutationOptions<TResult> & { dataProvider?: DataProvider }
) {
  const dp = options?.dataProvider || defaultDataProvider;
  
  return useMutation<TVariables, TResult>(
    (variables) => dp.create({ resource, variables }),
    options
  );
}

/**
 * Hook for updating resources
 */
export function useUpdate<TVariables = Record<string, unknown>, TResult = unknown>(
  resource: string,
  id?: number | string,
  options?: MutationOptions<TResult> & { dataProvider?: DataProvider }
) {
  const dp = options?.dataProvider || defaultDataProvider;
  
  return useMutation<TVariables, TResult>(
    (variables) => dp.update({ resource, id, variables }),
    options
  );
}

/**
 * Hook for deleting resources
 */
export function useDelete<TResult = unknown>(
  resource: string,
  options?: MutationOptions<TResult> & { dataProvider?: DataProvider }
) {
  const dp = options?.dataProvider || defaultDataProvider;
  
  return useMutation<number | string, TResult>(
    (id) => dp.delete({ resource, id }),
    options
  );
}

/**
 * Legacy compatibility for direct mutation functions
 */
export function useCustomMutation<TInput, TResult>(
  fn: (input: TInput) => Promise<TResult>,
  options?: MutationOptions<TResult>
) {
  return useMutation(fn, options);
}

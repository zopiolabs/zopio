/**
 * Mutation utilities for data operations
 * Migrated from the old data-core module
 */

/**
 * Basic mutation function type
 */
export type MutationFn<TInput = unknown, TResult = unknown> = (input: TInput) => Promise<TResult>;

/**
 * Options for mutation operations
 */
export interface MutationOptions<TResult = unknown> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

/**
 * Result of a mutation operation
 */
export interface MutationResult<TInput = unknown, TResult = unknown> {
  data: TResult | null;
  error: Error | null;
  loading: boolean;
  mutate: <T extends TInput>(input: T) => Promise<TResult>;
}

/**
 * Creates a mutation function with lifecycle hooks
 */
export function createMutation<TInput = unknown, TResult = unknown>(
  mutationFn: MutationFn<TInput, TResult>,
  options: MutationOptions<TResult> = {}
): MutationResult<TInput, TResult> {
  const { onSuccess, onError, invalidateQueries } = options;
  
  const mutate = async <T extends TInput>(input: T): Promise<TResult> => {
    try {
      const result = await mutationFn(input);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (invalidateQueries && invalidateQueries.length > 0) {
        // In a real implementation, this would trigger cache invalidation
        // Queries to invalidate: ${invalidateQueries.join(', ')}
      }
      
      return result;
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  };
  
  return {
    data: null,
    error: null,
    loading: false,
    mutate
  };
}

/**
 * Optimistic update utilities
 */
export interface OptimisticUpdateOptions<TData = unknown, TInput = unknown> {
  currentData: TData;
  input: TInput;
  updateFn: (current: TData, input: TInput) => TData;
  rollbackFn?: (current: TData) => TData;
}

/**
 * Performs an optimistic update on client-side data
 */
export function optimisticUpdate<TData = unknown, TInput = unknown, TResult = unknown>(
  options: OptimisticUpdateOptions<TData, TInput>,
  mutationFn: MutationFn<TInput, TResult>
): Promise<TResult> {
  const { currentData, input, updateFn, rollbackFn } = options;
  
  // Apply optimistic update
  const optimisticData = updateFn(currentData, input);
  
  // Return updated data immediately (in a real implementation)
  // Optimistic update has been applied
  
  // Execute actual mutation
  return mutationFn(input).catch(error => {
    // Rollback on error
    if (rollbackFn) {
      // Apply rollback function
      rollbackFn(optimisticData);
      // Optimistic update has been rolled back
    }
    throw error;
  });
}

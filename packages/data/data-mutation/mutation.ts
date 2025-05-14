export type MutationFn<TInput, TResult> = (input: TInput) => Promise<TResult>;

type MutationOptions<TResult> = {
  onSuccess?: (result: TResult) => void;
  onError?: (error: Error) => void;
  invalidateKeys?: string[]; // optionally pass cache keys to invalidate
};

export function createMutation<TInput, TResult>(
  mutationFn: MutationFn<TInput, TResult>,
  options?: MutationOptions<TResult>
) {
  return async (input: TInput): Promise<TResult> => {
    try {
      const result = await mutationFn(input);
      if (options?.onSuccess) options.onSuccess(result);
      // revalidate logic or cache invalidation can go here
      return result;
    } catch (err) {
      if (options?.onError) options.onError(err as Error);
      throw err;
    }
  };
}

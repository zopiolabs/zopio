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
declare module 'swr' {
  export interface SWRResponse<Data = unknown, Error = unknown> {
    data?: Data;
    error?: Error;
    mutate: (
      data?: Data,
      shouldRevalidate?: boolean
    ) => Promise<Data | undefined>;
    isValidating: boolean;
  }

  export default function useSWR<Data = unknown, Error = unknown>(
    key: string | null | undefined,
    fetcher?: (key: string) => Promise<Data>,
    options?: {
      suspense?: boolean;
      refreshInterval?: number;
      refreshWhenHidden?: boolean;
      refreshWhenOffline?: boolean;
      revalidateOnFocus?: boolean;
      revalidateOnMount?: boolean;
      revalidateOnReconnect?: boolean;
      dedupingInterval?: number;
      focusThrottleInterval?: number;
      loadingTimeout?: number;
      errorRetryInterval?: number;
      errorRetryCount?: number;
      shouldRetryOnError?: boolean;
      onLoadingSlow?: (key: string, config: Record<string, unknown>) => void;
      onSuccess?: (
        data: Data,
        key: string,
        config: Record<string, unknown>
      ) => void;
      onError?: (
        err: Error,
        key: string,
        config: Record<string, unknown>
      ) => void;
      onErrorRetry?: (
        err: Error,
        key: string,
        config: Record<string, unknown>,
        revalidate: () => Promise<unknown>,
        revalidateOpts: Record<string, unknown>
      ) => void;
      compare?: (a: Data | undefined, b: Data | undefined) => boolean;
    }
  ): SWRResponse<Data, Error>;
}

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
 * Custom type declarations for React hooks to fix TypeScript errors
 */
declare module 'react' {
  /**
   * Extended useCallback hook with better type support
   */
  export function useCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps: React.DependencyList
  ): T;

  /**
   * Specific overload for string parameter callbacks
   */
  export function useCallback<T extends (param: string) => void>(
    callback: T,
    deps: React.DependencyList
  ): T;
}

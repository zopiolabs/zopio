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
import type * as React from 'react';
/**
 * Custom type declarations for React hooks to fix TypeScript errors
 */
import type { FormField } from '../hooks/useSchemaState';

declare module 'react' {
  /**
   * Extended useCallback hook with better type support for FormField
   */
  export function useCallback<T extends (field: FormField) => void>(
    callback: T,
    deps: React.DependencyList
  ): T;

  /**
   * Extended useCallback hook for field updates
   */
  export function useCallback<
    T extends (name: string, updates: Partial<FormField>) => void,
  >(callback: T, deps: React.DependencyList): T;

  // Add React.DragEvent type
  export interface DragEvent<T = Element> extends React.MouseEvent<T> {
    dataTransfer: DataTransfer;
  }
}

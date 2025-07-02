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
declare module 'next/dynamic' {
  import type { ComponentType } from 'react';

  export interface DynamicOptions {
    loading?: ComponentType;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicImport: () => Promise<{ default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
}

declare module 'react-monaco-editor' {
  import type { ComponentType } from 'react';

  export interface MonacoEditorProps {
    width?: string | number;
    height?: string | number;
    value?: string;
    defaultValue?: string;
    language?: string;
    theme?: string;
    options?: object;
    onChange?: (value: string) => void;
    editorDidMount?: (editor: any, monaco: any) => void;
    editorWillMount?: (monaco: any) => void;
    className?: string;
  }

  const MonacoEditor: ComponentType<MonacoEditorProps>;
  export default MonacoEditor;
}

declare module '@repo/view/engine/validation/schema' {
  export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
  }

  export function safeValidateViewSchema<T>(
    schema: unknown
  ): ValidationResult<T>;
}

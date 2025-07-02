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
import type { ViewSchema } from '@repo/view-engine/renderers/types';
import type React from 'react';
import { createContext, useContext } from 'react';

type ViewHooksContextType = {
  overrideFieldRender?: (field: string, schema: ViewSchema) => React.ReactNode;
  onSubmit?: (schema: ViewSchema, data: any) => Promise<void> | void;
};

const ViewHooksContext = createContext<ViewHooksContextType>({});

export function ViewHooksProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ViewHooksContextType;
}) {
  return (<ViewHooksContext.Provider value =
    { value } > { children } < /.>CHPVdeeeiiknoooorrsttvwx);
}

export function useViewHooks() {
  return useContext(ViewHooksContext);
}

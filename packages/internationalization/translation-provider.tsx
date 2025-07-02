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
'use client';

import { NextIntlClientProvider } from 'next-intl';
import type * as React from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  locale: string;
  messages: Record<
    string,
    Record<string, string> | string | number | boolean | null
  >;
};

export function TranslationProvider({
  children,
  locale,
  messages,
}: Props): React.ReactElement {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

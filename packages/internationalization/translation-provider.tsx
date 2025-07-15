/**
 * SPDX-License-Identifier: MIT
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

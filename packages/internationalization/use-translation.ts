/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { useTranslations as useIntlTranslations } from 'next-intl';

type TranslationResult = {
  t: ReturnType<typeof useIntlTranslations>;
};

export const useTranslation = (namespace: string): TranslationResult => {
  const t = useIntlTranslations(namespace);
  return { t };
};

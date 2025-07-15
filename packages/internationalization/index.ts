/**
 * SPDX-License-Identifier: MIT
 */

import 'server-only';
import type en from './dictionaries/en.json';
import languine from './languine.json';

export { useTranslation } from './use-translation';
export { TranslationProvider } from './translation-provider';
export { loadLocaleMessages } from './load-locale-messages';
export { i18nConfig } from './i18n-config';

export const locales = [
  languine.locale.source,
  ...languine.locale.targets,
] as const;

export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;

const dictionaries: Record<string, () => Promise<Dictionary>> =
  Object.fromEntries(
    locales.map((locale) => [
      locale,
      () =>
        import(`./dictionaries/${locale}.json`)
          .then((mod) => mod.default)
          .catch(() => {
            // Fallback to English dictionary
            return import('./dictionaries/en.json').then((mod) => mod.default);
          }),
    ])
  );

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const normalizedLocale = locale.split('-')[0];

  // Type assertion to check if the normalized locale is in our supported locales
  if (!locales.includes(normalizedLocale as Locale)) {
    // Silently fall back to English
    return dictionaries.en();
  }

  try {
    return await dictionaries[normalizedLocale]();
  } catch {
    // Fallback to English dictionary on error
    return dictionaries.en();
  }
};

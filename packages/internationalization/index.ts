import 'server-only';
import type en from './dictionaries/en.json';
import languine from './languine.json';

// Re-export formatters
export * from './formatters';

export const locales = [
  languine.locale.source,
  ...languine.locale.targets,
] as const;

export type Dictionary = typeof en;

// Create a logger that can be disabled in production
const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
  },
  warn: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }
};

const dictionaries: Record<string, () => Promise<Dictionary>> =
  Object.fromEntries(
    locales.map((locale) => [
      locale,
      () =>
        import(`./dictionaries/${locale}.json`)
          .then((mod) => mod.default)
          .catch((err) => {
            logger.error(
              `Failed to load dictionary for locale: ${locale}`,
              err
            );
            return import('./dictionaries/en.json').then((mod) => mod.default);
          }),
    ])
  );

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const normalizedLocale = locale.split('-')[0];
  const defaultLocale = 'en';

  // Check if the locale is supported
  if (!locales.includes(normalizedLocale as (typeof locales)[number])) {
    logger.warn(`Locale "${locale}" is not supported, defaulting to "${defaultLocale}"`);
    return dictionaries[defaultLocale]();
  }

  try {
    return await dictionaries[normalizedLocale]();
  } catch (error) {
    logger.error(
      `Error loading dictionary for locale "${normalizedLocale}", falling back to "${defaultLocale}"`,
      error
    );
    return dictionaries[defaultLocale]();
  }
};

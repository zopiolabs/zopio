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
interface I18nConfigOptions {
  defaultLocale?: string;
  locales?: string[];
}

export default function i18nConfigTemplate(
  options: I18nConfigOptions = {}
): string {
  const { defaultLocale = 'en', locales = ['en', 'tr', 'es', 'de'] } = options;

  return `export const i18nConfig = {
  defaultLocale: '${defaultLocale}',
  locales: ${JSON.stringify(locales)},
  localeDetection: true
};
`;
}

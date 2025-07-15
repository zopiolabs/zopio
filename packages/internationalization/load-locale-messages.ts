/**
 * SPDX-License-Identifier: MIT
 */

export const loadLocaleMessages = async (locale: string) => {
  const messages = await import(`./locales/${locale}.json`).then(
    (m) => m.default
  );
  return messages;
};

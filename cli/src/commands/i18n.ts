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
import fs from 'node:fs';
import path from 'node:path';
// Use ES module import for commander
import { Command } from 'commander';
import i18nConfigTemplate from '../templates/i18n-config';
import translationTemplate from '../templates/translation';
import { createFile, getI18nConfig, logger } from '../utils/helpers';

// Define supported locales based on the internationalization package
const SUPPORTED_LOCALES = ['en', 'tr', 'es', 'de'];

interface I18nCommandOptions {
  add?: string;
  list?: boolean;
  extract?: boolean;
  create?: string;
  validate?: boolean;
  sync?: boolean;
  setup?: boolean;
}

// @ts-expect-error: Command is imported as a type but used as a value
export const i18nCommand = new Command()
  .name('i18n')
  .description('Manage internationalization for your Zopio project')
  .option('-a, --add <locale>', 'Add a new locale')
  .option('-l, --list', 'List all available locales')
  .option('-e, --extract', 'Extract translation keys from project')
  .option('-c, --create <namespace>', 'Create a new translation namespace')
  .option('-v, --validate', 'Validate translation files for missing keys')
  .option('-s, --sync', 'Synchronize translation files across locales')
  .option('--setup', 'Set up internationalization for a new project')
  .action(async (options: I18nCommandOptions) => {
    const cwd = process.cwd();
    const i18nConfig = getI18nConfig(cwd);

    if (options.list) {
      logger.title('Available Locales');
      for (const locale of i18nConfig.locales) {
        logger.info(`- ${locale}`);
      }

      logger.info(`\nDefault locale: ${i18nConfig.defaultLocale}`);
      return;
    }

    if (options.add) {
      const newLocale = options.add.toLowerCase();

      if (i18nConfig.locales.includes(newLocale)) {
        logger.warning(`Locale '${newLocale}' already exists.`);
        return;
      }

      // Add to i18nConfig.ts
      const i18nConfigPath = path.join(cwd, 'i18nConfig.ts');
      if (fs.existsSync(i18nConfigPath)) {
        try {
          const content = fs.readFileSync(i18nConfigPath, 'utf8');
          const updatedContent = content.replace(
            /locales:\s*\[(.*)\]/s,
            (match, localesStr) => {
              const locales = localesStr
                .split(',')
                .map((l: string) => l.trim());
              locales.push(`'${newLocale}'`);
              return `locales: [${locales.join(', ')}]`;
            }
          );

          fs.writeFileSync(i18nConfigPath, updatedContent);
        } catch (error) {
          logger.error(
            `Failed to update i18nConfig.ts: ${(error as Error).message}`
          );
        }
      } else {
        // Create new i18nConfig.ts
        const newConfig = i18nConfigTemplate({
          defaultLocale: i18nConfig.defaultLocale,
          locales: [...i18nConfig.locales, newLocale],
        });
        createFile(i18nConfigPath, newConfig);
      }

      // Create locale directories and files
      const dictionariesDir = path.join(cwd, 'dictionaries');
      const localesDir = path.join(cwd, 'locales');

      // Create in dictionaries directory (for next-international)
      if (fs.existsSync(dictionariesDir)) {
        const newLocaleDir = path.join(dictionariesDir, newLocale);
        if (!fs.existsSync(newLocaleDir)) {
          fs.mkdirSync(newLocaleDir, { recursive: true });

          // Copy common.json from default locale if it exists
          const defaultCommonPath = path.join(
            dictionariesDir,
            i18nConfig.defaultLocale,
            'common.json'
          );
          if (fs.existsSync(defaultCommonPath)) {
            const newCommonPath = path.join(newLocaleDir, 'common.json');
            fs.copyFileSync(defaultCommonPath, newCommonPath);
          } else {
            // Create a new common.json
            createFile(
              path.join(newLocaleDir, 'common.json'),
              translationTemplate('common', newLocale)
            );
          }
        }
      }

      // Create in locales directory (for next-intl)
      if (fs.existsSync(localesDir)) {
        const newLocalePath = path.join(localesDir, `${newLocale}.json`);
        if (!fs.existsSync(newLocalePath)) {
          // Copy from default locale if it exists
          const defaultLocalePath = path.join(
            localesDir,
            `${i18nConfig.defaultLocale}.json`
          );
          if (fs.existsSync(defaultLocalePath)) {
            fs.copyFileSync(defaultLocalePath, newLocalePath);
          } else {
            // Create a new locale file
            createFile(
              newLocalePath,
              JSON.stringify(
                {
                  common: JSON.parse(translationTemplate('common', newLocale)),
                },
                null,
                2
              )
            );
          }
        }
      }

      logger.success(`Added new locale: ${newLocale}`);
      return;
    }

    if (options.create?.trim()) {
      const namespace = options.create?.trim().toLowerCase();

      // Create translations for each locale
      for (const locale of i18nConfig.locales) {
        // For dictionaries directory (next-international)
        const dictionariesDir = path.join(cwd, 'dictionaries');
        if (fs.existsSync(dictionariesDir)) {
          const localeDir = path.join(dictionariesDir, locale);
          if (!fs.existsSync(localeDir)) {
            fs.mkdirSync(localeDir, { recursive: true });
          }

          const namespacePath = path.join(localeDir, `${namespace}.json`);
          if (!fs.existsSync(namespacePath)) {
            createFile(namespacePath, translationTemplate(namespace, locale));
          }
        }

        // For locales directory (next-intl)
        const localesDir = path.join(cwd, 'locales');
        if (fs.existsSync(localesDir)) {
          const localePath = path.join(localesDir, `${locale}.json`);
          if (fs.existsSync(localePath)) {
            try {
              const localeData = JSON.parse(
                fs.readFileSync(localePath, 'utf8')
              );
              if (!localeData?.[namespace]) {
                localeData[namespace] = JSON.parse(
                  translationTemplate(namespace, locale)
                );
                fs.writeFileSync(
                  localePath,
                  JSON.stringify(localeData, null, 2)
                );
              }
            } catch (error) {
              logger.error(
                `Failed to update ${locale}.json: ${(error as Error).message}`
              );
            }
          } else {
            createFile(
              localePath,
              JSON.stringify(
                {
                  [namespace]: JSON.parse(
                    translationTemplate(namespace, locale)
                  ),
                },
                null,
                2
              )
            );
          }
        }
      }

      logger.success(`Created translation namespace: ${namespace}`);
      return;
    }

    if (options.extract) {
      logger.info('Extracting translation keys from project...');
      extractTranslationKeys(cwd);
      return;
    }

    if (options.validate) {
      logger.info('Validating translation files...');
      validateTranslations(cwd, i18nConfig);
      return;
    }

    if (options.sync) {
      logger.info('Synchronizing translation files...');
      syncTranslations(cwd, i18nConfig);
      return;
    }

    if (options.setup) {
      logger.info('Setting up internationalization for your project...');
      setupI18n(cwd);
      return;
    }

    // If no options provided, show help
    i18nCommand.help();
  });

/**
 * Extract translation keys from project files
 * @param projectDir Project directory
 */
function extractTranslationKeys(projectDir: string): void {
  try {
    // Find all JavaScript and TypeScript files in the project
    const srcDir = path.join(projectDir, 'src');
    if (!fs.existsSync(srcDir)) {
      logger.error(`Source directory not found: ${srcDir}`);
      return;
    }

    logger.info('Scanning source files for translation keys...');

    // This is a simplified implementation
    // In a real implementation, you would use a parser to extract keys from t() and similar functions
    logger.info('Found 0 translation keys.');
    logger.info(
      'This feature requires a more complex implementation with AST parsing.'
    );
  } catch (error) {
    logger.error(
      `Error extracting translation keys: ${(error as Error).message}`
    );
  }
}

/**
 * Validate translation files for missing keys
 * @param projectDir Project directory
 * @param i18nConfig Internationalization configuration
 */
function validateTranslations(
  projectDir: string,
  i18nConfig: { defaultLocale: string; locales: string[] }
): void {
  try {
    const { defaultLocale, locales } = i18nConfig;
    const dictionariesDir = path.join(projectDir, 'dictionaries');
    const localesDir = path.join(projectDir, 'locales');

    let missingKeys = 0;

    // Check dictionaries directory (for next-international)
    if (fs.existsSync(dictionariesDir)) {
      const defaultLocaleDir = path.join(dictionariesDir, defaultLocale);
      if (!fs.existsSync(defaultLocaleDir)) {
        logger.error(`Default locale directory not found: ${defaultLocaleDir}`);
        return;
      }

      const namespaceFiles = fs
        .readdirSync(defaultLocaleDir)
        .filter((file) => file.endsWith('.json'));

      for (const namespace of namespaceFiles) {
        const defaultNamespacePath = path.join(defaultLocaleDir, namespace);
        const defaultTranslations = JSON.parse(
          fs.readFileSync(defaultNamespacePath, 'utf8')
        );

        for (const locale of locales) {
          if (locale === defaultLocale) {
            continue;
          }

          const localeNamespacePath = path.join(
            dictionariesDir,
            locale,
            namespace
          );
          if (!fs.existsSync(localeNamespacePath)) {
            logger.error(`Missing namespace file: ${localeNamespacePath}`);
            missingKeys += Object.keys(defaultTranslations).length;
            continue;
          }

          const localeTranslations = JSON.parse(
            fs.readFileSync(localeNamespacePath, 'utf8')
          );

          for (const key of Object.keys(defaultTranslations)) {
            if (!localeTranslations[key]) {
              logger.warning(`Missing key '${key}' in ${locale}/${namespace}`);
              missingKeys++;
            }
          }
        }
      }
    }

    // Check locales directory (for next-intl)
    if (fs.existsSync(localesDir)) {
      const defaultLocalePath = path.join(localesDir, `${defaultLocale}.json`);
      if (!fs.existsSync(defaultLocalePath)) {
        logger.error(`Default locale file not found: ${defaultLocalePath}`);
        return;
      }

      const defaultTranslations = JSON.parse(
        fs.readFileSync(defaultLocalePath, 'utf8')
      );

      for (const locale of locales) {
        if (locale === defaultLocale) {
          continue;
        }

        const localePath = path.join(localesDir, `${locale}.json`);
        if (!fs.existsSync(localePath)) {
          logger.error(`Missing locale file: ${localePath}`);
          missingKeys += countKeysRecursive(defaultTranslations);
          continue;
        }

        const localeTranslations = JSON.parse(
          fs.readFileSync(localePath, 'utf8')
        );

        missingKeys += validateNestedKeys(
          defaultTranslations,
          localeTranslations,
          locale
        );
      }
    }

    if (missingKeys === 0) {
      logger.success('All translations are complete!');
    } else {
      logger.warning(`Found ${missingKeys} missing translation keys.`);
    }
  } catch (error) {
    logger.error(`Error validating translations: ${(error as Error).message}`);
  }
}

/**
 * Count keys recursively in a nested object
 * @param obj Object to count keys in
 * @returns Number of keys
 */
function countKeysRecursive(obj: Record<string, unknown>): number {
  let count = 0;

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeysRecursive(obj[key] as Record<string, unknown>);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Validate nested keys in translation objects
 * @param defaultObj Default locale translations
 * @param localeObj Locale translations to validate
 * @param locale Locale code
 * @param prefix Key prefix for nested objects
 * @returns Number of missing keys
 */
function validateNestedKeys(
  defaultObj: Record<string, unknown>,
  localeObj: Record<string, unknown>,
  locale: string,
  prefix = ''
): number {
  let missingKeys = 0;

  for (const key of Object.keys(defaultObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof defaultObj[key] === 'object' && defaultObj[key] !== null) {
      if (!localeObj[key] || typeof localeObj[key] !== 'object') {
        logger.warning(`Missing namespace '${fullKey}' in ${locale}.json`);
        missingKeys += countKeysRecursive(
          defaultObj[key] as Record<string, unknown>
        );
      } else {
        missingKeys += validateNestedKeys(
          defaultObj[key] as Record<string, unknown>,
          localeObj[key] as Record<string, unknown>,
          locale,
          fullKey
        );
      }
    } else if (!localeObj[key]) {
      logger.warning(`Missing key '${fullKey}' in ${locale}.json`);
      missingKeys++;
    }
  }

  return missingKeys;
}

/**
 * Synchronize translation files across locales
 * @param projectDir Project directory
 * @param i18nConfig Internationalization configuration
 */
function syncTranslations(
  projectDir: string,
  i18nConfig: { defaultLocale: string; locales: string[] }
): void {
  try {
    const { defaultLocale, locales } = i18nConfig;
    const dictionariesDir = path.join(projectDir, 'dictionaries');
    const localesDir = path.join(projectDir, 'locales');

    // Sync dictionaries directory (for next-international)
    if (fs.existsSync(dictionariesDir)) {
      const defaultLocaleDir = path.join(dictionariesDir, defaultLocale);
      if (!fs.existsSync(defaultLocaleDir)) {
        logger.error(`Default locale directory not found: ${defaultLocaleDir}`);
        return;
      }

      const namespaceFiles = fs
        .readdirSync(defaultLocaleDir)
        .filter((file) => file.endsWith('.json'));

      for (const namespace of namespaceFiles) {
        const defaultNamespacePath = path.join(defaultLocaleDir, namespace);
        const defaultTranslations = JSON.parse(
          fs.readFileSync(defaultNamespacePath, 'utf8')
        );

        for (const locale of locales) {
          if (locale === defaultLocale) {
            continue;
          }

          const localeDir = path.join(dictionariesDir, locale);
          if (!fs.existsSync(localeDir)) {
            fs.mkdirSync(localeDir, { recursive: true });
          }

          const localeNamespacePath = path.join(localeDir, namespace);

          if (fs.existsSync(localeNamespacePath)) {
            // Update existing namespace file
            const localeTranslations = JSON.parse(
              fs.readFileSync(localeNamespacePath, 'utf8')
            );
            let updated = false;

            for (const key of Object.keys(defaultTranslations)) {
              if (!localeTranslations[key]) {
                localeTranslations[key] =
                  `[${locale}] ${defaultTranslations[key]}`;
                updated = true;
              }
            }

            if (updated) {
              fs.writeFileSync(
                localeNamespacePath,
                JSON.stringify(localeTranslations, null, 2)
              );
              logger.info(`Updated ${locale}/${namespace}`);
            }
          } else {
            // Create new namespace file
            createFile(
              localeNamespacePath,
              translationTemplate(namespace.replace('.json', ''), locale)
            );
            logger.info(`Created ${locale}/${namespace}`);
          }
        }
      }
    }

    // Sync locales directory (for next-intl)
    if (fs.existsSync(localesDir)) {
      const defaultLocalePath = path.join(localesDir, `${defaultLocale}.json`);
      if (!fs.existsSync(defaultLocalePath)) {
        logger.error(`Default locale file not found: ${defaultLocalePath}`);
        return;
      }

      const defaultTranslations = JSON.parse(
        fs.readFileSync(defaultLocalePath, 'utf8')
      );

      for (const locale of locales) {
        if (locale === defaultLocale) {
          continue;
        }

        const localePath = path.join(localesDir, `${locale}.json`);

        if (fs.existsSync(localePath)) {
          // Update existing locale file
          const localeTranslations = JSON.parse(
            fs.readFileSync(localePath, 'utf8')
          );
          let updated = false;

          for (const namespace of Object.keys(defaultTranslations)) {
            if (localeTranslations[namespace]) {
              updated =
                syncNestedKeys(
                  defaultTranslations[namespace],
                  localeTranslations[namespace],
                  locale
                ) || updated;
            } else {
              localeTranslations[namespace] = JSON.parse(
                translationTemplate(namespace, locale)
              );
              updated = true;
            }
          }

          if (updated) {
            fs.writeFileSync(
              localePath,
              JSON.stringify(localeTranslations, null, 2)
            );
            logger.info(`Updated ${locale}.json`);
          }
        } else {
          // Create new locale file
          const newTranslations: Record<string, unknown> = {};

          for (const namespace of Object.keys(defaultTranslations)) {
            newTranslations[namespace] = JSON.parse(
              translationTemplate(namespace, locale)
            );
          }

          createFile(localePath, JSON.stringify(newTranslations, null, 2));
          logger.info(`Created ${locale}.json`);
        }
      }
    }

    logger.success('Translation files synchronized successfully!');
  } catch (error) {
    logger.error(
      `Error synchronizing translations: ${(error as Error).message}`
    );
  }
}

/**
 * Synchronize nested keys in translation objects
 * @param defaultObj Default locale translations
 * @param localeObj Locale translations to update
 * @param locale Locale code
 * @returns Whether any keys were updated
 */
function syncNestedKeys(
  defaultObj: Record<string, unknown>,
  localeObj: Record<string, unknown>,
  locale: string
): boolean {
  let updated = false;

  for (const key of Object.keys(defaultObj)) {
    if (typeof defaultObj[key] === 'object' && defaultObj[key] !== null) {
      if (!localeObj[key] || typeof localeObj[key] !== 'object') {
        localeObj[key] = {} as Record<string, unknown>;
        updated = true;
      }

      updated =
        syncNestedKeys(
          defaultObj[key] as Record<string, unknown>,
          localeObj[key] as Record<string, unknown>,
          locale
        ) || updated;
    } else if (!localeObj[key]) {
      localeObj[key] = `[${locale}] ${String(defaultObj[key])}`;
      updated = true;
    }
  }

  return updated;
}

/**
 * Set up internationalization for a new project
 * @param projectDir Project directory
 */
function setupI18n(projectDir: string): void {
  try {
    // Create i18nConfig.ts
    const i18nConfigPath = path.join(projectDir, 'i18nConfig.ts');
    if (!fs.existsSync(i18nConfigPath)) {
      createFile(
        i18nConfigPath,
        i18nConfigTemplate({
          defaultLocale: 'en',
          locales: SUPPORTED_LOCALES,
        })
      );
      logger.success('Created i18nConfig.ts');
    }

    // Create dictionaries directory (for next-international)
    const dictionariesDir = path.join(projectDir, 'dictionaries');
    if (!fs.existsSync(dictionariesDir)) {
      fs.mkdirSync(dictionariesDir, { recursive: true });
      logger.info('Created dictionaries directory');

      // Create locale directories and common.json files
      for (const locale of SUPPORTED_LOCALES) {
        const localeDir = path.join(dictionariesDir, locale);
        fs.mkdirSync(localeDir, { recursive: true });

        createFile(
          path.join(localeDir, 'common.json'),
          translationTemplate('common', locale)
        );
        logger.info(`Created ${locale}/common.json`);
      }
    }

    // Create locales directory (for next-intl)
    const localesDir = path.join(projectDir, 'locales');
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
      logger.info('Created locales directory');

      // Create locale files
      for (const locale of SUPPORTED_LOCALES) {
        createFile(
          path.join(localesDir, `${locale}.json`),
          JSON.stringify(
            { common: JSON.parse(translationTemplate('common', locale)) },
            null,
            2
          )
        );
        logger.info(`Created ${locale}.json`);
      }
    }

    // Create languine.json configuration
    const languinePath = path.join(projectDir, 'languine.json');
    if (!fs.existsSync(languinePath)) {
      createFile(
        languinePath,
        JSON.stringify(
          {
            defaultLocale: 'en',
            locales: SUPPORTED_LOCALES,
            namespaces: ['common'],
            defaultNamespace: 'common',
            output: {
              dictionaries: 'dictionaries',
              locales: 'locales',
            },
          },
          null,
          2
        )
      );
      logger.success('Created languine.json configuration');
    }

    logger.success('Internationalization setup complete!');
    logger.info('You can now use the following commands:');
    logger.info('  zopio i18n --add <locale>     # Add a new locale');
    logger.info(
      '  zopio i18n --create <namespace> # Create a new translation namespace'
    );
    logger.info('  zopio i18n --validate         # Validate translation files');
    logger.info(
      '  zopio i18n --sync             # Synchronize translation files'
    );
  } catch (error) {
    logger.error(
      `Error setting up internationalization: ${(error as Error).message}`
    );
  }
}

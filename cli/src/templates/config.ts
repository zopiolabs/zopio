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
interface ConfigOptions {
  projectName?: string;
}

export default function configTemplate(options: ConfigOptions = {}): string {
  const { projectName = 'zopio-app' } = options;

  return `// Zopio Configuration File
export default {
  // Project information
  project: {
    name: "${projectName}",
    version: "0.1.0"
  },
  
  // Internationalization settings
  i18n: {
    defaultLocale: "en",
    locales: ["en", "tr", "es", "de"],
    localeDetection: true,
    // Directories where translation files are stored
    directories: {
      dictionaries: "dictionaries", // For next-international
      locales: "locales"            // For next-intl
    }
  },
  
  // Build settings
  build: {
    target: "es2020",
    minify: true,
    sourcemap: true
  },
  
  // Plugin settings
  plugins: []
};
`;
}

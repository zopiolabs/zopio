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
interface TranslationSet {
  title: string;
  description: string;
  button: string;
  save: string;
  cancel: string;
  [key: string]: string;
}

interface Translations {
  [locale: string]: TranslationSet;
}

export default function translationTemplate(
  namespace: string,
  locale: string
): string {
  // Default translations for different locales based on memory
  const translations: Translations = {
    en: {
      title: 'Title',
      description: 'Description',
      button: 'Button',
      save: 'Save',
      cancel: 'Cancel',
    },
    tr: {
      title: 'Başlık',
      description: 'Açıklama',
      button: 'Düğme',
      save: 'Kaydet',
      cancel: 'İptal',
    },
    es: {
      title: 'Título',
      description: 'Descripción',
      button: 'Botón',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    de: {
      title: 'Titel',
      description: 'Beschreibung',
      button: 'Knopf',
      save: 'Speichern',
      cancel: 'Abbrechen',
    },
  };

  // Return the translations for the specified locale or fallback to English
  // Add namespace as a comment to show it's being used
  return `// Translations for namespace: ${namespace}
${JSON.stringify(translations[locale] || translations.en, null, 2)}`;
}

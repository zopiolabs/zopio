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
/**
 * Type for translation function
 */
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

/**
 * Default namespace for view-related translations
 */
const DEFAULT_NAMESPACE = 'views';

/**
 * Global translation function that can be set by the application
 */
let globalTranslate: TranslationFunction | null = null;

/**
 * Set the global translation function
 * @param translateFn The translation function to use
 */
export function setTranslationFunction(translateFn: TranslationFunction): void {
  globalTranslate = translateFn;
}

/**
 * Hook to access translations for view components
 * @param namespace Optional custom namespace (defaults to 'views')
 * @returns A translation function
 */
export function useViewTranslations(namespace?: string): TranslationFunction {
  // Use the provided namespace or fall back to the default
  const ns = namespace || DEFAULT_NAMESPACE;

  // Return a translation function that uses the global translate function if available
  // or falls back to returning the key as is
  return (key: string, params?: Record<string, string | number>) => {
    if (globalTranslate) {
      try {
        // Try to use the global translation function with the namespace
        return globalTranslate(`${ns}.${key}`, params);
      } catch (error) {
        // If the translation is missing, return the key as fallback
        console.warn(`Missing translation: ${ns}.${key}`);
        return key;
      }
    }

    // If no global translation function is set, return the key as fallback
    return key;
  };
}

/**
 * Default translations for view components
 * These can be overridden by providing translations in the application
 */
export const defaultViewTranslations = {
  en: {
    views: {
      // Common
      loading: 'Loading...',
      'error.title': 'Error',
      'error.renderingFailed': 'An error occurred while rendering this view.',
      'error.details': 'Error details',

      // Form
      'form.submit': 'Submit',
      'form.reset': 'Reset',
      'form.required': 'Required',
      'form.validation.required': 'This field is required',
      'form.validation.min': 'Minimum value: {min}',
      'form.validation.max': 'Maximum value: {max}',
      'form.validation.pattern': 'Invalid format',

      // Table
      'table.noData': 'No data available',
      'table.pagination.prev': 'Previous',
      'table.pagination.next': 'Next',
      'table.pagination.rowsPerPage': 'Rows per page:',
      'table.pagination.of': 'of',
      'table.search': 'Search',
      'table.filter': 'Filter',

      // Detail
      'detail.back': 'Back',
      'detail.edit': 'Edit',
      'detail.delete': 'Delete',

      // Import/Export
      'import.selectFile': 'Select file',
      'import.dragDrop': 'Drag and drop a file here',
      'import.upload': 'Upload',
      'import.cancel': 'Cancel',
      'export.download': 'Download',
      'export.format': 'Format',
    },
  },
  tr: {
    views: {
      // Common
      loading: 'Yükleniyor...',
      'error.title': 'Hata',
      'error.renderingFailed': 'Bu görünüm yüklenirken bir hata oluştu.',
      'error.details': 'Hata detayları',

      // Form
      'form.submit': 'Gönder',
      'form.reset': 'Sıfırla',
      'form.required': 'Zorunlu',
      'form.validation.required': 'Bu alan zorunludur',
      'form.validation.min': 'Minimum değer: {min}',
      'form.validation.max': 'Maksimum değer: {max}',
      'form.validation.pattern': 'Geçersiz format',

      // Table
      'table.noData': 'Veri bulunamadı',
      'table.pagination.prev': 'Önceki',
      'table.pagination.next': 'Sonraki',
      'table.pagination.rowsPerPage': 'Sayfa başına satır:',
      'table.pagination.of': '/',
      'table.search': 'Ara',
      'table.filter': 'Filtrele',

      // Detail
      'detail.back': 'Geri',
      'detail.edit': 'Düzenle',
      'detail.delete': 'Sil',

      // Import/Export
      'import.selectFile': 'Dosya seç',
      'import.dragDrop': 'Dosyayı buraya sürükleyin',
      'import.upload': 'Yükle',
      'import.cancel': 'İptal',
      'export.download': 'İndir',
      'export.format': 'Format',
    },
  },
  es: {
    views: {
      // Common
      loading: 'Cargando...',
      'error.title': 'Error',
      'error.renderingFailed': 'Se produjo un error al renderizar esta vista.',
      'error.details': 'Detalles del error',

      // Form
      'form.submit': 'Enviar',
      'form.reset': 'Restablecer',
      'form.required': 'Obligatorio',
      'form.validation.required': 'Este campo es obligatorio',
      'form.validation.min': 'Valor mínimo: {min}',
      'form.validation.max': 'Valor máximo: {max}',
      'form.validation.pattern': 'Formato inválido',

      // Table
      'table.noData': 'No hay datos disponibles',
      'table.pagination.prev': 'Anterior',
      'table.pagination.next': 'Siguiente',
      'table.pagination.rowsPerPage': 'Filas por página:',
      'table.pagination.of': 'de',
      'table.search': 'Buscar',
      'table.filter': 'Filtrar',

      // Detail
      'detail.back': 'Atrás',
      'detail.edit': 'Editar',
      'detail.delete': 'Eliminar',

      // Import/Export
      'import.selectFile': 'Seleccionar archivo',
      'import.dragDrop': 'Arrastre y suelte un archivo aquí',
      'import.upload': 'Subir',
      'import.cancel': 'Cancelar',
      'export.download': 'Descargar',
      'export.format': 'Formato',
    },
  },
  de: {
    views: {
      // Common
      loading: 'Wird geladen...',
      'error.title': 'Fehler',
      'error.renderingFailed':
        'Beim Rendern dieser Ansicht ist ein Fehler aufgetreten.',
      'error.details': 'Fehlerdetails',

      // Form
      'form.submit': 'Absenden',
      'form.reset': 'Zurücksetzen',
      'form.required': 'Erforderlich',
      'form.validation.required': 'Dieses Feld ist erforderlich',
      'form.validation.min': 'Mindestwert: {min}',
      'form.validation.max': 'Maximalwert: {max}',
      'form.validation.pattern': 'Ungültiges Format',

      // Table
      'table.noData': 'Keine Daten verfügbar',
      'table.pagination.prev': 'Zurück',
      'table.pagination.next': 'Weiter',
      'table.pagination.rowsPerPage': 'Zeilen pro Seite:',
      'table.pagination.of': 'von',
      'table.search': 'Suchen',
      'table.filter': 'Filtern',

      // Detail
      'detail.back': 'Zurück',
      'detail.edit': 'Bearbeiten',
      'detail.delete': 'Löschen',

      // Import/Export
      'import.selectFile': 'Datei auswählen',
      'import.dragDrop': 'Datei hier ablegen',
      'import.upload': 'Hochladen',
      'import.cancel': 'Abbrechen',
      'export.download': 'Herunterladen',
      'export.format': 'Format',
    },
  },
};

/**
 * Register view translations with the application's i18n system
 * @param register Function to register translations
 */
export function registerViewTranslations(
  register: (namespace: string, translations: Record<string, unknown>) => void
) {
  // Register the default view translations for each locale
  for (const [locale, namespaces] of Object.entries(defaultViewTranslations)) {
    for (const [namespace, translations] of Object.entries(namespaces)) {
      register(`${locale}.${namespace}`, translations);
    }
  }
}

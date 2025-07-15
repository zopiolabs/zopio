/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Design System Internationalization
 *
 * This file provides a unified i18n integration for all design system components,
 * ensuring consistent translation handling across the application.
 */

// Define types for our translations structure
type SupportedLocales = 'en' | 'tr' | 'es' | 'de';

// Use a more flexible type definition that matches the actual structure
type TranslationsType = {
  [locale in SupportedLocales]: {
    common: Record<string, string>;
    form: Record<string, string>;
    table: Record<string, string>;
    dialog: Record<string, string>;
    fileUpload: Record<string, string>;
    errors: Record<string, string>;
  };
};

// Default translations for design system components
const defaultTranslations: TranslationsType = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      required: 'Required',
      optional: 'Optional',
      select: 'Select',
      search: 'Search',
      clear: 'Clear',
      close: 'Close',
      open: 'Open',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      view: 'View',
      yes: 'Yes',
      no: 'No',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      actions: 'Actions',
      more: 'More',
      less: 'Less',
      all: 'All',
      none: 'None',
      filter: 'Filter',
      sort: 'Sort',
      asc: 'Ascending',
      desc: 'Descending',
    },
    form: {
      required: 'This field is required',
      invalid: 'This field is invalid',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be at most {max} characters',
      min: 'Must be at least {min}',
      max: 'Must be at most {max}',
      email: 'Must be a valid email address',
      url: 'Must be a valid URL',
      pattern: 'Invalid format',
      match: 'Fields do not match',
      submit: 'Submit',
      reset: 'Reset',
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Error saving form',
    },
    table: {
      noData: 'No data available',
      loading: 'Loading data...',
      error: 'Error loading data',
      rowsPerPage: 'Rows per page:',
      of: 'of',
      page: 'Page',
      nextPage: 'Next page',
      previousPage: 'Previous page',
      search: 'Search...',
      filter: 'Filter',
      clearFilters: 'Clear filters',
      columns: 'Columns',
      showHideColumns: 'Show/Hide Columns',
    },
    dialog: {
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
      ok: 'OK',
      yes: 'Yes',
      no: 'No',
      delete: 'Delete',
      deleteConfirmation: 'Are you sure you want to delete this item?',
      deleteConfirmationMultiple:
        'Are you sure you want to delete these items?',
    },
    fileUpload: {
      dragDrop: 'Drag and drop files here',
      browse: 'Browse files',
      uploading: 'Uploading...',
      uploaded: 'Uploaded',
      remove: 'Remove',
      retry: 'Retry',
      maxSize: 'Maximum file size: {size}',
      invalidType: 'Invalid file type',
      tooLarge: 'File is too large',
    },
    errors: {
      required: 'This field is required',
      generic: 'An error occurred',
      network: 'Network error',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Not found',
      serverError: 'Server error',
    },
  },
  tr: {
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu',
      required: 'Zorunlu',
      optional: 'İsteğe bağlı',
      select: 'Seç',
      search: 'Ara',
      clear: 'Temizle',
      close: 'Kapat',
      open: 'Aç',
      submit: 'Gönder',
      cancel: 'İptal',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      create: 'Oluştur',
      view: 'Görüntüle',
      yes: 'Evet',
      no: 'Hayır',
      confirm: 'Onayla',
      back: 'Geri',
      next: 'İleri',
      previous: 'Önceki',
      actions: 'İşlemler',
      more: 'Daha fazla',
      less: 'Daha az',
      all: 'Tümü',
      none: 'Hiçbiri',
      filter: 'Filtrele',
      sort: 'Sırala',
      asc: 'Artan',
      desc: 'Azalan',
    },
    form: {
      required: 'Bu alan zorunludur',
      invalid: 'Bu alan geçersiz',
      minLength: 'En az {min} karakter olmalıdır',
      maxLength: 'En fazla {max} karakter olmalıdır',
      min: 'En az {min} olmalıdır',
      max: 'En fazla {max} olmalıdır',
      email: 'Geçerli bir e-posta adresi olmalıdır',
      url: 'Geçerli bir URL olmalıdır',
      pattern: 'Geçersiz format',
      match: 'Alanlar eşleşmiyor',
      submit: 'Gönder',
      reset: 'Sıfırla',
      saving: 'Kaydediliyor...',
      saved: 'Kaydedildi',
      error: 'Form kaydedilirken hata oluştu',
    },
    table: {
      noData: 'Veri bulunamadı',
      loading: 'Veriler yükleniyor...',
      error: 'Veri yüklenirken hata oluştu',
      rowsPerPage: 'Sayfa başına satır:',
      of: '/',
      page: 'Sayfa',
      nextPage: 'Sonraki sayfa',
      previousPage: 'Önceki sayfa',
      search: 'Ara...',
      filter: 'Filtrele',
      clearFilters: 'Filtreleri temizle',
      columns: 'Sütunlar',
      showHideColumns: 'Sütunları Göster/Gizle',
    },
    dialog: {
      close: 'Kapat',
      confirm: 'Onayla',
      cancel: 'İptal',
      ok: 'Tamam',
      yes: 'Evet',
      no: 'Hayır',
      delete: 'Sil',
      deleteConfirmation: 'Bu öğeyi silmek istediğinizden emin misiniz?',
      deleteConfirmationMultiple:
        'Bu öğeleri silmek istediğinizden emin misiniz?',
    },
    fileUpload: {
      dragDrop: 'Dosyaları buraya sürükleyip bırakın',
      browse: 'Dosyalara göz at',
      uploading: 'Yükleniyor...',
      uploaded: 'Yüklendi',
      remove: 'Kaldır',
      retry: 'Yeniden dene',
      maxSize: 'Maksimum dosya boyutu: {size}',
      invalidType: 'Geçersiz dosya türü',
      tooLarge: 'Dosya çok büyük',
    },
    errors: {
      required: 'Bu alan zorunludur',
      generic: 'Bir hata oluştu',
      network: 'Ağ hatası',
      unauthorized: 'Yetkisiz',
      forbidden: 'Yasaklanmış',
      notFound: 'Bulunamadı',
      serverError: 'Sunucu hatası',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Se produjo un error',
      required: 'Obligatorio',
      optional: 'Opcional',
      select: 'Seleccionar',
      search: 'Buscar',
      clear: 'Limpiar',
      close: 'Cerrar',
      open: 'Abrir',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      view: 'Ver',
      yes: 'Sí',
      no: 'No',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      actions: 'Acciones',
      more: 'Más',
      less: 'Menos',
      all: 'Todos',
      none: 'Ninguno',
      filter: 'Filtrar',
      sort: 'Ordenar',
      asc: 'Ascendente',
      desc: 'Descendente',
    },
    form: {
      required: 'Este campo es obligatorio',
      invalid: 'Este campo no es válido',
      minLength: 'Debe tener al menos {min} caracteres',
      maxLength: 'Debe tener como máximo {max} caracteres',
      min: 'Debe ser al menos {min}',
      max: 'Debe ser como máximo {max}',
      email: 'Debe ser una dirección de correo electrónico válida',
      url: 'Debe ser una URL válida',
      pattern: 'Formato no válido',
      match: 'Los campos no coinciden',
      submit: 'Enviar',
      reset: 'Restablecer',
      saving: 'Guardando...',
      saved: 'Guardado',
      error: 'Error al guardar el formulario',
    },
    table: {
      noData: 'No hay datos disponibles',
      loading: 'Cargando datos...',
      error: 'Error al cargar datos',
      rowsPerPage: 'Filas por página:',
      of: 'de',
      page: 'Página',
      nextPage: 'Página siguiente',
      previousPage: 'Página anterior',
      search: 'Buscar...',
      filter: 'Filtrar',
      clearFilters: 'Limpiar filtros',
      columns: 'Columnas',
      showHideColumns: 'Mostrar/Ocultar columnas',
    },
    dialog: {
      close: 'Cerrar',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      ok: 'OK',
      yes: 'Sí',
      no: 'No',
      delete: 'Eliminar',
      deleteConfirmation: '¿Está seguro de que desea eliminar este elemento?',
      deleteConfirmationMultiple:
        '¿Está seguro de que desea eliminar estos elementos?',
    },
    fileUpload: {
      dragDrop: 'Arrastre y suelte archivos aquí',
      browse: 'Explorar archivos',
      uploading: 'Subiendo...',
      uploaded: 'Subido',
      remove: 'Eliminar',
      retry: 'Reintentar',
      maxSize: 'Tamaño máximo de archivo: {size}',
      invalidType: 'Tipo de archivo no válido',
      tooLarge: 'El archivo es demasiado grande',
    },
    errors: {
      required: 'Este campo es obligatorio',
      generic: 'Se produjo un error',
      network: 'Error de red',
      unauthorized: 'No autorizado',
      forbidden: 'Prohibido',
      notFound: 'No encontrado',
      serverError: 'Error del servidor',
    },
  },
  de: {
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      required: 'Erforderlich',
      optional: 'Optional',
      select: 'Auswählen',
      search: 'Suchen',
      clear: 'Löschen',
      close: 'Schließen',
      open: 'Öffnen',
      submit: 'Absenden',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      view: 'Ansehen',
      yes: 'Ja',
      no: 'Nein',
      confirm: 'Bestätigen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      actions: 'Aktionen',
      more: 'Mehr',
      less: 'Weniger',
      all: 'Alle',
      none: 'Keine',
      filter: 'Filter',
      sort: 'Sortieren',
      asc: 'Aufsteigend',
      desc: 'Absteigend',
    },
    form: {
      required: 'Dieses Feld ist erforderlich',
      invalid: 'Dieses Feld ist ungültig',
      minLength: 'Muss mindestens {min} Zeichen lang sein',
      maxLength: 'Darf höchstens {max} Zeichen lang sein',
      min: 'Muss mindestens {min} sein',
      max: 'Darf höchstens {max} sein',
      email: 'Muss eine gültige E-Mail-Adresse sein',
      url: 'Muss eine gültige URL sein',
      pattern: 'Ungültiges Format',
      match: 'Felder stimmen nicht überein',
      submit: 'Absenden',
      reset: 'Zurücksetzen',
      saving: 'Wird gespeichert...',
      saved: 'Gespeichert',
      error: 'Fehler beim Speichern des Formulars',
    },
    table: {
      noData: 'Keine Daten verfügbar',
      loading: 'Daten werden geladen...',
      error: 'Fehler beim Laden der Daten',
      rowsPerPage: 'Zeilen pro Seite:',
      of: 'von',
      page: 'Seite',
      nextPage: 'Nächste Seite',
      previousPage: 'Vorherige Seite',
      search: 'Suchen...',
      filter: 'Filtern',
      clearFilters: 'Filter löschen',
      columns: 'Spalten',
      showHideColumns: 'Spalten anzeigen/ausblenden',
    },
    dialog: {
      close: 'Schließen',
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
      ok: 'OK',
      yes: 'Ja',
      no: 'Nein',
      delete: 'Löschen',
      deleteConfirmation:
        'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
      deleteConfirmationMultiple:
        'Sind Sie sicher, dass Sie diese Elemente löschen möchten?',
    },
    fileUpload: {
      dragDrop: 'Dateien hier ablegen',
      browse: 'Dateien durchsuchen',
      uploading: 'Wird hochgeladen...',
      uploaded: 'Hochgeladen',
      remove: 'Entfernen',
      retry: 'Wiederholen',
      maxSize: 'Maximale Dateigröße: {size}',
      invalidType: 'Ungültiger Dateityp',
      tooLarge: 'Datei ist zu groß',
    },
    errors: {
      required: 'Dieses Feld ist erforderlich',
      generic: 'Ein Fehler ist aufgetreten',
      network: 'Netzwerkfehler',
      unauthorized: 'Nicht autorisiert',
      forbidden: 'Verboten',
      notFound: 'Nicht gefunden',
      serverError: 'Serverfehler',
    },
  },
};

// Global translation function that can be set by the application
let globalTranslate:
  | ((key: string, params?: Record<string, string | number>) => string)
  | null = null;

/**
 * Set the global translation function
 * @param translateFn - Translation function to use
 */
export function setTranslator(
  translateFn: (key: string, params?: Record<string, string | number>) => string
): void {
  globalTranslate = translateFn;
}

/**
 * Get a translation for a key
 * @param key - Translation key (e.g., 'common.loading')
 * @param params - Optional parameters for interpolation
 * @returns Translated string
 */
export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  if (globalTranslate) {
    return globalTranslate(key, params);
  }

  // Fallback to simple key lookup in default translations
  const [namespace, messageKey] = key.split('.');
  const locale = 'en'; // Default to English if no global translator

  if (!namespace || !messageKey) {
    return key;
  }

  // Type-safe access to translations
  const localeTranslations = defaultTranslations[locale as SupportedLocales];

  if (!localeTranslations) {
    return key;
  }

  // Get the namespace translations using type assertion to handle dynamic access
  const namespaceTranslations =
    localeTranslations[namespace as keyof typeof localeTranslations];

  if (!namespaceTranslations) {
    return key;
  }

  // Get the specific message
  const translation = namespaceTranslations[messageKey];

  if (typeof translation !== 'string') {
    return key;
  }

  // Simple parameter replacement
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue)),
      translation
    );
  }

  return translation;
}

/**
 * Hook for using translations in components with a specific namespace
 * @param ns - Translation namespace
 * @returns Translation function
 */
export function useTranslation(ns: string) {
  return {
    t: (key: string, params?: Record<string, string | number>): string => {
      return t(`${ns}.${key}`, params);
    },
  };
}

export default {
  t,
  useTranslation,
  setTranslator,
  defaultTranslations,
};

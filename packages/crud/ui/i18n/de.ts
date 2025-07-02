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
export default {
  form: {
    submit: 'Absenden',
    reset: 'Zurücksetzen',
    required: 'Erforderlich',
    validation: {
      required: 'Dieses Feld ist erforderlich',
      min: 'Der Wert muss mindestens {{min}} sein',
      max: 'Der Wert darf höchstens {{max}} sein',
      minLength: 'Muss mindestens {{min}} Zeichen lang sein',
      maxLength: 'Darf höchstens {{max}} Zeichen lang sein',
      pattern: 'Ungültiges Format',
      email: 'Ungültige E-Mail-Adresse',
      url: 'Ungültige URL',
    },
  },
  table: {
    noData: 'Keine Daten verfügbar',
    loading: 'Daten werden geladen...',
    pagination: {
      showing: 'Zeige {{start}} bis {{end}} von {{total}} Einträgen',
      next: 'Weiter',
      previous: 'Zurück',
      rowsPerPage: 'Zeilen pro Seite:',
    },
    filters: {
      title: 'Filter',
      apply: 'Anwenden',
      clear: 'Zurücksetzen',
      add: 'Filter hinzufügen',
    },
    actions: {
      edit: 'Bearbeiten',
      delete: 'Löschen',
      view: 'Anzeigen',
      bulkDelete: 'Ausgewählte löschen',
    },
  },
  fields: {
    generic: {
      select: 'Auswählen...',
      search: 'Suchen...',
      upload: 'Hochladen',
      remove: 'Entfernen',
    },
  },
};

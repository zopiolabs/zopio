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
    submit: 'Submit',
    reset: 'Reset',
    required: 'Required',
    validation: {
      required: 'This field is required',
      min: 'Value must be at least {{min}}',
      max: 'Value must be at most {{max}}',
      minLength: 'Must be at least {{min}} characters',
      maxLength: 'Must be at most {{max}} characters',
      pattern: 'Invalid format',
      email: 'Invalid email address',
      url: 'Invalid URL',
    },
  },
  table: {
    noData: 'No data available',
    loading: 'Loading data...',
    pagination: {
      showing: 'Showing {{start}} to {{end}} of {{total}} entries',
      next: 'Next',
      previous: 'Previous',
      rowsPerPage: 'Rows per page:',
    },
    filters: {
      title: 'Filters',
      apply: 'Apply',
      clear: 'Clear',
      add: 'Add Filter',
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      bulkDelete: 'Delete Selected',
    },
  },
  fields: {
    // Generic field translations that can be overridden
    generic: {
      select: 'Select...',
      search: 'Search...',
      upload: 'Upload',
      remove: 'Remove',
    },
  },
};

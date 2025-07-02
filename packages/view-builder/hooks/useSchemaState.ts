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
// Import React directly to use JSX
import React from 'react';

// Import React hooks directly
const createContext = React.createContext;
const useContext = React.useContext;
const useState = React.useState;
const useCallback = React.useCallback;
const createElement = React.createElement;

type ReactNode = React.ReactNode;

// Define ViewSchema type locally to avoid import issues
interface ViewSchema {
  type: string;
  schema: string;
  fields?: Record<string, FieldDefinition>;
  i18nNamespace?: string;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  // Additional properties for other view types
  columns?: Array<{
    key: string;
    title: string;
    width?: number | string;
    sortable?: boolean;
    filterable?: boolean;
    hidden?: boolean;
    render?: string;
  }>;
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions?: number[];
  };
  defaultSort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  rowActions?: string[];
  bulkActions?: string[];
  selectable?: boolean;
  layout?: {
    tabs?: Array<{
      title: string;
      sections: Array<{
        title?: string;
        description?: string;
        fields: string[];
        columns?: 1 | 2 | 3 | 4;
      }>;
    }>;
    sections?: Array<{
      title?: string;
      description?: string;
      fields: string[];
      columns?: 1 | 2 | 3 | 4;
    }>;
  };
  actions?: string[];
}

// Define FieldDefinition type locally
interface FieldDefinition {
  label?: string;
  type?: string;
  required?: boolean;
  options?: string[];
  hidden?: boolean | ((data: Record<string, unknown>) => boolean);
  readOnly?: boolean | ((data: Record<string, unknown>) => boolean);
  description?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Mock service functions to avoid import issues
const saveView = async (id: string, view: ViewSchema): Promise<void> => {
  // In a real implementation, this would save to a storage provider
  localStorage.setItem(`zopio_view_${id}`, JSON.stringify(view));
};

const getView = async (id: string): Promise<ViewSchema | undefined> => {
  // In a real implementation, this would retrieve from a storage provider
  const item = localStorage.getItem(`zopio_view_${id}`);
  return item ? JSON.parse(item) : undefined;
};

const listViews = async (): Promise<string[]> => {
  // In a real implementation, this would list views from a storage provider
  const views: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('zopio_view_')) {
      views.push(key.substring('zopio_view_'.length));
    }
  }
  return views;
};

const deleteView = async (id: string): Promise<void> => {
  // In a real implementation, this would delete from a storage provider
  localStorage.removeItem(`zopio_view_${id}`);
};

// Mock schema validation function
const safeValidateViewSchema = (
  schema: unknown
): { success: boolean; data?: ViewSchema; error?: Error | unknown } => {
  // In a real implementation, this would validate the schema
  try {
    // Basic validation
    const typedSchema = schema as ViewSchema;
    if (!typedSchema.type || !typedSchema.schema) {
      return {
        success: false,
        error: new Error('Invalid schema: missing required fields'),
      };
    }
    return { success: true, data: typedSchema };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * Field definition for the form builder
 */
export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
  placeholder?: string;
  section?: string;
  order?: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

/**
 * Initial empty form schema
 */
const initialSchema: ViewSchema = {
  type: 'form',
  schema: 'user',
  fields: {},
  i18nNamespace: 'forms',
  submitLabel: 'Save',
  resetLabel: 'Reset',
  showReset: true,
};

/**
 * Context interface for schema state
 */
interface SchemaContextType {
  // Schema state
  schema: ViewSchema;
  setSchema: (schema: ViewSchema) => void;

  // Field operations
  addField: (field: FormField) => void;
  updateField: (name: string, field: Partial<FormField>) => void;
  removeField: (name: string) => void;

  // Schema validation
  validateSchema: () => { valid: boolean; errors?: unknown };

  // Storage operations
  persistView: (id?: string) => Promise<string>;
  loadView: (id: string) => Promise<boolean>;
  deleteView: (id: string) => Promise<boolean>;
  getViewList: () => Promise<string[]>;
}

/**
 * Default context values
 */
const defaultContextValue: SchemaContextType = {
  schema: initialSchema,
  setSchema: () => {},
  addField: () => {},
  updateField: () => {},
  removeField: () => {},
  validateSchema: () => ({ valid: false }),
  persistView: async () => '',
  loadView: async () => false,
  deleteView: async () => false,
  getViewList: async () => [],
};

/**
 * Create context with default values
 */
const SchemaContext = createContext<SchemaContextType>(defaultContextValue);

/**
 * Schema Provider Component
 * @param props - Component props
 * @returns Schema Provider Component
 */
export function SchemaProvider(props: { children: ReactNode }): JSX.Element {
  // Initialize schema state
  const [schema, setSchema] = useState<ViewSchema>({
    type: 'form',
    schema: '',
    fields: {},
    i18nNamespace: 'forms',
    submitLabel: 'Submit',
    resetLabel: 'Reset',
    showReset: true,
  });

  /**
   * Add a new field to the schema
   */
  const addField = useCallback((field: FormField) => {
    setSchema((prev: ViewSchema) => {
      const updatedSchema = { ...prev };

      // Ensure fields object exists
      if (!updatedSchema.fields) {
        updatedSchema.fields = {};
      }

      // Add the field to the schema
      updatedSchema.fields[field.name] = {
        label: field.label,
        type: field.type,
        required: field.required,
        ...(field.options && { options: field.options }),
        ...(field.description && { description: field.description }),
        ...(field.placeholder && { placeholder: field.placeholder }),
        ...(field.validation && { validation: field.validation }),
      };

      return updatedSchema;
    });
  }, []);

  /**
   * Update an existing field in the schema
   */
  const updateField = useCallback(
    (name: string, updates: Partial<FormField>) => {
      setSchema((prev: ViewSchema) => {
        const updatedSchema = { ...prev };

        // Ensure fields object exists
        if (!updatedSchema.fields) {
          updatedSchema.fields = {};
        }

        // Check if field exists
        if (!updatedSchema.fields[name]) {
          console.warn(`Field '${name}' not found in schema`);
          return prev;
        }

        // Update the field properties
        updatedSchema.fields[name] = {
          ...updatedSchema.fields[name],
          ...(updates.label !== undefined && { label: updates.label }),
          ...(updates.type !== undefined && { type: updates.type }),
          ...(updates.required !== undefined && { required: updates.required }),
          ...(updates.options !== undefined && { options: updates.options }),
          ...(updates.description !== undefined && {
            description: updates.description,
          }),
          ...(updates.placeholder !== undefined && {
            placeholder: updates.placeholder,
          }),
          ...(updates.validation !== undefined && {
            validation: updates.validation,
          }),
        };

        return updatedSchema;
      });
    },
    []
  );

  /**
   * Remove a field from the schema
   */
  const removeField = useCallback((name: string) => {
    setSchema((prev: ViewSchema) => {
      const updatedSchema = { ...prev };

      // Ensure fields object exists
      if (!updatedSchema.fields) {
        return prev;
      }

      // Check if field exists
      if (!updatedSchema.fields[name]) {
        console.warn(`Field '${name}' not found in schema`);
        return prev;
      }

      // Remove the field
      const { [name]: _, ...remainingFields } = updatedSchema.fields;
      updatedSchema.fields = remainingFields;

      return updatedSchema;
    });
  }, []);

  /**
   * Validate the current schema
   */
  const validateSchema = useCallback(() => {
    const result = safeValidateViewSchema(schema);

    return {
      valid: result.success,
      errors: result.success ? undefined : result.error,
    };
  }, [schema]);

  /**
   * Save the current schema to storage
   */
  const persistView = useCallback(
    async (id?: string) => {
      const viewId = id || `view_${Date.now()}`;

      try {
        await saveView(viewId, schema);
        return viewId;
      } catch (error) {
        console.error('Error saving view:', error);
        throw error;
      }
    },
    [schema]
  );

  /**
   * Load a view from storage
   */
  const loadView = useCallback(async (id: string) => {
    try {
      const view = await getView(id);

      if (view) {
        setSchema(view);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error loading view '${id}':`, error);
      return false;
    }
  }, []);

  /**
   * Delete a view from storage
   */
  const deleteViewById = useCallback(async (id: string) => {
    try {
      await deleteView(id);
      return true;
    } catch (error) {
      console.error(`Error deleting view '${id}':`, error);
      return false;
    }
  }, []);

  /**
   * Get a list of all views in storage
   */
  const getViewList = useCallback(async () => {
    try {
      return await listViews();
    } catch (error) {
      console.error('Error listing views:', error);
      return [];
    }
  }, []);

  // Create context value object
  const contextValue = {
    schema,
    setSchema,
    addField,
    updateField,
    removeField,
    validateSchema,
    persistView,
    loadView,
    deleteView: deleteViewById,
    getViewList,
  };

  // Use React.createElement for better compatibility
  // Cast to JSX.Element to resolve type compatibility issues
  return React.createElement(
    SchemaContext.Provider,
    { value: contextValue },
    props.children
  ) as unknown as JSX.Element;
}

/**
 * Hook to access the schema state context
 * @returns Schema context value
 */
export function useSchemaState(): SchemaContextType {
  const context = useContext(SchemaContext);

  if (!context) {
    throw new Error('useSchemaState must be used within a SchemaProvider');
  }

  return context;
}

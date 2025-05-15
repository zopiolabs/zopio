import { useState, useCallback, useEffect } from 'react';

export interface FilterDefinition {
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: Array<{ value: any; label: string }>;
  defaultValue?: any;
}

export interface UseTableFiltersParams {
  filters: FilterDefinition[];
  initialValues?: Record<string, any>;
  onChange?: (filters: Record<string, any>) => void;
  debounceMs?: number;
}

export interface UseTableFiltersReturn {
  // Filter values
  values: Record<string, any>;
  
  // Filter operations
  setFilter: (field: string, value: any) => void;
  resetFilters: () => void;
  
  // Filter definitions
  filterDefs: FilterDefinition[];
}

/**
 * Hook for managing table filters
 */
export function useTableFilters({
  filters,
  initialValues = {},
  onChange,
  debounceMs = 300,
}: UseTableFiltersParams): UseTableFiltersReturn {
  // Initialize filter values with defaults
  const getDefaultValues = useCallback(() => {
    const defaults: Record<string, any> = {};
    
    filters.forEach(filter => {
      defaults[filter.field] = initialValues[filter.field] ?? filter.defaultValue ?? null;
    });
    
    return defaults;
  }, [filters, initialValues]);
  
  // Filter values state
  const [values, setValues] = useState<Record<string, any>>(getDefaultValues);
  
  // Debounced onChange handler
  useEffect(() => {
    if (!onChange) return;
    
    const handler = setTimeout(() => {
      onChange(values);
    }, debounceMs);
    
    return () => {
      clearTimeout(handler);
    };
  }, [values, onChange, debounceMs]);
  
  // Set a single filter value
  const setFilter = useCallback((field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  
  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setValues(getDefaultValues());
  }, [getDefaultValues]);
  
  return {
    values,
    setFilter,
    resetFilters,
    filterDefs: filters,
  };
}

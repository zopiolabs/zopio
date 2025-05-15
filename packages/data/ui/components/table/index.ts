/**
 * Table components for data display
 */

import type { ReactNode } from 'react';

/**
 * DataTable props interface
 */
export interface DataTableProps<T extends Record<string, unknown>> {
  /**
   * Data to display in the table
   */
  data: T[];
  
  /**
   * Columns configuration
   */
  columns: DataTableColumn<T>[];
  
  /**
   * Loading state
   */
  isLoading?: boolean;
  
  /**
   * Error state
   */
  error?: Error | null;
  
  /**
   * Callback for row selection
   */
  onRowSelect?: (row: T) => void;
  
  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * DataTable column interface
 */
export interface DataTableColumn<T extends Record<string, unknown>> {
  /**
   * Field key in data object
   */
  field: keyof T;
  
  /**
   * Header label
   */
  header: string;
  
  /**
   * Custom cell renderer
   */
  render?: (value: unknown, row: T) => ReactNode;
  
  /**
   * Column width
   */
  width?: number | string;
  
  /**
   * Whether column is sortable
   */
  sortable?: boolean;
  
  /**
   * Whether column is filterable
   */
  filterable?: boolean;
}

/**
 * DataTable component placeholder
 * This is a placeholder for the actual implementation
 */
export function DataTable<T extends Record<string, unknown>>(_props: DataTableProps<T>) {
  // Placeholder implementation
  return null;
}

/**
 * TablePagination props interface
 */
export interface TablePaginationProps {
  /**
   * Current page
   */
  page: number;
  
  /**
   * Items per page
   */
  perPage: number;
  
  /**
   * Total number of items
   */
  total: number;
  
  /**
   * Callback for page change
   */
  onPageChange: (page: number) => void;
  
  /**
   * Callback for per page change
   */
  onPerPageChange?: (perPage: number) => void;
  
  /**
   * Available per page options
   */
  perPageOptions?: number[];
  
  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * TablePagination component placeholder
 * This is a placeholder for the actual implementation
 */
export function TablePagination(_props: TablePaginationProps) {
  // Placeholder implementation
  return null;
}

/**
 * TableSorting props interface
 */
export interface TableSortingProps<T extends Record<string, unknown>> {
  /**
   * Current sort field
   */
  field: keyof T | null;
  
  /**
   * Current sort order
   */
  order: 'asc' | 'desc' | null;
  
  /**
   * Callback for sort change
   */
  onSort: (field: keyof T, order: 'asc' | 'desc') => void;
  
  /**
   * Available sort fields
   */
  fields: Array<{
    field: keyof T;
    label: string;
  }>;
  
  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * TableSorting component placeholder
 * This is a placeholder for the actual implementation
 */
export function TableSorting<T extends Record<string, unknown>>(_props: TableSortingProps<T>) {
  // Placeholder implementation
  return null;
}

/**
 * TableFiltering props interface
 */
export interface TableFilteringProps<T extends Record<string, unknown>> {
  /**
   * Current filters
   */
  filters: Partial<Record<keyof T, unknown>>;
  
  /**
   * Callback for filter change
   */
  onFilter: (filters: Partial<Record<keyof T, unknown>>) => void;
  
  /**
   * Available filter fields
   */
  fields: Array<{
    field: keyof T;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: Array<{
      value: unknown;
      label: string;
    }>;
  }>;
  
  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * TableFiltering component placeholder
 * This is a placeholder for the actual implementation
 */
export function TableFiltering<T extends Record<string, unknown>>(_props: TableFilteringProps<T>) {
  // Placeholder implementation
  return null;
}

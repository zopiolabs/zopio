/**
 * Utility functions for CRUD handlers
 */

import type { GetListParams } from '../types/index.js';

/**
 * Normalize pagination parameters
 */
export function normalizePagination(params: GetListParams) {
  const { pagination } = params;
  
  if (!pagination) {
    return { 
      page: 1, 
      perPage: 10,
      start: 0,
      end: 9
    };
  }
  
  const { page, perPage } = pagination;
  const start = (page - 1) * perPage;
  const end = page * perPage - 1;
  
  return {
    page,
    perPage,
    start,
    end
  };
}

/**
 * Normalize sort parameters
 */
export function normalizeSort(params: GetListParams) {
  const { sort } = params;
  
  if (!sort) {
    return { field: 'id', order: 'asc' as const };
  }
  
  return sort;
}

/**
 * Apply filters to a dataset
 */
export function applyFilters<T extends Record<string, unknown> = Record<string, unknown>>(data: T[], filters: Record<string, unknown>): T[] {
  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }
  
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) {
        return true;
      }
      
      const itemValue = (item as Record<string, unknown>)[key];
      
      if (typeof value === 'string' && itemValue) {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      
      return itemValue === value;
    });
  });
}

/**
 * Apply sorting to a dataset
 */
export function applySort<T extends Record<string, unknown> = Record<string, unknown>>(data: T[], sort: { field: string; order: 'asc' | 'desc' }): T[] {
  if (!sort || !sort.field) {
    return data;
  }
  
  const { field, order } = sort;
  
  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[field];
    const bValue = (b as Record<string, unknown>)[field];
    
    // Handle null/undefined values
    if (aValue == null) {
      return order === 'asc' ? -1 : 1;
    }
    
    if (bValue == null) {
      return order === 'asc' ? 1 : -1;
    }
    
    return compareValues(aValue, bValue, order);
  });
}

/**
 * Compare two values for sorting
 */
function compareValues(
  aValue: unknown, 
  bValue: unknown, 
  order: 'asc' | 'desc'
): number {
  // String comparison
  if (typeof aValue === 'string' && typeof bValue === 'string') {
    if (order === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  }
  
  // Number comparison
  if (typeof aValue === 'number' && typeof bValue === 'number') {
    if (order === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  }
  
  // Default comparison using string conversion
  const aString = String(aValue);
  const bString = String(bValue);
  
  if (order === 'asc') {
    return aString.localeCompare(bString);
  }
  return bString.localeCompare(aString);
}

/**
 * Apply pagination to a dataset
 */
export function applyPagination<T = unknown>(
  data: T[],
  pagination: { page: number; perPage: number }
): T[] {
  if (!pagination) {
    return data;
  }
  
  const { page, perPage } = pagination;
  const start = (page - 1) * perPage;
  
  return data.slice(start, start + perPage);
}

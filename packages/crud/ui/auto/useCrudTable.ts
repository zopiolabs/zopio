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
import { useCallback, useEffect, useState } from 'react';
import type {
  FieldValue,
  TableFilter,
  TablePagination,
  TableSorting,
  UseCrudTableOptions,
  UseCrudTableReturn,
} from '../types';

/**
 * useCrudTable is a React hook for managing table data and selection state for auto tables.
 * Features:
 * - Client-side or server-side data fetching
 * - Pagination
 * - Sorting
 * - Filtering
 * - Row selection
 * - Loading state management
 * - Error handling
 */
export function useCrudTable({
  rows: initialRows = [],
  fetchData,
  initialPage = 1,
  initialPageSize = 10,
  initialSort,
  initialFilters = [],
}: UseCrudTableOptions): UseCrudTableReturn {
  // State for client-side data
  const [rows, setRows] = useState<Record<string, FieldValue>[]>(initialRows);

  // State for server-side data fetching
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Selection state
  const [selected, setSelected] = useState<Record<string, FieldValue>[]>([]);

  // Pagination state
  const [pagination, setPagination] = useState<TablePagination>({
    page: initialPage,
    pageSize: initialPageSize,
    total: initialRows.length,
    onPageChange: () => {}, // Will be set below
    onPageSizeChange: () => {}, // Will be set below
  });

  // Sorting state
  const [sorting, setSorting] = useState<TableSorting | undefined>(
    initialSort
      ? {
          column: initialSort.column,
          direction: initialSort.direction,
          onSort: () => {}, // Will be set below
        }
      : undefined
  );

  // Filtering state
  const [filters, setFilters] = useState<TableFilter[]>(initialFilters);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Handle sorting
  const handleSort = useCallback(
    (column: string, direction: 'asc' | 'desc') => {
      setSorting((prev) =>
        prev
          ? { ...prev, column, direction }
          : { column, direction, onSort: handleSort }
      );
    },
    []
  );

  // Update pagination handlers
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    }));
  }, [handlePageChange, handlePageSizeChange]);

  // Update sorting handlers
  useEffect(() => {
    if (sorting) {
      setSorting((prev) =>
        prev ? { ...prev, onSort: handleSort } : undefined
      );
    }
  }, [handleSort, sorting]);

  // Fetch data from server or process client-side
  const fetchTableData = useCallback(async () => {
    if (fetchData) {
      // Server-side data fetching
      try {
        setIsLoading(true);
        setError(null);

        const result = await fetchData({
          page: pagination.page,
          pageSize: pagination.pageSize,
          sort:
            sorting && sorting.column
              ? { column: sorting.column, direction: sorting.direction }
              : undefined,
          filters,
        });

        setRows(result.data);
        setPagination((prev) => ({ ...prev, total: result.total }));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch data')
        );
        console.error('Error fetching table data:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Client-side data processing
      let filteredData = [...initialRows];

      // Apply filters
      if (filters.length > 0) {
        filteredData = filteredData.filter((row) => {
          return filters.every((filter) => {
            const value = row[filter.column];

            switch (filter.operator) {
              case 'eq':
                return value === filter.value;
              case 'neq':
                return value !== filter.value;
              case 'gt':
                return (
                  typeof value === 'number' &&
                  typeof filter.value === 'number' &&
                  value > filter.value
                );
              case 'gte':
                return (
                  typeof value === 'number' &&
                  typeof filter.value === 'number' &&
                  value >= filter.value
                );
              case 'lt':
                return (
                  typeof value === 'number' &&
                  typeof filter.value === 'number' &&
                  value < filter.value
                );
              case 'lte':
                return (
                  typeof value === 'number' &&
                  typeof filter.value === 'number' &&
                  value <= filter.value
                );
              case 'contains':
                return (
                  typeof value === 'string' &&
                  typeof filter.value === 'string' &&
                  value.toLowerCase().includes(filter.value.toLowerCase())
                );
              case 'startsWith':
                return (
                  typeof value === 'string' &&
                  typeof filter.value === 'string' &&
                  value.toLowerCase().startsWith(filter.value.toLowerCase())
                );
              case 'endsWith':
                return (
                  typeof value === 'string' &&
                  typeof filter.value === 'string' &&
                  value.toLowerCase().endsWith(filter.value.toLowerCase())
                );
              default:
                return true;
            }
          });
        });
      }

      // Apply sorting
      if (sorting) {
        filteredData.sort((a, b) => {
          if (!sorting || !sorting.column) return 0;
          const aValue = a[sorting.column];
          const bValue = b[sorting.column];

          if (aValue === bValue) return 0;

          const direction = sorting.direction === 'asc' ? 1 : -1;

          if (aValue === null || aValue === undefined) return direction * -1;
          if (bValue === null || bValue === undefined) return direction;

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction * aValue.localeCompare(bValue);
          }

          return direction * (aValue < bValue ? -1 : 1);
        });
      }

      // Apply pagination
      const start = (pagination.page - 1) * pagination.pageSize;
      const paginatedData = filteredData.slice(
        start,
        start + pagination.pageSize
      );

      setRows(paginatedData);
      setPagination((prev) => ({ ...prev, total: filteredData.length }));
    }
  }, [
    fetchData,
    pagination.page,
    pagination.pageSize,
    sorting,
    filters,
    initialRows,
  ]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Refresh data manually
  const refresh = useCallback(async () => {
    await fetchTableData();
  }, [fetchTableData]);

  return {
    rows,
    isLoading,
    error,
    selected,
    setSelected,
    pagination,
    sorting: sorting as TableSorting, // Type assertion to satisfy the interface
    filters,
    setFilters,
    refresh,
  };
}

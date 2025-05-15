import { useState, useEffect, useCallback } from 'react';
import { createDataProvider } from '@repo/data-providers';
import type { GetListParams } from '@repo/data-base';
import type { ProviderType } from '@repo/data-base';

export interface UseTableParams {
  resource: string;
  provider?: ProviderType;
  providerOptions?: Record<string, unknown>;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { field: string; order: 'asc' | 'desc' };
  initialFilters?: Record<string, unknown>;
  initialColumns?: string[];
  persistColumns?: boolean;
  syncWithUrl?: boolean;
  autoLoad?: boolean;
}

export interface UseTableReturn<RecordType = unknown> {
  // Data state
  data: RecordType[];
  total: number;
  loading: boolean;
  error: Error | null;
  
  // Pagination state
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  
  // Sorting state
  sort?: { field: string; order: 'asc' | 'desc' };
  setSort: (sort?: { field: string; order: 'asc' | 'desc' }) => void;
  
  // Search state
  search: string;
  setSearch: (search: string) => void;
  
  // Filtering state
  filters: Record<string, unknown>;
  setFilters: (filters: Record<string, unknown>) => void;
  
  // Column visibility
  visibleColumns: string[];
  toggleColumn: (column: string) => void;
  
  // Row editing
  editingRow: RecordType | null;
  setEditingRow: (row: RecordType | null) => void;
  
  // Row operations
  editRow: (row: RecordType) => void;
  updateRow: (row: RecordType) => Promise<void>;
  deleteRow: (id: string | number) => Promise<void>;
  
  // Refresh data
  refresh: () => void;
}

/**
 * Hook for data table operations with advanced features
 */
export function useTable<RecordType extends Record<string, unknown> = Record<string, unknown>>({
  resource,
  provider = 'rest' as ProviderType,
  providerOptions = {},
  initialPage = 1,
  initialPageSize = 10,
  initialSort,
  initialFilters = {},
  initialColumns = [],
  persistColumns = true,
  syncWithUrl = false,
  autoLoad = true,
}: UseTableParams): UseTableReturn<RecordType> {
  // Create data provider
  const dataProvider = createDataProvider({
    type: provider,
    config: providerOptions,
  });

  // Data state
  const [data, setData] = useState<RecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sorting state
  const [sort, setSort] = useState(initialSort);

  // Search state
  const [search, setSearch] = useState('');

  // Filtering state
  const [filters, setFilters] = useState(initialFilters);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (persistColumns) {
      const stored = localStorage.getItem(`zopio-table-columns:${resource}`);
      return stored ? JSON.parse(stored) : initialColumns;
    }
    return initialColumns;
  });

  // Row editing
  const [editingRow, setEditingRow] = useState<RecordType | null>(null);

  // URL sync
  useEffect(() => {
    if (syncWithUrl) {
      const url = new URL(window.location.href);
      
      // Get pagination from URL
      const urlPage = url.searchParams.get('page');
      const urlPageSize = url.searchParams.get('pageSize');
      
      if (urlPage) {
        setPage(Number(urlPage));
      }
      if (urlPageSize) {
        setPageSize(Number(urlPageSize));
      }
      
      // Get sort from URL
      const urlSortField = url.searchParams.get('sortField');
      const urlSortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc';
      
      if (urlSortField && urlSortOrder) {
        setSort({ field: urlSortField, order: urlSortOrder });
      }
      
      // Get search from URL
      const urlSearch = url.searchParams.get('search');
      if (urlSearch) {
        setSearch(urlSearch);
      }
      
      // Get filters from URL
      const urlFilters: Record<string, unknown> = {};
      
      // Use for...of instead of forEach
      for (const [key, value] of url.searchParams.entries()) {
        if (key.startsWith('filter_')) {
          const filterKey = key.replace('filter_', '');
          urlFilters[filterKey] = value;
        }
      }
      
      if (Object.keys(urlFilters).length > 0) {
        setFilters(urlFilters);
      }
    }
  }, [syncWithUrl, resource]);

  // Update URL when parameters change
  useEffect(() => {
    if (syncWithUrl) {
      const url = new URL(window.location.href);
      
      // Update pagination in URL
      url.searchParams.set('page', String(page));
      url.searchParams.set('pageSize', String(pageSize));
      
      // Update sort in URL
      if (sort) {
        url.searchParams.set('sortField', sort.field);
        url.searchParams.set('sortOrder', sort.order);
      } else {
        url.searchParams.delete('sortField');
        url.searchParams.delete('sortOrder');
      }
      
      // Update search in URL
      if (search) {
        url.searchParams.set('search', search);
      } else {
        url.searchParams.delete('search');
      }
      
      // Update filters in URL
      url.searchParams.forEach((_, key) => {
        if (key.startsWith('filter_')) {
          url.searchParams.delete(key);
        }
      });
      
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(`filter_${key}`, String(value));
        }
      }
      
      window.history.replaceState(null, '', url.toString());
    }
  }, [syncWithUrl, page, pageSize, sort, search, filters]);

  // Persist visible columns
  useEffect(() => {
    if (persistColumns && visibleColumns.length > 0) {
      localStorage.setItem(`zopio-table-columns:${resource}`, JSON.stringify(visibleColumns));
    }
  }, [persistColumns, visibleColumns, resource]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare filter with search
      const combinedFilters = { ...filters };
      
      if (search) {
        combinedFilters.q = search;
      }
      
      // Prepare params
      const params: GetListParams = {
        resource,
        pagination: { page, perPage: pageSize },
        filter: combinedFilters,
      };
      
      if (sort) {
        params.sort = sort;
      }
      
      // Fetch data
      const result = await dataProvider.getList(params);
      
      setData(result.data as RecordType[]);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [resource, dataProvider, page, pageSize, sort, search, filters]);

  // Auto-load data
  useEffect(() => {
    if (autoLoad) {
      fetchData();
    }
  }, [autoLoad, fetchData]);

  // Toggle column visibility
  const toggleColumn = useCallback((column: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      }
      return [...prev, column];
    });
  }, []);

  // Edit row
  const editRow = useCallback((row: RecordType) => {
    setEditingRow(row);
  }, []);

  // Update row
  const updateRow = useCallback(async (row: RecordType) => {
    setLoading(true);
    setError(null);
    
    try {
      const rowId = (row as Record<string, unknown>).id;
      
      if (!rowId) {
        throw new Error('Row must have an id field');
      }
      
      // Ensure id is string or number
      const id = typeof rowId === 'string' || typeof rowId === 'number' 
        ? rowId 
        : String(rowId);
      
      await dataProvider.update({
        resource,
        id,
        variables: row,
      });
      
      // Refresh data
      fetchData();
      
      // Clear editing state
      setEditingRow(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [resource, dataProvider, fetchData]);

  // Delete row
  const deleteRow = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      await dataProvider.deleteOne({
        resource,
        id,
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [resource, dataProvider, fetchData]);

  return {
    // Data state
    data,
    total,
    loading,
    error,
    
    // Pagination state
    page,
    setPage,
    pageSize,
    setPageSize,
    
    // Sorting state
    sort,
    setSort,
    
    // Search state
    search,
    setSearch,
    
    // Filtering state
    filters,
    setFilters,
    
    // Column visibility
    visibleColumns,
    toggleColumn,
    
    // Row editing
    editingRow,
    setEditingRow,
    
    // Row operations
    editRow,
    updateRow,
    deleteRow,
    
    // Refresh data
    refresh: fetchData,
  };
}

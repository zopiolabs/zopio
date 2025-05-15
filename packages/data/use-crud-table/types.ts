export type Sorter = { field: string; order: "asc" | "desc" };

export interface ConditionalFilter {
  field: string;
  operator: string;
  value: any;
  condition?: boolean;
}

export interface UseCrudTableOptions {
  resource: string;
  initialPageSize?: number;
  initialCurrent?: number;
  initialSorters?: Sorter[];
  initialFilters?: ConditionalFilter[];
  searchableFields?: string[];
  meta?: Record<string, any>;
}

export interface UseCrudTableReturn {
  data: any[];
  total: number;
  loading: boolean;
  error?: Error;

  current: number;
  pageSize: number;
  setCurrent: (page: number) => void;
  setPageSize: (size: number) => void;

  filters: ConditionalFilter[];
  setFilters: (filters: ConditionalFilter[]) => void;

  sorters: Sorter[];
  setSorters: (sorters: Sorter[]) => void;

  search: string;
  setSearch: (term: string) => void;

  refetch: () => void;
}

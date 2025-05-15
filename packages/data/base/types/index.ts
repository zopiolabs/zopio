/**
 * Core data types for Zopio framework
 */

// Common data operation parameters
export type DataParams = {
  resource: string;
  id?: number | string;
  variables?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

// Standard result type for data operations
export type DataResult<T = unknown> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

/**
 * Basic data provider interface
 * Compatible with the old data-core module
 */
export type DataProvider = {
  getOne: (params: DataParams) => Promise<unknown>;
  getList: (params: DataParams) => Promise<unknown[]>;
  create: (params: DataParams) => Promise<unknown>;
  update: (params: DataParams) => Promise<unknown>;
  delete: (params: DataParams) => Promise<unknown>;
};

// CRUD Provider interface
export interface CrudProvider {
  getList: <RecordType = unknown>(params: GetListParams) => Promise<GetListResult<RecordType | unknown>>;
  getOne: <RecordType = unknown>(params: GetOneParams) => Promise<GetOneResult<RecordType | unknown>>;
  create: <RecordType = unknown>(params: CreateParams<RecordType | unknown>) => Promise<CreateResult<RecordType | unknown>>;
  update: <RecordType = unknown>(params: UpdateParams<RecordType | unknown>) => Promise<UpdateResult<RecordType | unknown>>;
  deleteOne: <RecordType = unknown>(params: DeleteParams) => Promise<DeleteResult<RecordType | unknown>>;
}

// Get list operation parameters
export interface GetListParams {
  resource: string;
  pagination?: { page: number; perPage: number };
  sort?: { field: string; order: 'asc' | 'desc' };
  filter?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

// Get list operation result
export interface GetListResult<RecordType = unknown> {
  data: RecordType[];
  total: number;
  meta?: Record<string, unknown>;
}

// Get one operation parameters
export interface GetOneParams {
  resource: string;
  id: string | number;
  meta?: Record<string, unknown>;
}

// Get one operation result
export interface GetOneResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

// Create operation parameters
export interface CreateParams<RecordType = unknown> {
  resource: string;
  variables: RecordType;
  meta?: Record<string, unknown>;
}

// Create operation result
export interface CreateResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

// Update operation parameters
export interface UpdateParams<RecordType = unknown> {
  resource: string;
  id: string | number;
  variables: Partial<RecordType>;
  meta?: Record<string, unknown>;
}

// Update operation result
export interface UpdateResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

// Delete operation parameters
export interface DeleteParams {
  resource: string;
  id: string | number;
  meta?: Record<string, unknown>;
}

// Delete operation result
export interface DeleteResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

// Advanced query parameters
export interface AdvancedQueryParams {
  select?: string[];
  include?: Record<string, unknown>;
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  groupBy?: string[];
  having?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  distinct?: boolean;
  count?: boolean;
}

// Batch operation parameters
export interface BatchParams {
  operations: {
    type: 'create' | 'update' | 'delete';
    resource: string;
    params: CreateParams | UpdateParams | DeleteParams;
  }[];
}

// Batch operation result
export interface BatchResult {
  data: unknown[];
  errors: (Error | null)[];
}

// Transaction parameters
export interface TransactionParams {
  operations: {
    type: 'create' | 'update' | 'delete';
    resource: string;
    params: CreateParams | UpdateParams | DeleteParams;
  }[];
}

// Transaction result
export interface TransactionResult {
  data: unknown[];
  success: boolean;
}

// Extended CRUD provider with additional operations
export interface ExtendedCrudProvider extends CrudProvider {
  batch?: (params: BatchParams) => Promise<BatchResult>;
  transaction?: (params: TransactionParams) => Promise<TransactionResult>;
  query?: (params: { resource: string; query: AdvancedQueryParams }) => Promise<GetListResult>;
}

// Provider types for data-provider selection
export type ProviderType =
  | "rest"
  | "graphql"
  | "firebase"
  | "supabase"
  | "mock"
  | "local"
  | "airtable"
  | "medusa"
  | "drizzle"
  | "kysely"
  | "xata"
  | "neon"
  | "odoo"
  | "sap"
  | "zopio"
  | "prisma"
  | "syncops"
  | "github"
  | "notion"
  | "baserow"
  | "nocodb"
  | "google-sheets"
  | "n8n"
  | "temporal"
  | "killbill"
  | "stripe"
  | "formbricks"
  | "shopify"
  | "custom";

// Provider configuration options
export interface CreateDataProviderOptions {
  type: ProviderType;
  config?: Record<string, unknown>;
}

// Authentication options for providers
export interface AuthOptions {
  type: 'bearer' | 'basic' | 'apiKey' | 'oauth' | 'custom';
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  headerName?: string;
  queryParamName?: string;
  oauthConfig?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: string;
  };
  custom?: Record<string, unknown>;
}

// Pagination types
export type PaginationType = 'offset' | 'cursor' | 'page' | 'none';

export interface OffsetPagination {
  type: 'offset';
  limit: number;
  offset: number;
}

export interface CursorPagination {
  type: 'cursor';
  limit: number;
  cursor?: string;
}

export interface PagePagination {
  type: 'page';
  page: number;
  perPage: number;
}

export type Pagination = OffsetPagination | CursorPagination | PagePagination | { type: 'none' };

// Filter operators
export type FilterOperator =
  | 'eq' | 'neq'
  | 'gt' | 'gte'
  | 'lt' | 'lte'
  | 'in' | 'nin'
  | 'contains' | 'ncontains'
  | 'startsWith' | 'endsWith'
  | 'between'
  | 'null' | 'nnull'
  | 'or' | 'and';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface ComplexFilter {
  operator: 'or' | 'and';
  conditions: (FilterCondition | ComplexFilter)[];
}

export type Filter = FilterCondition | ComplexFilter | Record<string, unknown>;

// Sort options
export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

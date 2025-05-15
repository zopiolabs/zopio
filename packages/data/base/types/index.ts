/**
 * Core data types for Zopio framework
 * 
 * This module defines the fundamental types and interfaces used across the Zopio data layer.
 * It provides a standardized foundation for data operations that all providers implement.
 */

/**
 * Common parameters for data operations
 * 
 * @property resource - The name of the resource/entity being operated on
 * @property id - Optional identifier for the resource
 * @property variables - Optional data to be sent with the request
 * @property query - Optional query parameters
 */
export type DataParams = {
  resource: string;
  id?: number | string;
  variables?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

/**
 * Standard result type for data operations
 * 
 * @property data - The data returned from the operation, or null if no data
 * @property error - Any error that occurred during the operation, or null if successful
 * @property loading - Whether the operation is still in progress
 */
export type DataResult<T = unknown> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

/**
 * Basic data provider interface
 * Compatible with the old data-core module
 * 
 * This is a simpler interface than CrudProvider, maintained for backward compatibility.
 * New code should use the CrudProvider interface instead.
 */
export type DataProvider = {
  getOne: (params: DataParams) => Promise<unknown>;
  getList: (params: DataParams) => Promise<unknown[]>;
  create: (params: DataParams) => Promise<unknown>;
  update: (params: DataParams) => Promise<unknown>;
  delete: (params: DataParams) => Promise<unknown>;
};

/**
 * CRUD Provider interface
 * 
 * This is the core interface that all data providers must implement.
 * It defines the standard CRUD operations (Create, Read, Update, Delete)
 * that can be performed on resources.
 */
export interface CrudProvider {
  getList: <RecordType = unknown>(params: GetListParams) => Promise<GetListResult<RecordType | unknown>>;
  getOne: <RecordType = unknown>(params: GetOneParams) => Promise<GetOneResult<RecordType | unknown>>;
  create: <RecordType = unknown>(params: CreateParams<RecordType | unknown>) => Promise<CreateResult<RecordType | unknown>>;
  update: <RecordType = unknown>(params: UpdateParams<RecordType | unknown>) => Promise<UpdateResult<RecordType | unknown>>;
  deleteOne: <RecordType = unknown>(params: DeleteParams) => Promise<DeleteResult<RecordType | unknown>>;
}

/**
 * Parameters for retrieving a list of resources
 * 
 * @property resource - The name of the resource/entity to retrieve
 * @property pagination - Optional pagination parameters
 * @property sort - Optional sorting parameters
 * @property filter - Optional filtering criteria
 * @property meta - Optional provider-specific metadata
 */
export interface GetListParams {
  resource: string;
  pagination?: { page: number; perPage: number };
  sort?: { field: string; order: 'asc' | 'desc' };
  filter?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

/**
 * Result of retrieving a list of resources
 * 
 * @property data - Array of records retrieved
 * @property total - Total count of records matching the criteria (for pagination)
 * @property meta - Optional provider-specific metadata
 */
export interface GetListResult<RecordType = unknown> {
  data: RecordType[];
  total: number;
  meta?: Record<string, unknown>;
}

/**
 * Parameters for retrieving a single resource
 * 
 * @property resource - The name of the resource/entity to retrieve
 * @property id - The identifier of the specific resource
 * @property meta - Optional provider-specific metadata
 */
export interface GetOneParams {
  resource: string;
  id: string | number;
  meta?: Record<string, unknown>;
}

/**
 * Result of retrieving a single resource
 * 
 * @property data - The retrieved record
 * @property meta - Optional provider-specific metadata
 */
export interface GetOneResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

/**
 * Parameters for creating a new resource
 * 
 * @property resource - The name of the resource/entity to create
 * @property variables - The data for the new resource
 * @property meta - Optional provider-specific metadata
 */
export interface CreateParams<RecordType = unknown> {
  resource: string;
  variables: RecordType;
  meta?: Record<string, unknown>;
}

/**
 * Result of creating a new resource
 * 
 * @property data - The created record, typically including any server-generated fields
 * @property meta - Optional provider-specific metadata
 */
export interface CreateResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

/**
 * Parameters for updating an existing resource
 * 
 * @property resource - The name of the resource/entity to update
 * @property id - The identifier of the specific resource
 * @property variables - The data to update (partial update is supported)
 * @property meta - Optional provider-specific metadata
 */
export interface UpdateParams<RecordType = unknown> {
  resource: string;
  id: string | number;
  variables: Partial<RecordType>;
  meta?: Record<string, unknown>;
}

/**
 * Result of updating an existing resource
 * 
 * @property data - The updated record
 * @property meta - Optional provider-specific metadata
 */
export interface UpdateResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

/**
 * Parameters for deleting a resource
 * 
 * @property resource - The name of the resource/entity to delete
 * @property id - The identifier of the specific resource
 * @property meta - Optional provider-specific metadata
 */
export interface DeleteParams {
  resource: string;
  id: string | number;
  meta?: Record<string, unknown>;
}

/**
 * Result of deleting a resource
 * 
 * @property data - The deleted record or confirmation data
 * @property meta - Optional provider-specific metadata
 */
export interface DeleteResult<RecordType = unknown> {
  data: RecordType;
  meta?: Record<string, unknown>;
}

/**
 * Advanced query parameters for complex data operations
 * 
 * These parameters provide SQL-like capabilities for querying data.
 * Not all providers support all of these features.
 * 
 * @property select - Fields to include in the result
 * @property include - Related resources to include (for relational data)
 * @property where - Filtering conditions
 * @property orderBy - Sorting criteria
 * @property groupBy - Fields to group by
 * @property having - Filtering conditions for grouped data
 * @property limit - Maximum number of records to return
 * @property offset - Number of records to skip
 * @property distinct - Whether to return only distinct records
 * @property count - Whether to return only the count of matching records
 */
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

/**
 * Parameters for batch operations
 * 
 * Batch operations allow multiple CRUD operations to be performed in a single request.
 * This can improve performance by reducing the number of network requests.
 * 
 * @property operations - Array of operations to perform
 */
export interface BatchParams {
  operations: {
    type: 'create' | 'update' | 'delete';
    resource: string;
    params: CreateParams | UpdateParams | DeleteParams;
  }[];
}

/**
 * Result of batch operations
 * 
 * @property data - Array of results from each operation
 * @property errors - Array of errors from each operation (null if successful)
 */
export interface BatchResult {
  data: unknown[];
  errors: (Error | null)[];
}

/**
 * Parameters for transaction operations
 * 
 * Transactions ensure that multiple operations are performed atomically.
 * Either all operations succeed, or none of them are applied.
 * 
 * @property operations - Array of operations to perform in the transaction
 */
export interface TransactionParams {
  operations: {
    type: 'create' | 'update' | 'delete';
    resource: string;
    params: CreateParams | UpdateParams | DeleteParams;
  }[];
}

/**
 * Result of transaction operations
 * 
 * @property data - Array of results from each operation
 * @property success - Whether the transaction was successful
 */
export interface TransactionResult {
  data: unknown[];
  success: boolean;
}

/**
 * Extended CRUD provider with additional operations
 * 
 * This interface extends the basic CrudProvider with additional operations
 * that some providers may support, such as batch operations, transactions,
 * and advanced queries.
 */
export interface ExtendedCrudProvider extends CrudProvider {
  batch?: (params: BatchParams) => Promise<BatchResult>;
  transaction?: (params: TransactionParams) => Promise<TransactionResult>;
  query?: (params: { resource: string; query: AdvancedQueryParams }) => Promise<GetListResult>;
}

/**
 * Provider types for data-provider selection
 * 
 * This enum defines all the supported provider types in the Zopio ecosystem.
 * It is used when creating a data provider with createDataProvider().
 */
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

/**
 * Provider configuration options
 * 
 * @property type - The type of provider to create
 * @property config - Provider-specific configuration options
 */
export interface CreateDataProviderOptions {
  type: ProviderType;
  config?: Record<string, unknown>;
}

/**
 * Authentication options for providers
 * 
 * @property type - The type of authentication to use
 * @property token - Token for bearer authentication
 * @property username - Username for basic authentication
 * @property password - Password for basic authentication
 * @property apiKey - API key for apiKey authentication
 * @property apiKeyName - Name of the API key header or parameter
 * @property apiKeyLocation - Where to place the API key (header, query, etc.)
 * @property oauthToken - OAuth token
 * @property oauthTokenType - OAuth token type
 * @property customAuth - Custom authentication data
 */
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

// Shared types for CRUD operations
import type { ZodType } from 'zod';
import type { NextRequest } from 'next/server';

// Base model interface that all models should implement
export interface BaseModel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Record type for include relations
export type IncludeRelations = Record<string, boolean | { select?: Record<string, boolean> }>;

// Type for where conditions
export type WhereConditions<T> = Partial<T> | Record<string, unknown>;

// Type for orderBy
export type OrderBy<T> = { [K in keyof T]?: 'asc' | 'desc' };

// Generic database model interface
export interface DatabaseModel<T extends BaseModel = BaseModel> {
  create: (args: { data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> }) => Promise<T>;
  findUnique: (args: { where: { id: string }, include?: IncludeRelations }) => Promise<T | null>;
  findMany: (args?: { 
    where?: WhereConditions<T>, 
    include?: IncludeRelations, 
    orderBy?: OrderBy<T>, 
    take?: number, 
    skip?: number 
  }) => Promise<T[]>;
  update: (args: { where: { id: string }, data: Partial<T> }) => Promise<T>;
  delete: (args: { where: { id: string } }) => Promise<T>;
  count: (args?: { where?: WhereConditions<T> }) => Promise<number>;
}

// Hook function types
export type BeforeHook<T> = (data: T, req: NextRequest) => Promise<T> | T;
export type AfterHook<T, R = unknown> = (data: T) => R;

// Query parameters interface
export interface QueryParams {
  id?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | undefined;
}

// Pagination result interface
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// CRUD handler options interfaces
export interface CreateHandlerOptions<T extends Partial<BaseModel>, R = T> {
  model: DatabaseModel<T>;
  schema?: ZodType<T>;
  beforeHook?: BeforeHook<T>;
  afterHook?: AfterHook<T, R>;
}

export interface ReadHandlerOptions<T extends BaseModel, R = T> {
  model: DatabaseModel<T>;
  include?: IncludeRelations;
  afterHook?: AfterHook<T, R>;
}

export interface ReadManyHandlerOptions<T extends BaseModel, R = T[]> {
  model: DatabaseModel<T>;
  include?: IncludeRelations;
  defaultLimit?: number;
  maxLimit?: number;
  afterHook?: AfterHook<T[], R>;
  filterHook?: (params: QueryParams) => WhereConditions<T>;
}

export interface UpdateHandlerOptions<T extends BaseModel, R = T> {
  model: DatabaseModel<T>;
  schema?: ZodType<Partial<T>>;
  beforeHook?: BeforeHook<Partial<T>>;
  afterHook?: AfterHook<T, R>;
}

export interface DeleteHandlerOptions<T extends BaseModel, R = T> {
  model: DatabaseModel<T>;
  softDelete?: boolean;
  afterHook?: AfterHook<T, R>;
}

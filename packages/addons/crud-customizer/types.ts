/**
 * Types for the CRUD provider customizer addon
 */

import type {
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult
} from '../../data/base/types/index.js';

/**
 * Middleware function type for transforming input parameters
 */
export type MiddlewareFn<P = unknown> = (input: P) => Promise<P>;

/**
 * Afterware function type for transforming output results
 */
export type AfterwareFn<R = unknown> = (output: R) => Promise<R>;

/**
 * Customizer options for each CRUD operation
 */
export interface CustomizerOptions {
  getList?: {
    before?: MiddlewareFn<GetListParams>;
    after?: AfterwareFn<GetListResult>;
  };
  getOne?: {
    before?: MiddlewareFn<GetOneParams>;
    after?: AfterwareFn<GetOneResult>;
  };
  create?: {
    before?: MiddlewareFn<CreateParams>;
    after?: AfterwareFn<CreateResult>;
  };
  update?: {
    before?: MiddlewareFn<UpdateParams>;
    after?: AfterwareFn<UpdateResult>;
  };
  deleteOne?: {
    before?: MiddlewareFn<DeleteParams>;
    after?: AfterwareFn<DeleteResult>;
  };
}
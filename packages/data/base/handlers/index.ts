/**
 * Core CRUD operation handlers
 */

import type {
  CreateParams,
  CreateResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  UpdateResult
} from '../types/index.js';

/**
 * Default implementation for getList operation
 * Can be extended by specific providers
 */
export async function getList<RecordType = unknown>(
  _params: GetListParams
): Promise<GetListResult<RecordType>> {
  // Add minimal await to satisfy linter
  await Promise.resolve();
  throw new Error('getList method not implemented');
}

/**
 * Default implementation for getOne operation
 * Can be extended by specific providers
 */
export async function getOne<RecordType = unknown>(
  _params: GetOneParams
): Promise<GetOneResult<RecordType>> {
  // Add minimal await to satisfy linter
  await Promise.resolve();
  throw new Error('getOne method not implemented');
}

/**
 * Default implementation for create operation
 * Can be extended by specific providers
 */
export async function create<RecordType = unknown>(
  _params: CreateParams<RecordType>
): Promise<CreateResult<RecordType>> {
  // Add minimal await to satisfy linter
  await Promise.resolve();
  throw new Error('create method not implemented');
}

/**
 * Default implementation for update operation
 * Can be extended by specific providers
 */
export async function update<RecordType = unknown>(
  _params: UpdateParams<RecordType>
): Promise<UpdateResult<RecordType>> {
  // Add minimal await to satisfy linter
  await Promise.resolve();
  throw new Error('update method not implemented');
}

/**
 * Default implementation for deleteOne operation
 * Can be extended by specific providers
 */
export async function deleteOne<RecordType = unknown>(
  _params: DeleteParams
): Promise<DeleteResult<RecordType>> {
  // Add minimal await to satisfy linter
  await Promise.resolve();
  throw new Error('deleteOne method not implemented');
}

/**
 * Utility functions for handlers
 */
export * from './utils.js';

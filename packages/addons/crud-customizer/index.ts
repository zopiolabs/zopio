/**
 * CRUD Provider Customizer
 * 
 * This addon allows customizing CRUD providers by adding middleware
 * functions that run before and after each CRUD operation.
 */

import type { 
  CrudProvider,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams
} from '../../data/base/types/index.js';
import type { CustomizerOptions } from './types.js';

/**
 * Creates a customized CRUD provider by wrapping an existing provider
 * with middleware functions that run before and after each operation.
 * 
 * @param provider - The original CRUD provider to customize
 * @param options - Configuration options for customization
 * @returns A new CRUD provider with the customizations applied
 */
export function customizeCrudProvider(
  provider: CrudProvider,
  options: CustomizerOptions
): CrudProvider {
  // Type-safe wrapper for getList method
  const wrapGetList = async (params: GetListParams) => {
    try {
      const methodOptions = options.getList;
      const before = methodOptions?.before;
      const after = methodOptions?.after;

      const input = before ? await before(params) : params;
      const result = await provider.getList(input);
      return after ? await after(result) : result;
    } catch (error) {
      throw error instanceof Error 
        ? new Error(`Error in customized getList operation: ${error.message}`) 
        : new Error('Unknown error in customized getList operation');
    }
  };

  // Type-safe wrapper for getOne method
  const wrapGetOne = async (params: GetOneParams) => {
    try {
      const methodOptions = options.getOne;
      const before = methodOptions?.before;
      const after = methodOptions?.after;

      const input = before ? await before(params) : params;
      const result = await provider.getOne(input);
      return after ? await after(result) : result;
    } catch (error) {
      throw error instanceof Error 
        ? new Error(`Error in customized getOne operation: ${error.message}`) 
        : new Error('Unknown error in customized getOne operation');
    }
  };

  // Type-safe wrapper for create method
  const wrapCreate = async <T = unknown>(params: CreateParams<T>) => {
    try {
      const methodOptions = options.create;
      const before = methodOptions?.before;
      const after = methodOptions?.after;

      const input = before ? await before(params) : params;
      const result = await provider.create(input);
      return after ? await after(result) : result;
    } catch (error) {
      throw error instanceof Error 
        ? new Error(`Error in customized create operation: ${error.message}`) 
        : new Error('Unknown error in customized create operation');
    }
  };

  // Type-safe wrapper for update method
  const wrapUpdate = async <T = unknown>(params: UpdateParams<T>) => {
    try {
      const methodOptions = options.update;
      const before = methodOptions?.before;
      const after = methodOptions?.after;

      const input = before ? await before(params) : params;
      const result = await provider.update(input);
      return after ? await after(result) : result;
    } catch (error) {
      throw error instanceof Error 
        ? new Error(`Error in customized update operation: ${error.message}`) 
        : new Error('Unknown error in customized update operation');
    }
  };

  // Type-safe wrapper for deleteOne method
  const wrapDeleteOne = async (params: DeleteParams) => {
    try {
      const methodOptions = options.deleteOne;
      const before = methodOptions?.before;
      const after = methodOptions?.after;

      const input = before ? await before(params) : params;
      const result = await provider.deleteOne(input);
      return after ? await after(result) : result;
    } catch (error) {
      throw error instanceof Error 
        ? new Error(`Error in customized deleteOne operation: ${error.message}`) 
        : new Error('Unknown error in customized deleteOne operation');
    }
  };

  // Return a new provider with all methods wrapped with type-safe implementations
  return {
    getList: wrapGetList,
    getOne: wrapGetOne,
    create: wrapCreate,
    update: wrapUpdate,
    deleteOne: wrapDeleteOne,
  };
}
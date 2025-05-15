/**
 * Mock data provider for testing and development
 */

import type { 
  CrudProvider, 
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
} from '@repo/data-base';

/**
 * Create a mock data provider that returns empty data
 */
export function createMockProvider(): CrudProvider {
  const getList = async (): Promise<GetListResult> => {
    return { data: [], total: 0 };
  };

  const getOne = async (): Promise<GetOneResult> => {
    return { data: {} };
  };

  const create = async (): Promise<CreateResult> => {
    return { data: {} };
  };

  const update = async (): Promise<UpdateResult> => {
    return { data: {} };
  };

  const deleteOne = async (): Promise<DeleteResult> => {
    return { data: {} };
  };

  return {
    getList,
    getOne,
    create,
    update,
    deleteOne
  };
}

/**
 * Create a mock data provider with custom data
 */
export function createMockProviderWithData<T = any>(mockData: Record<string, T[]>): CrudProvider {
  const getList = async ({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult<T>> => {
    const data = mockData[resource] || [];
    
    // Apply filters if provided
    let filteredData = data;
    if (filter && Object.keys(filter).length > 0) {
      filteredData = data.filter(item => {
        return Object.entries(filter).every(([key, value]) => {
          if (value === undefined || value === null) {
            return true;
          }
          
          if (typeof value === 'string' && item[key]) {
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          }
          
          return item[key] === value;
        });
      });
    }
    
    // Apply sorting if provided
    if (sort && sort.field) {
      filteredData = [...filteredData].sort((a, b) => {
        if (a[sort.field] == null) return sort.order === 'asc' ? -1 : 1;
        if (b[sort.field] == null) return sort.order === 'asc' ? 1 : -1;
        
        if (typeof a[sort.field] === 'string' && typeof b[sort.field] === 'string') {
          return sort.order === 'asc'
            ? a[sort.field].localeCompare(b[sort.field])
            : b[sort.field].localeCompare(a[sort.field]);
        }
        
        return sort.order === 'asc'
          ? a[sort.field] - b[sort.field]
          : b[sort.field] - a[sort.field];
      });
      const data = mockData[resource] || [];
      const index = data.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error(`Item with id ${id} not found in resource ${resource}`);
      }
      
      const deletedItem = data[index];
      mockData[resource] = data.filter(item => item.id !== id);
      
      return { data: deletedItem };
    }
  };
}

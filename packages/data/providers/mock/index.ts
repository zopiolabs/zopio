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
  const getList = (): Promise<GetListResult> => {
    return Promise.resolve({ data: [], total: 0 });
  };

  const getOne = (): Promise<GetOneResult> => {
    return Promise.resolve({ data: {} });
  };

  const create = (): Promise<CreateResult> => {
    return Promise.resolve({ data: {} });
  };

  const update = (): Promise<UpdateResult> => {
    return Promise.resolve({ data: {} });
  };

  const deleteOne = (): Promise<DeleteResult> => {
    return Promise.resolve({ data: {} });
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
export function createMockProviderWithData<T extends Record<string, unknown>>(mockData: Record<string, T[]>): CrudProvider {
  const getList = async ({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> => {
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
    if (sort?.field) {
      // Create a copy of the array for sorting
      filteredData = [...filteredData];
      
      // Extract the sort function to reduce complexity
      const compareValues = (a: Record<string, unknown>, b: Record<string, unknown>, field: string, isAsc: boolean): number => {
        // Handle null values
        if (a[field] == null) { 
          return isAsc ? -1 : 1; 
        }
        if (b[field] == null) { 
          return isAsc ? 1 : -1; 
        }
        
        // Handle string values
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return isAsc ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
        }
        
        // Handle numeric values
        if (typeof a[field] === 'number' && typeof b[field] === 'number') {
          return isAsc ? a[field] - b[field] : b[field] - a[field];
        }
        
        // Default comparison for other types
        return isAsc ? 0 : 0;
      };
      
      // Sort the data
      const isAscending = sort.order === 'asc';
      filteredData.sort((a, b) => compareValues(a, b, sort.field, isAscending));
    }
    
    // Apply pagination if provided
    let paginatedData = filteredData;
    if (pagination) {
      const { page = 1, perPage = 10 } = pagination;
      const start = (page - 1) * perPage;
      paginatedData = filteredData.slice(start, start + perPage);
    }
    
    return { 
      data: paginatedData as unknown[], 
      total: filteredData.length 
    };
  };
  
  const getOne = async ({ resource, id }: GetOneParams): Promise<GetOneResult> => {
    const data = mockData[resource] || [];
    const item = data.find(item => item.id === id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found in resource ${resource}`);
    }
    
    return { data: item };
  };
  
  const create = async ({ resource, variables }: CreateParams): Promise<CreateResult> => {
    // Add await to satisfy the linter
    await Promise.resolve();
    
    const data = mockData[resource] || [];
    // Calculate new ID safely without spread
    let maxId = 0;
    for (const item of data) {
      if (typeof item.id === 'number' && item.id > maxId) {
        maxId = item.id;
      }
    }
    const newId = maxId + 1;
    
    // Create new item with variables
    const newItem = { id: newId } as unknown as T;
    
    // Copy all properties from variables to newItem
    if (variables && typeof variables === 'object') {
      Object.assign(newItem, variables);
    }
    
    if (!mockData[resource]) {
      mockData[resource] = [];
    }
    
    mockData[resource].push(newItem);
    
    return { data: newItem };
  };
  
  const update = async ({ resource, id, variables }: UpdateParams): Promise<UpdateResult> => {
    const data = mockData[resource] || [];
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in resource ${resource}`);
    }
    
    // Create updated item safely
    const updatedItem = {} as Record<string, unknown>;
    
    // Copy properties from original item
    Object.assign(updatedItem, data[index]);
    
    // Copy properties from variables
    if (variables && typeof variables === 'object') {
      Object.assign(updatedItem, variables);
    }
    
    mockData[resource][index] = updatedItem as unknown as T;
    
    return { data: updatedItem as unknown as T };
  };
  
  const deleteOne = async ({ resource, id }: DeleteParams): Promise<DeleteResult> => {
    const data = mockData[resource] || [];
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in resource ${resource}`);
    }
    
    const deletedItem = data[index];
    mockData[resource] = data.filter(item => item.id !== id);
    
    return { data: deletedItem };
  };
  
  return {
    getList,
    getOne,
    create,
    update,
    deleteOne
  };
}

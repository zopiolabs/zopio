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
  return {
    async getList(): Promise<GetListResult> {
      return { data: [], total: 0 };
    },
    
    async getOne(): Promise<GetOneResult> {
      return { data: {} };
    },
    
    async create(): Promise<CreateResult> {
      return { data: {} };
    },
    
    async update(): Promise<UpdateResult> {
      return { data: {} };
    },
    
    async deleteOne(): Promise<DeleteResult> {
      return { data: {} };
    }
  };
}

/**
 * Create a mock data provider with custom data
 */
export function createMockProviderWithData<T = any>(mockData: Record<string, T[]>): CrudProvider {
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult<T>> {
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
      }
      
      // Apply pagination if provided
      let paginatedData = filteredData;
      if (pagination) {
        const { page, perPage } = pagination;
        const start = (page - 1) * perPage;
        paginatedData = filteredData.slice(start, start + perPage);
      }
      
      return {
        data: paginatedData,
        total: filteredData.length
      };
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult<T>> {
      const data = mockData[resource] || [];
      const item = data.find(item => item.id === id);
      
      if (!item) {
        throw new Error(`Item with id ${id} not found in resource ${resource}`);
      }
      
      return { data: item };
    },
    
    async create({ resource, variables }: CreateParams<T>): Promise<CreateResult<T>> {
      if (!mockData[resource]) {
        mockData[resource] = [];
      }
      
      const newId = Math.max(0, ...mockData[resource].map(item => Number(item.id) || 0)) + 1;
      const newItem = { id: newId, ...variables };
      
      mockData[resource].push(newItem);
      
      return { data: newItem };
    },
    
    async update({ resource, id, variables }: UpdateParams<T>): Promise<UpdateResult<T>> {
      const data = mockData[resource] || [];
      const index = data.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error(`Item with id ${id} not found in resource ${resource}`);
      }
      
      const updatedItem = { ...data[index], ...variables };
      data[index] = updatedItem;
      
      return { data: updatedItem };
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult<T>> {
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

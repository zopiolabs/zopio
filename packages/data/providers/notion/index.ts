/**
 * Notion provider implementation
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

export interface NotionProviderConfig {
  apiKey: string;
  databaseMapping: Record<string, string>; // Maps resource names to database IDs
  propertyMapping?: Record<string, Record<string, string>>; // Maps resource fields to Notion properties
}

/**
 * Create a Notion provider
 */
export function createNotionProvider(config: NotionProviderConfig): CrudProvider {
  const { 
    apiKey, 
    databaseMapping,
    propertyMapping = {}
  } = config;

  // Helper to get database ID from resource name
  const getDatabaseId = (resource: string): string => {
    const databaseId = databaseMapping[resource];
    if (!databaseId) {
      throw new Error(`Database mapping not found for resource: ${resource}`);
    }
    return databaseId;
  };

  // Helper to build URLs
  const buildUrl = (endpoint: string): string => {
    return `https://api.notion.com/v1/${endpoint}`;
  };

  // Default headers
  type HeadersType = {
    'Authorization': string;
    'Content-Type': string;
    'Notion-Version': string;
  };

  const headers: HeadersType = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  };

  // Define types for Notion API responses
  interface NotionPage {
    id: string;
    properties: Record<string, NotionProperty>;
  }

  interface NotionProperty {
    type: string;
    [key: string]: unknown;
  }

  // Helper to transform Notion page to data object
  const transformPageToData = (page: NotionPage, resource: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {
      id: page.id
    };
    
    const properties = page.properties;
    const mapping = propertyMapping[resource] || {};
    
    // Extract properties based on mapping or use property names directly
    for (const [fieldName, propertyName] of Object.entries(mapping)) {
      const property = properties[propertyName];
      if (property) {
        result[fieldName] = extractPropertyValue(property);
      }
    }
    
    // If no mapping is provided, extract all properties
    if (Object.keys(mapping).length === 0) {
      for (const [propertyName, property] of Object.entries(properties)) {
        result[propertyName] = extractPropertyValue(property);
      }
    }
    
    return result;
  };
  
  // Helper to extract value from Notion property
  const extractPropertyValue = (property: NotionProperty): unknown => {
    const type = property.type;
    
    switch (type) {
      case 'title':
        return (property.title as Array<{ plain_text: string }>).map(t => t.plain_text).join('');
      case 'rich_text':
        return (property.rich_text as Array<{ plain_text: string }>).map(t => t.plain_text).join('');
      case 'number':
        return property.number as number;
      case 'select':
        return (property.select as { name: string } | null)?.name;
      case 'multi_select':
        return (property.multi_select as Array<{ name: string }>).map(s => s.name);
      case 'date':
        return (property.date as { start: string } | null)?.start;
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'formula':
        {
          const formula = property.formula as { type: string; [key: string]: unknown };
          return extractPropertyValue({ type: formula.type, [formula.type]: formula[formula.type] } as NotionProperty);
        }
      case 'relation':
        return (property.relation as Array<{ id: string }>).map(r => r.id);
      case 'rollup':
        {
          const rollup = property.rollup as { type: string; [key: string]: unknown };
          return rollup[rollup.type];
        }
      case 'created_time':
        return property.created_time;
      case 'created_by':
        return (property.created_by as { id: string }).id;
      case 'last_edited_time':
        return property.last_edited_time;
      case 'last_edited_by':
        return (property.last_edited_by as { id: string }).id;
      default:
        return null;
    }
  };
  
  // Helper to transform data object to Notion properties
  const transformDataToProperties = (data: Record<string, unknown>, resource: string): Record<string, unknown> => {
    const mapping = propertyMapping[resource] || {};
    
    // Use mapping if provided
    if (Object.keys(mapping).length > 0) {
      return transformWithMapping(data, mapping);
    }
    
    // If no mapping is provided, use field names directly
    return transformWithoutMapping(data);
  };
  
  // Helper function to transform data using property mapping
  const transformWithMapping = (data: Record<string, unknown>, mapping: Record<string, string>): Record<string, unknown> => {
    const properties: Record<string, unknown> = {};
    
    for (const [fieldName, propertyName] of Object.entries(mapping)) {
      if (data[fieldName] !== undefined) {
        properties[propertyName] = createPropertyValue(fieldName, data[fieldName]);
      }
    }
    
    return properties;
  };
  
  // Helper function to transform data without property mapping
  const transformWithoutMapping = (data: Record<string, unknown>): Record<string, unknown> => {
    const properties: Record<string, unknown> = {};
    
    for (const [fieldName, value] of Object.entries(data)) {
      if (fieldName !== 'id') {
        properties[fieldName] = createPropertyValue(fieldName, value);
      }
    }
    
    return properties;
  };
  
  // Helper to create Notion property value
  const createPropertyValue = (fieldName: string, value: unknown): unknown => {
    // Handle different value types with specialized functions
    if (typeof value === 'string') {
      return createStringProperty(fieldName, value);
    }
    if (typeof value === 'number') {
      return createNumberProperty(value);
    }
    if (typeof value === 'boolean') {
      return createBooleanProperty(value);
    }
    if (value instanceof Date) {
      return createDateProperty(value);
    }
    if (Array.isArray(value)) {
      return createArrayProperty(value);
    }
    
    // Default fallback
    return createDefaultProperty(value);
  };

  // Helper functions for different property types
  const createStringProperty = (fieldName: string, value: string): unknown => {
    if (fieldName.toLowerCase().includes('title')) {
      return {
        title: [
          {
            text: {
              content: value
            }
          }
        ]
      };
    }
    
    return {
      rich_text: [
        {
          text: {
            content: value
          }
        }
      ]
    };
  };

  const createNumberProperty = (value: number): unknown => {
    return {
      number: value
    };
  };

  const createBooleanProperty = (value: boolean): unknown => {
    return {
      checkbox: value
    };
  };

  const createDateProperty = (value: Date): unknown => {
    return {
      date: {
        start: value.toISOString()
      }
    };
  };

  const createArrayProperty = (value: unknown[]): unknown => {
    // Assume it's a multi-select if it's an array of strings
    if (value.every(item => typeof item === 'string')) {
      return {
        multi_select: value.map(name => ({ name }))
      };
    }
    return createDefaultProperty(value);
  };

  const createDefaultProperty = (value: unknown): unknown => {
    return {
      rich_text: [
        {
          text: {
            content: String(value)
          }
        }
      ]
    };
  };

  // Helper function to determine property type based on value type
  const getPropertyType = (val: unknown): string => {
    if (typeof val === 'string') {
      return 'rich_text';
    }
    if (typeof val === 'number') {
      return 'number';
    }
    if (typeof val === 'boolean') {
      return 'checkbox';
    }
    return 'rich_text'; // Default fallback
  };
  
  // Helper function to build filter conditions
  const buildFilterConditions = (filter: Record<string, unknown>, resource: string): Record<string, unknown>[] => {
    const conditions = [];
    
    for (const [field, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        const propertyName = propertyMapping[resource]?.[field] || field;
        
        conditions.push({
          property: propertyName,
          [getPropertyType(value)]: {
            equals: value
          }
        });
      }
    }
    
    return conditions;
  };
  
  // Helper function to build request body with filters
  const buildRequestBody = (filter: Record<string, unknown> | undefined, resource: string): Record<string, unknown> => {
    const body: Record<string, unknown> = {};
    
    if (filter && Object.keys(filter).length > 0) {
      const conditions = buildFilterConditions(filter, resource);
      
      if (conditions.length > 0) {
        body.filter = {
          and: conditions
        };
      }
    }
    
    return body;
  };
  
  // Helper function to add sort and pagination to the request body
  const addSortAndPagination = (
    body: Record<string, unknown>,
    resource: string,
    sort?: { field: string; order: string },
    pagination?: { page: number; perPage: number }
  ): void => {
    // Add sort
    if (sort) {
      const propertyName = propertyMapping[resource]?.[sort.field] || sort.field;
      
      body.sorts = [
        {
          property: propertyName,
          direction: sort.order === 'asc' ? 'ascending' : 'descending'
        }
      ];
    }
    
    // Add pagination
    if (pagination) {
      body.page_size = pagination.perPage;
      
      // Notion uses cursor-based pagination
      // This is a simplified approach
      if (pagination.page > 1) {
        // In a real implementation, you would need to store and use the next_cursor
        // from previous responses
        body.start_cursor = `page_${pagination.page}`;
      }
    }
  };
  
  // Helper function to fetch and process data
  const fetchAndProcessData = async (
    databaseId: string,
    resource: string,
    body: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>[]; total: number }> => {
    // Query database
    const response = await fetch(buildUrl(`databases/${databaseId}/query`), {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Transform pages to data objects
    const data = result.results.map((page: NotionPage) => transformPageToData(page, resource));
    
    // Get total count
    // Notion doesn't provide a total count, so we estimate it
    const total = result.has_more ? data.length * 2 : data.length;
    
    return { data, total };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const databaseId = getDatabaseId(resource);
        
        // Build request body with filters
        const body = buildRequestBody(filter, resource);
        
        // Add sort and pagination
        addSortAndPagination(body, resource, sort, pagination);
        
        // Fetch and process data
        const { data, total } = await fetchAndProcessData(databaseId, resource, body);
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch page
        const response = await fetch(buildUrl(`pages/${id}`), {
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const page = await response.json();
        
        // Transform page to data object
        const data = transformPageToData(page, resource);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const databaseId = getDatabaseId(resource);
        
        // Transform data to properties
        // Cast variables to Record<string, unknown> to ensure type safety
        const properties = transformDataToProperties(variables as Record<string, unknown>, resource);
        
        // Create page
        const response = await fetch(buildUrl('pages'), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            parent: {
              database_id: databaseId
            },
            properties
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const page = await response.json();
        
        // Transform page to data object
        const data = transformPageToData(page, resource);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Transform data to properties
        const properties = transformDataToProperties(variables, resource);
        
        // Update page
        const response = await fetch(buildUrl(`pages/${id}`), {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            properties
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const page = await response.json();
        
        // Transform page to data object
        const data = transformPageToData(page, resource);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the page before "deleting"
        const { data } = await this.getOne({ resource, id });
        
        // Notion doesn't have a true delete API
        // Instead, we archive the page
        const response = await fetch(buildUrl(`pages/${id}`), {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            archived: true
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

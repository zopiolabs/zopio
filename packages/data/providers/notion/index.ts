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

  // Helper to transform Notion page to data object
  const transformPageToData = (page: any, resource: string): Record<string, any> => {
    const result: Record<string, any> = {
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
        result[propertyName] = extractPropertyValue(property as any);
      }
    }
    
    return result;
  };
  
  // Helper to extract value from Notion property
  const extractPropertyValue = (property: any): any => {
    const type = property.type;
    
    switch (type) {
      case 'title':
        return property.title.map((t: any) => t.plain_text).join('');
      case 'rich_text':
        return property.rich_text.map((t: any) => t.plain_text).join('');
      case 'number':
        return property.number;
      case 'select':
        return property.select?.name;
      case 'multi_select':
        return property.multi_select.map((s: any) => s.name);
      case 'date':
        return property.date?.start;
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'formula':
        return extractPropertyValue({ type: property.formula.type, [property.formula.type]: property.formula[property.formula.type] });
      case 'relation':
        return property.relation.map((r: any) => r.id);
      case 'rollup':
        return property.rollup[property.rollup.type];
      case 'created_time':
        return property.created_time;
      case 'created_by':
        return property.created_by.id;
      case 'last_edited_time':
        return property.last_edited_time;
      case 'last_edited_by':
        return property.last_edited_by.id;
      default:
        return null;
    }
  };
  
  // Helper to transform data object to Notion properties
  const transformDataToProperties = (data: Record<string, any>, resource: string): Record<string, any> => {
    const properties: Record<string, any> = {};
    const mapping = propertyMapping[resource] || {};
    
    // Use mapping if provided
    if (Object.keys(mapping).length > 0) {
      for (const [fieldName, propertyName] of Object.entries(mapping)) {
        if (data[fieldName] !== undefined) {
          properties[propertyName] = createPropertyValue(fieldName, data[fieldName]);
        }
      }
    } else {
      // If no mapping is provided, use field names directly
      for (const [fieldName, value] of Object.entries(data)) {
        if (fieldName !== 'id') {
          properties[fieldName] = createPropertyValue(fieldName, value);
        }
      }
    }
    
    return properties;
  };
  
  // Helper to create Notion property value
  const createPropertyValue = (fieldName: string, value: any): any => {
    // This is a simplified implementation
    // In a real-world scenario, you would need to know the property type
    if (typeof value === 'string') {
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
    }
    
    if (typeof value === 'number') {
      return {
        number: value
      };
    }
    
    if (typeof value === 'boolean') {
      return {
        checkbox: value
      };
    }
    
    if (Array.isArray(value)) {
      return {
        multi_select: value.map(item => ({ name: String(item) }))
      };
    }
    
    // Default to text
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

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const databaseId = getDatabaseId(resource);
        
        // Build request body
        const body: Record<string, any> = {};
        
        // Add filter
        if (filter && Object.keys(filter).length > 0) {
          const conditions = [];
          
          for (const [field, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              const propertyName = propertyMapping[resource]?.[field] || field;
              
              conditions.push({
                property: propertyName,
                [typeof value === 'string' ? 'rich_text' : 
                  typeof value === 'number' ? 'number' : 
                  typeof value === 'boolean' ? 'checkbox' : 'rich_text']: {
                  equals: value
                }
              });
            }
          }
          
          if (conditions.length > 0) {
            body.filter = {
              and: conditions
            };
          }
        }
        
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
        const data = result.results.map((page: any) => transformPageToData(page, resource));
        
        // Get total count
        // Notion doesn't provide a total count, so we estimate it
        const total = result.has_more ? data.length * 2 : data.length;
        
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
        const properties = transformDataToProperties(variables, resource);
        
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

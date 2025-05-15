/**
 * Google Sheets provider implementation
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

export interface GoogleSheetsProviderConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetMapping?: Record<string, string>; // Maps resource names to sheet names/IDs
}

/**
 * Create a Google Sheets provider
 */
export function createGoogleSheetsProvider(config: GoogleSheetsProviderConfig): CrudProvider {
  const { 
    apiKey, 
    spreadsheetId,
    sheetMapping = {}
  } = config;

  // Helper to get sheet name from resource name
  const getSheetName = (resource: string): string => {
    return sheetMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, range?: string): string => {
    const sheetName = getSheetName(resource);
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`;
    return range ? `${baseUrl}!${range}` : `${baseUrl}`;
  };

  // Helper to convert row data to object with headers as keys
  const rowToObject = (headers: string[], row: unknown[]): Record<string, unknown> => {
    const obj: Record<string, unknown> = { id: row[0] };
    
    for (let i = 0; i < headers.length; i++) {
      if (i < row.length && headers[i] !== 'id') {
        obj[headers[i]] = row[i];
      }
    }
    
    return obj;
  };

  // Helper to find row index by ID
  const findRowIndexById = (data: unknown[][], id: string | number): number => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === String(id)) {
        return i;
      }
    }
    return -1;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Fetch all data from the sheet
        const url = new URL(`${buildUrl(resource)}`);
        url.searchParams.append('key', apiKey);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const values = result.values || [];
        
        if (values.length === 0) {
          return { data: [], total: 0 };
        }
        
        // First row contains headers
        const headers = values[0];
        let rows = values.slice(1);
        
        // Apply filtering
        if (filter && Object.keys(filter).length > 0) {
          rows = rows.filter(row => {
            for (const [key, value] of Object.entries(filter)) {
              const columnIndex = headers.indexOf(key);
              if (columnIndex === -1) continue;
              
              if (row[columnIndex] !== String(value)) {
                return false;
              }
            }
            return true;
          });
        }
        
        // Apply sorting
        if (sort) {
          const columnIndex = headers.indexOf(sort.field);
          if (columnIndex !== -1) {
            rows.sort((a: unknown[], b: unknown[]) => {
              const aValue = String(a[columnIndex]);
              const bValue = String(b[columnIndex]);
              
              if (sort.order === 'asc') {
                return aValue > bValue ? 1 : -1;
              }
              return aValue < bValue ? 1 : -1;
            });
          }
        }
        
        // Get total count
        const total = rows.length;
        
        // Apply pagination
        if (pagination) {
          const { page, perPage } = pagination;
          const start = (page - 1) * perPage;
          const end = start + perPage;
          rows = rows.slice(start, end);
        }
        
        // Convert rows to objects
        const data = rows.map(row => rowToObject(headers, row));
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch all data from the sheet
        const url = new URL(`${buildUrl(resource)}`);
        url.searchParams.append('key', apiKey);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const values = result.values || [];
        
        if (values.length === 0) {
          throw new Error(`Sheet is empty`);
        }
        
        // First row contains headers
        const headers = values[0];
        
        // Find the row with the matching ID
        const rowIndex = findRowIndexById(values, id);
        
        if (rowIndex === -1) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        // Convert row to object
        const data = rowToObject(headers, values[rowIndex]);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Fetch headers first
        const headersUrl = new URL(`${buildUrl(resource)}!1:1`);
        headersUrl.searchParams.append('key', apiKey);
        
        const headersResponse = await fetch(headersUrl.toString());
        
        if (!headersResponse.ok) {
          throw new Error(`Failed to fetch headers: ${headersResponse.statusText}`);
        }
        
        const headersResult = await headersResponse.json();
        const headers = headersResult.values?.[0] || [];
        
        if (headers.length === 0) {
          throw new Error(`Sheet has no headers`);
        }
        
        // Generate ID if not provided
        const id = variables.id || Date.now().toString();
        
        // Create row data in the correct order
        const rowData = [id];
        
        for (let i = 1; i < headers.length; i++) {
          const header = headers[i];
          rowData.push(variables[header] !== undefined ? variables[header] : '');
        }
        
        // Append row to sheet
        const appendUrl = new URL(`${buildUrl(resource)}:append`);
        appendUrl.searchParams.append('key', apiKey);
        appendUrl.searchParams.append('valueInputOption', 'USER_ENTERED');
        appendUrl.searchParams.append('insertDataOption', 'INSERT_ROWS');
        
        const appendResponse = await fetch(appendUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [rowData]
          })
        });
        
        if (!appendResponse.ok) {
          throw new Error(`Failed to create record: ${appendResponse.statusText}`);
        }
        
        // Return created data
        const data = { id, ...(variables as Record<string, unknown>) };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Fetch all data from the sheet
        const url = new URL(`${buildUrl(resource)}`);
        url.searchParams.append('key', apiKey);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const values = result.values || [];
        
        if (values.length === 0) {
          throw new Error(`Sheet is empty`);
        }
        
        // First row contains headers
        const headers = values[0];
        
        // Find the row with the matching ID
        const rowIndex = findRowIndexById(values, id);
        
        if (rowIndex === -1) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        // Create updated row data in the correct order
        const rowData = [String(id)];
        
        for (let i = 1; i < headers.length; i++) {
          const header = headers[i];
          const currentValue = values[rowIndex][i];
          rowData.push(variables[header] !== undefined ? variables[header] : currentValue || '');
        }
        
        // Update row in sheet
        const updateRange = `${rowIndex + 1}:${rowIndex + 1}`;
        const updateUrl = new URL(`${buildUrl(resource, updateRange)}`);
        updateUrl.searchParams.append('key', apiKey);
        updateUrl.searchParams.append('valueInputOption', 'USER_ENTERED');
        
        const updateResponse = await fetch(updateUrl.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [rowData]
          })
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update record: ${updateResponse.statusText}`);
        }
        
        // Return updated data
        const data = rowToObject(headers, rowData);
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Fetch all data from the sheet
        const url = new URL(`${buildUrl(resource)}`);
        url.searchParams.append('key', apiKey);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const values = result.values || [];
        
        if (values.length === 0) {
          throw new Error(`Sheet is empty`);
        }
        
        // First row contains headers
        const headers = values[0];
        
        // Find the row with the matching ID
        const rowIndex = findRowIndexById(values, id);
        
        if (rowIndex === -1) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        // Get the data before deleting
        const data = rowToObject(headers, values[rowIndex]);
        
        // Delete row from sheet (Google Sheets API doesn't have a direct delete method)
        // We need to use the batchUpdate method to delete rows
        const batchUpdateUrl = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`);
        batchUpdateUrl.searchParams.append('key', apiKey);
        
        const batchUpdateResponse = await fetch(batchUpdateUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0, // Assumes the first sheet, you might need to get the actual sheet ID
                    dimension: 'ROWS',
                    startIndex: rowIndex,
                    endIndex: rowIndex + 1
                  }
                }
              }
            ]
          })
        });
        
        if (!batchUpdateResponse.ok) {
          throw new Error(`Failed to delete record: ${batchUpdateResponse.statusText}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

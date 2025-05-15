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
  
  // Helper to create row data for update operations
  const createRowData = (
    headers: string[], 
    values: unknown[][], 
    rowIndex: number, 
    id: string | number, 
    variables: Record<string, unknown>
  ): unknown[] => {
    const rowData = [String(id)];
    
    for (let i = 1; i < headers.length; i++) {
      const header = headers[i];
      const currentValue = values[rowIndex][i];
      const varValue = (variables as Record<string, unknown>)[header];
      rowData.push(varValue !== undefined ? String(varValue) : (currentValue ? String(currentValue) : ''));
    }
    
    return rowData;
  };
  
  // Helper to fetch sheet data
  const fetchSheetData = async (resource: string): Promise<{headers: string[], values: unknown[][]}> => {
    // Create a proper URL for the Google Sheets API
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${getSheetName(resource)}`;
    const url = new URL(baseUrl);
    url.searchParams.append('key', apiKey);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
    }
    
    const result = await response.json();
    const values = result.values || [];
    
    if (values.length === 0) {
      throw new Error('Sheet is empty');
    }
    
    // First row contains headers
    const headers = values[0];
    
    return { headers, values };
  };

  // Helper to apply filtering to rows
  const applyFiltering = (rows: unknown[][], headers: string[], filter: Record<string, unknown>): unknown[][] => {
    if (!filter || Object.keys(filter).length === 0) {
      return rows;
    }
    
    return rows.filter((row: unknown[]) => {
      for (const [key, value] of Object.entries(filter)) {
        const columnIndex = headers.indexOf(key);
        if (columnIndex === -1) {
          continue;
        }
        
        if (String(row[columnIndex]) !== String(value)) {
          return false;
        }
      }
      return true;
    });
  };
  
  // Helper to apply sorting to rows
  const applySorting = (rows: unknown[][], headers: string[], sort?: { field: string; order: string }): unknown[][] => {
    if (!sort) {
      return rows;
    }
    
    const columnIndex = headers.indexOf(sort.field);
    if (columnIndex === -1) {
      return rows;
    }
    
    return [...rows].sort((a: unknown[], b: unknown[]) => {
      const aValue = String(a[columnIndex]);
      const bValue = String(b[columnIndex]);
      
      return sort.order === 'asc' ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue);
    });
  };
  
  // Helper to apply pagination to rows
  const applyPagination = (rows: unknown[][], pagination?: { page: number; perPage: number }): unknown[][] => {
    if (!pagination) {
      return rows;
    }
    
    const { page, perPage } = pagination;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return rows.slice(start, end);
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Fetch sheet data
        const { headers, values } = await fetchSheetData(resource);
        
        // Extract rows (skip header row)
        let rows = values.slice(1);
        
        // Apply operations
        rows = applyFiltering(rows, headers, filter as Record<string, unknown>);
        const total = rows.length;
        rows = applySorting(rows, headers, sort);
        rows = applyPagination(rows, pagination);
        
        // Convert rows to objects
        const data = rows.map((row: unknown[]) => rowToObject(headers, row));
        
        return { data, total };
      } catch (error) {
        if (error instanceof Error && error.message === 'Sheet is empty') {
          return { data: [], total: 0 };
        }
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
          throw new Error('Sheet is empty');
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
          throw new Error('Sheet has no headers');
        }
        
        // Generate ID if not provided
        const id = (variables as Record<string, unknown>).id?.toString() || Date.now().toString();
        
        // Create row data in the correct order
        const rowData = [id];
        
        for (let i = 1; i < headers.length; i++) {
          const header = headers[i];
          const varValue = (variables as Record<string, unknown>)[header];
          rowData.push(varValue !== undefined ? String(varValue) : '');
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
          throw new Error('Failed to create record');
        }
        
        // Return created data
        const data = { id, ...(variables as Record<string, unknown>) };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams<Record<string, unknown>>): Promise<UpdateResult<Record<string, unknown>>> {
      try {
        // Fetch sheet data using helper function
        const { headers, values } = await fetchSheetData(resource);
        
        // Find the row with the matching ID
        const rowIndex = findRowIndexById(values, id);
        
        if (rowIndex === -1) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        // Create updated row data using helper function
        const rowData = createRowData(headers, values, rowIndex, id, variables as Record<string, unknown>);
        
        // Update row in sheet
        const rangeUrl = `${buildUrl(resource)}!A${rowIndex + 1}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex + 1}`;
        const updateUrl = new URL(rangeUrl);
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
          throw new Error('Failed to update record');
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
          throw new Error('Sheet is empty');
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
          throw new Error('Failed to delete record');
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}

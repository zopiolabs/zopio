// Update handler for PUT requests to update a record
import type { NextRequest } from 'next/server';
import type { ZodType } from 'zod';
import type {
  AfterHook,
  BaseModel,
  BeforeHook,
  DatabaseModel,
  UpdateHandlerOptions,
} from '../types/index.js';
import { validateInput } from './utils.js';

/**
 * Creates a handler for PUT requests to update existing records
 * @template T - The type of the data model
 * @template R - The type of the returned data (defaults to T)
 * @param options - Configuration options for the update handler
 * @returns A Next.js route handler function
 */

/**
 * Extracts the ID from the URL pathname
 */
function extractIdFromUrl(url: URL): string {
  const pathParts = url.pathname.split('/');
  return pathParts.at(-1) || '';
}

/**
 * Validates and processes the input data
 */
async function processInputData<T>(
  requestData: unknown,
  schema?: ZodType<Partial<T>>,
  beforeHook?: BeforeHook<Partial<T>>,
  req?: NextRequest
): Promise<Partial<T>> {
  // Validate the input data if schema is provided
  let data: Partial<T>;
  if (schema) {
    data = validateInput<Partial<T>>(schema, requestData);
  } else {
    data = requestData as Partial<T>;
  }

  // Apply beforeHook if provided
  if (beforeHook) {
    data = await beforeHook(data, req as NextRequest);
  }

  return data;
}

/**
 * Checks if a record exists and returns it
 */
function checkRecordExists<T extends BaseModel>(
  model: DatabaseModel<T>,
  id: string
): Promise<T | null> {
  return model.findUnique({ where: { id } });
}

/**
 * Updates a record in the database
 */
function updateRecord<T extends BaseModel>(
  model: DatabaseModel<T>,
  id: string,
  data: Partial<T>
): Promise<T> {
  return model.update({
    where: { id },
    data,
  });
}

/**
 * Applies the afterHook to the updated record
 */
async function applyAfterHook<T, R>(
  updated: T,
  afterHook?: AfterHook<T, R>
): Promise<R> {
  if (afterHook) {
    return await afterHook(updated);
  }
  return updated as unknown as R;
}

export function updateHandler<T extends BaseModel, R = T>({
  model,
  schema,
  beforeHook,
  afterHook,
}: UpdateHandlerOptions<T, R>) {
  return async function handler(req: NextRequest) {
    // Extract the ID from the URL
    const url = new URL(req.url);
    const id = extractIdFromUrl(url);

    // Check if ID is provided
    if (!id) {
      return Response.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }

    try {
      // Parse the request body
      const requestData = await req.json();

      // Process input data
      let data: Partial<T>;
      try {
        data = await processInputData(requestData, schema, beforeHook, req);
      } catch (error) {
        return Response.json(
          { error: `Validation error: ${(error as Error).message}` },
          { status: 400 }
        );
      }

      // Check if the record exists
      const existingRecord = await checkRecordExists(model, id);
      if (!existingRecord) {
        return Response.json(
          { error: `Record with ID ${id} not found` },
          { status: 404 }
        );
      }

      // Update the record
      let updated: T;
      try {
        updated = await updateRecord(model, id, data);
      } catch (error) {
        return Response.json(
          { error: `Database error: ${(error as Error).message}` },
          { status: 500 }
        );
      }

      // Apply afterHook if provided
      let result: R;
      try {
        result = await applyAfterHook(updated, afterHook);
      } catch (error) {
        return Response.json(
          { error: `Post-processing error: ${(error as Error).message}` },
          { status: 500 }
        );
      }

      // Return the result
      return Response.json(result);
    } catch (error) {
      // Fallback error handler
      return Response.json(
        { error: `Failed to update record: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  };
}

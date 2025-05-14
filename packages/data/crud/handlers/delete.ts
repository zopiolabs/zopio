// Delete handler for DELETE requests
import type { NextRequest } from 'next/server';
import type {
  AfterHook,
  BaseModelodDatabaseModeleHDeleteHandlerOptions,
} from '../types/index.js';

/**
 * Creates a handler for DELETE requests to delete records
 * @template T - The type of the data model
 * @template R - The type of the returned data (defaults to T)
 * @param options - Configuration options for the delete handler
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
 * Checks if a record exists and returns it
 */
async function checkRecordExists<T extends BaseModel>(
  model: DatabaseModel<T>,
  id: string
): Promise<T | null> {
  return model.findUnique({ where: { id } });
}

/**
 * Applies the afterHook to the deleted record
 */
async function applyAfterHook<T, R>(
  deleted: T,
  afterHook?: AfterHook<T, R>
): Promise<R> {
  if (afterHook) {
    return await afterHook(deleted);
  }
  return deleted as unknown as R;
}

export function deleteHandler<T extends BaseModel, R = T>({
  model,
  softDelete = false,
  afterHook,
}: DeleteHandlerOptions<T, R>) {
  return async function handler(req: NextRequest) {
    try {
      // Extract the ID from the URL
      const url = new URL(req.url);
      const id = extractIdFromUrl(url);

      // Check if ID is provided
      if (!id) {
        return Response.json(
          { error: 'ID is required for deletion' },
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

      // Delete or soft delete the record
      let deleted: T;
      try {
        if (softDelete) {
          // For soft delete, we update the record with a deletedAt timestamp
          // Using a type assertion with unknown as an intermediate step to avoid type errors
          const softDeleteData = {
            deletedAt: new Date(),
          } as unknown as Partial<T>;
          deleted = await model.update({
            where: { id },
            data: softDeleteData,
          });
        } else {
          // For hard delete, we actually delete the record
          deleted = await model.delete({ where: { id } });
        }
      } catch (error) {
        return Response.json(
          { error: `Database error: ${(error as Error).message}` },
          { status: 500 }
        );
      }

      // Apply afterHook if provided
      let result: R;
      try {
        result = await applyAfterHook(deleted, afterHook);
      } catch (error) {
        return Response.json(
          { error: `Post-processing error: ${(error as Error).message}` },
          { status: 500 }
        );
      }

      // Return the result
      return Response.json(result);
    } catch (error) {
      // Log the error and return a generic error message
      return Response.json(
        { error: `Failed to delete record: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  };
}

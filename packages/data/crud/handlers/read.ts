// Read handler for GET requests
import type { NextRequest } from 'next/server';
import type { BaseModeldlReadHandlerOptions } from '../types/index.js';

/**
 * Creates a handler for GET requests to retrieve a single record by ID
 * @template T - The type of the data model
 * @template R - The type of the returned data (defaults to T)
 * @param options - Configuration options for the read handler
 * @returns A Next.js route handler function
 */
export function readHandler<T extends BaseModel, R = T>({
  model,
  include,
  afterHook,
}: ReadHandlerOptions<T, R>) {
  return async function handler(req: NextRequest) {
    try {
      // Extract ID from query parameters
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return Response.json(
          { error: 'Missing ID parameter' },
          { status: 400 }
        );
      }

      // Retrieve the record
      let data: T | null;
      try {
        data = await model.findUnique({ where: { id }, include });
      } catch (e) {
        if (e instanceof Error) {
          return Response.json(
            { error: 'Database error', details: e.message },
            { status: 500 }
          );
        }
        return Response.json({ error: 'Database error' }, { status: 500 });
      }

      // Handle not found
      if (!data) {
        return Response.json({ error: 'Record not found' }, { status: 404 });
      }

      // Apply afterHook if provided
      if (afterHook) {
        try {
          const result = afterHook(data);
          return Response.json(result);
        } catch (e) {
          if (e instanceof Error) {
            return Response.json(
              { error: 'Post-processing error', details: e.message },
              { status: 500 }
            );
          }
          return Response.json(
            { error: 'Post-processing error' },
            { status: 500 }
          );
        }
      }

      // Return the record
      return Response.json(data);
    } catch (error) {
      // Fallback error handler
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return Response.json(
        { error: 'Read operation failed', details: errorMessage },
        { status: 500 }
      );
    }
  };
}

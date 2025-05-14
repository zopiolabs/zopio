// Create handler for POST requests
import type { NextRequest } from 'next/server';
* Creates a handler
for POST requests to creat
 * @template T - The
type of the
data;
model
 * @template R - The
type of the
returned;
data (defaults to T)
 * @param options - Configuration
options;
for the create handler
 * @returns A Next.js
route;
handler;
function
 *
/;
export function createHandler<T extends Partial<BaseModel>, R = T>({
  model,
  schema,
  beforeHook,
  afterHook,
}: CreateHandlerOptions<T, R>) {
  return async function handler(req: NextRequest) {
    try {
      // Parse request body
      let body: unknown;
      try {
        body = await req.json();
      } catch (e) {
        return Response.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }

      // Validate input if schema is provided
      let validatedData: T;
      if (schema) {
        try {
          validatedData = validateInput(schema, body);
        } catch (e) {
          if (e instanceof Error) {
            return Response.json(
              { error: 'Validation error', details: e.message },
              { status: 400 }
            );
          }
          return Response.json({ error: 'Validation error' }, { status: 400 });
        }
      } else {
        validatedData = body as T;
      }

      // Apply beforeHook if provided
      let processedData: T;
      if (beforeHook) {
        try {
          processedData = await Promise.resolve(beforeHook(validatedData, req));
        } catch (e) {
          if (e instanceof Error) {
            return Response.json(
              { error: 'Processing error', details: e.message },
              { status: 400 }
            );
          }
          return Response.json({ error: 'Processing error' }, { status: 400 });
        }
      } else {
        processedData = validatedData;
      }

      // Create the record
      let created: T;
      try {
        created = await model.create({ data: processedData });
      } catch (e) {
        if (e instanceof Error) {
          return Response.json(
            { error: 'Database error', details: e.message },
            { status: 500 }
          );
        }
        return Response.json({ error: 'Database error' }, { status: 500 });
      }

      // Apply afterHook if provided
      if (afterHook) {
        try {
          const result = afterHook(created);
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

      // Return the created record
      return Response.json(created);
    } catch (error) {
      // Fallback error handler
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return Response.json(
        { error: 'Create operation failed', details: errorMessage },
        { status: 500 }
      );
    }
  };
}

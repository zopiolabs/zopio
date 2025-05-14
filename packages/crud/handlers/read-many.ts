// Read many handler for GET requests to retrieve multiple records with pagination
import type { NextRequest } from 'next/server';
import type {
  BaseModel,
  OrderBy,
  PaginatedResult,
  QueryParams,
  ReadManyHandlerOptions,
} from '../types';
import { parseBoolean } from './utils';

/**
 * Parses query parameters from the URL
 */
function parseQueryParams(url: URL): QueryParams {
  const queryParams: QueryParams = {};
  
  // Convert URLSearchParams to a regular object
  for (const [key, value] of url.searchParams.entries()) {
    queryParams[key] = value;
  }
  
  return queryParams;
}

/**
 * Handles pagination parameters
 */
function handlePagination(queryParams: QueryParams, defaultLimit: number, maxLimit: number): {
  page: number;
  limit: number;
  skip: number;
  isValid: boolean;
} {
  const page = Number.parseInt(queryParams.page || '1', 10);
  const limit = Math.min(
    Number.parseInt(queryParams.limit || defaultLimit.toString(), 10),
    maxLimit
  );
  const skip = (page - 1) * limit;
  const isValid = !Number.isNaN(page) && page >= 1 && !Number.isNaN(limit) && limit >= 1;
  
  return { page, limit, skip, isValid };
}

/**
 * Builds the orderBy object based on sort parameters
 */
function buildOrderBy<T>(queryParams: QueryParams): OrderBy<T> {
  const orderBy: OrderBy<T> = {};
  if (queryParams.sortBy) {
    // Type assertion is safe here because we're ensuring the value is either 'asc' or 'desc'
    orderBy[queryParams.sortBy as keyof T] = queryParams.sortOrder === 'desc' ? 'desc' : 'asc';
  }
  return orderBy;
}

/**
 * Creates pagination metadata
 */
function createPaginationMetadata(page: number, limit: number, totalCount: number): {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  
  return { totalPages, hasNextPage, hasPreviousPage };
}

/**
 * Handles the request and returns the appropriate response
 */
async function handleReadManyRequest<T extends BaseModel, R = T[]>(
  req: NextRequest,
  options: ReadManyHandlerOptions<T, R>
): Promise<Response> {
  const {
    model,
    include,
    defaultLimit = 10,
    maxLimit = 100,
    afterHook,
    filterHook,
  } = options;

  // Parse query parameters
  const url = new URL(req.url);
  const queryParams = parseQueryParams(url);

  // Handle deleted records filtering
  const includeDeleted = parseBoolean(queryParams.includeDeleted, false);
  if (!includeDeleted && 'deletedAt' in model) {
    queryParams.deletedAt = 'null';
  }

  // Parse pagination parameters
  const { page, limit, skip, isValid } = handlePagination(queryParams, defaultLimit, maxLimit);
  if (!isValid) {
    return Response.json(
      { error: 'Invalid pagination parameters' },
      { status: 400 }
    );
  }

  // Apply filter hook if provided
  const where = filterHook ? filterHook(queryParams) : {};

  // Build orderBy based on sortBy and sortOrder parameters
  const orderBy = buildOrderBy<T>(queryParams);

  // Retrieve records and count
  const [records, totalCount] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
      include,
    }),
    model.count({ where }),
  ]);

  // Calculate pagination metadata
  const { totalPages, hasNextPage, hasPreviousPage } = createPaginationMetadata(page, limit, totalCount);

  // Create the paginated result
  const paginatedResult: PaginatedResult<T> = {
    data: records,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };

  // Apply afterHook if provided and return the result
  if (afterHook) {
    return Response.json(await afterHook(records));
  }

  // Return the paginated result
  return Response.json(paginatedResult);
}

/**
 * Creates a handler for GET requests to retrieve multiple records with pagination
 * @template T - The type of the data model
 * @template R - The type of the returned data (defaults to T[])
 * @param options - Configuration options for the read many handler
 * @returns A Next.js route handler function
 */
export function readManyHandler<T extends BaseModel, R = T[]>(options: ReadManyHandlerOptions<T, R>) {
  return async function handler(req: NextRequest) {
    try {
      return await handleReadManyRequest(req, options);
    } catch (error) {
      return Response.json(
        { error: `Failed to retrieve records: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  };
}

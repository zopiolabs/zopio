// Utilities for CRUD operations
import type { ZodType, ZodError } from 'zod';
import type { BaseModel, WhereConditions } from '../types';

/**
 * Validates input data against a Zod schema
 * @template T - The type of the validated data
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data
 * @throws Error if validation fails
 */
export function validateInput<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors = formatZodErrors(result.error);
    throw new Error(`Validation failed: ${formattedErrors}`);
  }
  return result.data;
}

/**
 * Formats Zod validation errors into a readable string
 * @param error - The Zod error object
 * @returns A formatted error string
 */
export function formatZodErrors(error: ZodError): string {
  return error.errors
    .map((err: { path: string[], message: string }) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
}

/**
 * Creates a filter function for soft-deleted records
 * @param includeDeleted - Whether to include soft-deleted records
 * @returns A filter function
 */
export function createSoftDeleteFilter<T extends BaseModel>(includeDeleted = false): WhereConditions<T> {
  if (includeDeleted) {
    return {};
  }
  return { deletedAt: null } as unknown as WhereConditions<T>;
}

/**
 * Parses a string to a boolean value
 * @param value - The string value to parse
 * @param defaultValue - The default value if parsing fails
 * @returns The parsed boolean value
 */
export function parseBoolean(value: string | null | undefined, defaultValue = false): boolean {
  if (!value) {
    return defaultValue;
  }
  return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
}

/**
 * Parses a string to a number value
 * @param value - The string value to parse
 * @param defaultValue - The default value if parsing fails
 * @returns The parsed number value
 */
export function parseNumber(value: string | null | undefined, defaultValue = 0): number {
  if (!value) {
    return defaultValue;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Creates a standard response object
 * @param success - Whether the operation was successful
 * @param data - The data to include in the response
 * @param message - An optional message
 * @returns A standardized response object
 */
export function createResponse<T>(
  success: boolean,
  data: T | null = null,
  message = ''
): { success: boolean; data: T | null; message: string } {
  return { success, data, message };
}

/**
 * Schema utilities for data validation and type generation
 */

import { z } from 'zod';

/**
 * Create a schema for a data resource
 */
// Type guard for ZodObject
function isZodObject(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny> {
  return 'shape' in schema && typeof (schema as { shape?: unknown }).shape === 'object';
}

// Define the return type separately to avoid circular references
export interface SchemaUtils<T extends z.ZodType> {
  schema: T;
  parse: (data: unknown) => z.infer<T>;
  safeParse: (data: unknown) => z.SafeParseReturnType<unknown, z.infer<T>>;
  extend: <U extends z.ZodType>(extension: U) => SchemaUtils<z.ZodType>;
  pick: <K extends keyof z.infer<T>>(keys: readonly K[]) => SchemaUtils<z.ZodType>;
  omit: <K extends keyof z.infer<T>>(keys: readonly K[]) => SchemaUtils<z.ZodType>;
  partial: () => SchemaUtils<z.ZodType>;
  required: () => SchemaUtils<z.ZodType>;
}

export function createSchema<T extends z.ZodType>(schema: T): SchemaUtils<T> {
  return {
    schema,
    parse: schema.parse.bind(schema),
    safeParse: schema.safeParse.bind(schema),
    extend: <U extends z.ZodType>(extension: U) => {
      // Check if schema is a ZodObject
      if (isZodObject(schema)) {
        // Check if extension is also a ZodObject
        if (isZodObject(extension)) {
          return createSchema(schema.merge(extension));
        }
        // Extension must be a ZodObject for merge to work
        throw new Error('Extension must be a ZodObject for merge operation');
      }
      // Fallback for non-object schemas
      throw new Error('Schema does not support merge operation');
    },
    pick: <K extends keyof z.infer<T>>(keys: readonly K[]) => {
      const keyMap = {} as Record<string, true>;
      for (const key of keys) {
        keyMap[key as string] = true;
      }
      // Check if schema is a ZodObject
      if (isZodObject(schema)) {
        // Safe to use pick now
        return createSchema(schema.pick(keyMap));
      }
      // Fallback for non-object schemas
      throw new Error('Schema does not support pick operation');
    },
    omit: <K extends keyof z.infer<T>>(keys: readonly K[]) => {
      const keyMap = {} as Record<string, true>;
      for (const key of keys) {
        keyMap[key as string] = true;
      }
      // Check if schema is a ZodObject
      if (isZodObject(schema)) {
        // Safe to use omit now
        return createSchema(schema.omit(keyMap));
      }
      // Fallback for non-object schemas
      throw new Error('Schema does not support omit operation');
    },
    partial: () => {
      // Check if schema is a ZodObject
      if (isZodObject(schema)) {
        // Safe to use partial now
        return createSchema(schema.partial());
      }
      // Fallback for non-object schemas
      throw new Error('Schema does not support partial operation');
    },
    required: () => {
      // Check if schema is a ZodObject
      if (isZodObject(schema)) {
        // Safe to use required now
        return createSchema(schema.required());
      }
      // Fallback for non-object schemas
      throw new Error('Schema does not support required operation');
    },
  };
}

/**
 * Common schema types
 */
export const CommonSchemas = {
  id: z.union([z.string(), z.number()]),
  uuid: z.string().uuid(),
  email: z.string().email(),
  url: z.string().url(),
  date: z.date(),
  timestamp: z.number().int().positive(),
  pagination: z.object({
    page: z.number().int().positive(),
    perPage: z.number().int().positive(),
  }),
  sort: z.object({
    field: z.string(),
    order: z.enum(['asc', 'desc']),
  }),
};

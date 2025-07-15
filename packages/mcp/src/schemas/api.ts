/**
 * SPDX-License-Identifier: MIT
 */

/**
 * API resource schema for MCP
 */
import { z } from 'zod';
import { resourceSchema } from '../protocol.js';

/**
 * Schema for API parameter
 */
const parameterSchema = z.object({
  name: z.string(),
  in: z.enum(['path', 'query', 'header', 'cookie', 'body']),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  schema: z.object({
    type: z.enum(['string', 'number', 'integer', 'boolean', 'array', 'object']),
    format: z.string().optional(),
    items: z.lazy(() => z.object({ type: z.string() }).optional()),
    properties: z
      .record(
        z.string(),
        z.lazy(() => z.object({ type: z.string() }))
      )
      .optional(),
    enum: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
  }),
});

/**
 * Schema for API response
 */
const responseSchema = z.object({
  description: z.string(),
  content: z
    .record(
      z.string(),
      z.object({
        schema: z
          .object({
            type: z
              .enum([
                'string',
                'number',
                'integer',
                'boolean',
                'array',
                'object',
              ])
              .optional(),
            properties: z
              .record(
                z.string(),
                z.lazy(() =>
                  z.object({
                    type: z.string(),
                    description: z.string().optional(),
                    items: z
                      .lazy(() => z.object({ type: z.string() }))
                      .optional(),
                  })
                )
              )
              .optional(),
            items: z
              .lazy(() =>
                z.object({
                  type: z.string(),
                  properties: z
                    .record(z.string(), z.object({ type: z.string() }))
                    .optional(),
                })
              )
              .optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

/**
 * Schema for API resources
 */
export const apiSchema = resourceSchema.extend({
  type: z.literal('api'),
  attributes: z
    .object({
      path: z.string(),
      method: z.enum([
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS',
        'HEAD',
      ]),
      summary: z.string().optional(),
      description: z.string().optional(),
      parameters: z.array(parameterSchema).optional(),
      requestBody: z
        .object({
          description: z.string().optional(),
          required: z.boolean().optional(),
          content: z.record(
            z.string(),
            z.object({
              schema: z.object({
                type: z.string(),
                properties: z
                  .record(
                    z.string(),
                    z.object({
                      type: z.string(),
                      description: z.string().optional(),
                    })
                  )
                  .optional(),
              }),
            })
          ),
        })
        .optional(),
      responses: z.record(z.string(), responseSchema),
      tags: z.array(z.string()).optional(),
      deprecated: z.boolean().optional(),
      security: z.array(z.record(z.string(), z.array(z.string()))).optional(),
    })
    .optional(),
  relationships: z
    .object({
      package: z
        .object({
          data: z.object({
            id: z.string(),
            type: z.literal('package'),
          }),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Type for API resources
 */
export type ApiResource = z.infer<typeof apiSchema>;

/**
 * Creates an API resource
 *
 * @param id API ID
 * @param attributes API attributes
 * @param packageId Optional package ID for relationship
 * @returns API resource
 */
export function createApiResource(
  id: string,
  attributes: NonNullable<ApiResource['attributes']>,
  packageId?: string
): ApiResource {
  return {
    id,
    type: 'api',
    attributes,
    ...(packageId
      ? {
          relationships: {
            package: {
              data: {
                id: packageId,
                type: 'package',
              },
            },
          },
        }
      : {}),
  };
}

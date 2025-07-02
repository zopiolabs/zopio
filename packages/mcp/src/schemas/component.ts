/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
/**
 * Component resource schema for MCP
 */
import { z } from 'zod';
import { resourceSchema } from '../protocol.js';

/**
 * Schema for component prop definition
 */
const propDefinitionSchema = z.object({
  type: z.enum([
    'string',
    'number',
    'boolean',
    'object',
    'array',
    'function',
    'element',
    'node',
  ]),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  defaultValue: z.unknown().optional(),
});

/**
 * Schema for component resources
 */
export const componentSchema = resourceSchema.extend({
  type: z.literal('component'),
  attributes: z
    .object({
      name: z.string(),
      description: z.string().optional(),
      category: z
        .enum([
          'layout',
          'input',
          'display',
          'navigation',
          'feedback',
          'data',
          'overlay',
        ])
        .optional(),
      props: z.record(z.string(), propDefinitionSchema).optional(),
      examples: z
        .array(
          z.object({
            name: z.string(),
            code: z.string(),
            description: z.string().optional(),
          })
        )
        .optional(),
      usage: z.string().optional(),
      accessibility: z.string().optional(),
      notes: z.string().optional(),
      packageName: z
        .string()
        .regex(/^@repo\//, 'Package name must use @repo/* namespace')
        .optional(),
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
 * Type for component resources
 */
export type ComponentResource = z.infer<typeof componentSchema>;

/**
 * Creates a component resource
 *
 * @param id Component ID
 * @param attributes Component attributes
 * @param packageId Optional package ID for relationship
 * @returns Component resource
 */
export function createComponentResource(
  id: string,
  attributes: NonNullable<ComponentResource['attributes']>,
  packageId?: string
): ComponentResource {
  return {
    id,
    type: 'component',
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

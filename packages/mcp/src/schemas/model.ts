/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Data model resource schema for MCP
 */
import { z } from 'zod';
import { resourceSchema } from '../protocol.js';

/**
 * Schema for model field definition
 */
const fieldDefinitionSchema = z.object({
  type: z.enum([
    'string',
    'number',
    'integer',
    'boolean',
    'date',
    'datetime',
    'object',
    'array',
    'relation',
    'enum',
    'json',
    'binary',
  ]),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  unique: z.boolean().optional().default(false),
  defaultValue: z.unknown().optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      enum: z.array(z.union([z.string(), z.number()])).optional(),
    })
    .optional(),
  relationDetails: z
    .object({
      model: z.string(),
      type: z.enum([
        'one-to-one',
        'one-to-many',
        'many-to-one',
        'many-to-many',
      ]),
      foreignKey: z.string().optional(),
      through: z.string().optional(),
    })
    .optional(),
});

/**
 * Schema for data model resources
 */
export const modelSchema = resourceSchema.extend({
  type: z.literal('model'),
  attributes: z
    .object({
      name: z.string(),
      description: z.string().optional(),
      tableName: z.string().optional(),
      fields: z.record(z.string(), fieldDefinitionSchema),
      indexes: z
        .array(
          z.object({
            name: z.string().optional(),
            fields: z.array(z.string()),
            unique: z.boolean().optional(),
          })
        )
        .optional(),
      timestamps: z.boolean().optional(),
      softDelete: z.boolean().optional(),
      examples: z
        .array(
          z.object({
            description: z.string().optional(),
            data: z.record(z.string(), z.unknown()),
          })
        )
        .optional(),
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
      relatedModels: z
        .object({
          data: z.array(
            z.object({
              id: z.string(),
              type: z.literal('model'),
            })
          ),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Type for data model resources
 */
export type ModelResource = z.infer<typeof modelSchema>;

/**
 * Creates a data model resource
 *
 * @param id Model ID
 * @param attributes Model attributes
 * @param packageId Optional package ID for relationship
 * @param relatedModelIds Optional related model IDs
 * @returns Model resource
 */
export function createModelResource(
  id: string,
  attributes: NonNullable<ModelResource['attributes']>,
  packageId?: string,
  relatedModelIds?: string[]
): ModelResource {
  const relationships: NonNullable<ModelResource['relationships']> = {};

  if (packageId) {
    relationships.package = {
      data: {
        id: packageId,
        type: 'package',
      },
    };
  }

  if (relatedModelIds && relatedModelIds.length > 0) {
    relationships.relatedModels = {
      data: relatedModelIds.map((modelId) => ({
        id: modelId,
        type: 'model',
      })),
    };
  }

  return {
    id,
    type: 'model',
    attributes,
    ...(Object.keys(relationships).length > 0 ? { relationships } : {}),
  };
}

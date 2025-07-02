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
 * Package resource schema for MCP
 */
import { z } from 'zod';
import { resourceSchema } from '../protocol.js';

/**
 * Schema for package resources
 */
export const packageSchema = resourceSchema.extend({
  type: z.literal('package'),
  attributes: z
    .object({
      name: z
        .string()
        .regex(/^@repo\//, 'Package name must use @repo/* namespace'),
      version: z.string(),
      description: z.string().optional(),
      private: z.boolean().optional(),
      type: z.enum(['module', 'commonjs']).optional(),
      sideEffects: z.boolean().optional(),
      main: z.string().optional(),
      module: z.string().optional(),
      types: z.string().optional(),
      exports: z.record(z.string(), z.unknown()).optional(),
      dependencies: z.record(z.string(), z.string()).optional(),
      peerDependencies: z.record(z.string(), z.string()).optional(),
      devDependencies: z.record(z.string(), z.string()).optional(),
      scripts: z.record(z.string(), z.string()).optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Type for package resources
 */
export type PackageResource = z.infer<typeof packageSchema>;

/**
 * Creates a package resource
 *
 * @param id Package ID
 * @param attributes Package attributes
 * @returns Package resource
 */
export function createPackageResource(
  id: string,
  attributes: Omit<NonNullable<PackageResource['attributes']>, 'name'> & {
    name: string;
  }
): PackageResource {
  return {
    id,
    type: 'package',
    attributes: {
      ...attributes,
      // Ensure package name follows convention
      name: attributes.name.startsWith('@repo/')
        ? attributes.name
        : `@repo/${attributes.name}`,
    },
  };
}

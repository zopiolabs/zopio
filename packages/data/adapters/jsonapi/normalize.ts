/**
 * JSON:API Normalizer
 * 
 * Transforms JSON:API responses into a flat, consumable structure.
 * Handles included resources and relationships automatically.
 */

import type { GenericRecord } from '../common/types.js';

/**
 * JSON:API resource object interface
 */
interface JsonApiResource {
  id: string;
  type: string;
  attributes?: GenericRecord;
  relationships?: Record<string, { data: JsonApiRelationship | JsonApiRelationship[] }>;
}

/**
 * JSON:API relationship reference
 */
interface JsonApiRelationship {
  id: string;
  type: string;
}

/**
 * JSON:API response interface
 */
interface JsonApiResponse {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
}

/**
 * Creates a map of included resources by their type and ID
 * 
 * @param included - Array of included resources
 * @returns Map of resources keyed by type:id
 */
const createIncludedMap = (included?: JsonApiResource[]): Map<string, JsonApiResource> => {
  const map = new Map<string, JsonApiResource>();
  
  if (included) {
    for (const resource of included) {
      map.set(`${resource.type}:${resource.id}`, resource);
    }
  }
  
  return map;
};

/**
 * Resolves a single relationship reference
 * 
 * @param relation - The relationship reference
 * @param includedMap - Map of included resources
 * @param resolver - Function to resolve nested relationships
 * @returns Resolved relationship object
 */
const resolveRelationReference = (
  relation: JsonApiRelationship,
  includedMap: Map<string, JsonApiResource>,
  resolver: (entity: JsonApiResource) => GenericRecord
): GenericRecord => {
  const included = includedMap.get(`${relation.type}:${relation.id}`);
  return included ? resolver(included) : { id: relation.id, type: relation.type };
};

/**
 * Process relationships for an entity
 * 
 * @param entity - The entity to process relationships for
 * @param includedMap - Map of included resources
 * @param resolver - Function to resolve nested relationships
 * @returns Object with processed relationships
 */
const processRelationships = (
  entity: JsonApiResource,
  includedMap: Map<string, JsonApiResource>,
  resolver: (entity: JsonApiResource) => GenericRecord
): GenericRecord => {
  const result: GenericRecord = {};
  
  if (!entity.relationships) {
    return result;
  }
  
  for (const key in entity.relationships) {
    if (Object.prototype.hasOwnProperty.call(entity.relationships, key)) {
      const rel = entity.relationships[key].data;
      
      if (Array.isArray(rel)) {
        result[key] = rel.map(r => resolveRelationReference(r, includedMap, resolver));
      } else if (rel) {
        result[key] = resolveRelationReference(rel, includedMap, resolver);
      }
    }
  }
  
  return result;
};

/**
 * Normalizes a JSON:API response into a flat array of entities
 * 
 * @param response - The JSON:API response object
 * @returns An array of normalized entities with resolved relationships
 */
export const normalizeJsonApi = (response: JsonApiResponse): GenericRecord[] => {
  const includedMap = createIncludedMap(response.included);

  const resolveRelationships = (entity: JsonApiResource): GenericRecord => {
    // Create base result with ID and attributes
    const result: GenericRecord = { 
      id: entity.id, 
      ...(entity.attributes || {}) 
    };
    
    // Add resolved relationships
    const relationships = processRelationships(entity, includedMap, resolveRelationships);
    
    return { ...result, ...relationships };
  };

  return Array.isArray(response.data)
    ? response.data.map(resolveRelationships)
    : [resolveRelationships(response.data)];
};

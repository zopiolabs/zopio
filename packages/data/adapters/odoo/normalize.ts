/**
 * Odoo Record Normalizer
 * 
 * Transforms Odoo API responses into a more usable structure.
 */

import type { GenericRecord } from '../common/types.js';
import { isMany2One, parseMany2One } from './relations.js';

/**
 * Normalizes an Odoo record by converting many2one fields to object format
 * 
 * @param record - The raw Odoo record to normalize
 * @returns A normalized record with properly formatted relation fields
 */
export const normalizeOdooRecord = (record: GenericRecord): GenericRecord => {
  const result: GenericRecord = {};
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      if (isMany2One(value)) {
        result[key] = parseMany2One(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

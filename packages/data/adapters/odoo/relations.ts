/**
 * Odoo Relation Utilities
 * 
 * Helper functions for working with Odoo's relation field formats.
 */

/**
 * Checks if a value is an Odoo many2one relation format
 * 
 * @param val - The value to check
 * @returns True if the value is in Odoo many2one format [id, name]
 */
export const isMany2One = (val: any): boolean =>
  Array.isArray(val) && val.length === 2 && typeof val[0] === "number" && typeof val[1] === "string";

/**
 * Parses an Odoo many2one relation into an object format
 * 
 * @param val - The many2one relation array [id, name]
 * @returns An object with id and name properties
 */
export const parseMany2One = (val: [number, string]) => ({
  id: val[0],
  name: val[1],
});

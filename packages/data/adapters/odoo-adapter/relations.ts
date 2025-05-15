export const isMany2One = (val: any): boolean =>
  Array.isArray(val) && val.length === 2 && typeof val[0] === "number" && typeof val[1] === "string";

export const parseMany2One = (val: [number, string]) => ({
  id: val[0],
  name: val[1],
});
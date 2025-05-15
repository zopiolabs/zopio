export const flattenOdooInput = (data: Record<string, any>): Record<string, any> => {
  const flattened: Record<string, any> = {};
  for (const key in data) {
    const value = data[key];
    if (value && typeof value === "object" && "id" in value) {
      flattened[key] = value.id;
    } else {
      flattened[key] = value;
    }
  }
  return flattened;
};
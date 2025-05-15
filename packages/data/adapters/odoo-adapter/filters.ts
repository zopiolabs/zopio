export const buildOdooDomain = (filter: Record<string, any>): any[] => {
  const domain: any[] = [];
  for (const key in filter) {
    const value = filter[key];
    if (typeof value === "object" && "$contains" in value) {
      domain.push([key, "ilike", value["$contains"]]);
    } else {
      domain.push([key, "=", value]);
    }
  }
  return domain;
};
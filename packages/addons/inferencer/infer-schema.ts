export function inferSchemaFromRecord(record: Record<string, any>) {
  return Object.entries(record).map(([key, value]) => {
    const type = typeof value;
    return {
      key,
      type: type === "object" && value instanceof Date ? "date" : type
    };
  });
}

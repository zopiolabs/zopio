export const normalizeOdooRecord = (record: any): any => {
  const result: any = {};
  for (const key in record) {
    const value = record[key];
    if (Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "string") {
      result[key] = { id: value[0], name: value[1] };
    } else {
      result[key] = value;
    }
  }
  return result;
};
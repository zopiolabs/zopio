export const flattenJsonApi = (data: any): any => {
  const result: any = { ...data.attributes, id: data.id };
  if (data.relationships) {
    for (const key in data.relationships) {
      result[key] = data.relationships[key].data;
    }
  }
  return result;
};
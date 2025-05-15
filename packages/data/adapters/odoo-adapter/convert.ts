export const snakeToCamel = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
};

export const camelToSnake = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
};
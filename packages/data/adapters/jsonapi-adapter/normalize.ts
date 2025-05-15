export const normalizeJsonApi = (response: any): any[] => {
  const includedMap = new Map();
  if (response.included) {
    for (const resource of response.included) {
      includedMap.set(`${resource.type}:${resource.id}`, resource);
    }
  }

  const resolveRelationships = (entity: any) => {
    const result: any = { id: entity.id, ...entity.attributes };
    if (entity.relationships) {
      for (const key in entity.relationships) {
        const rel = entity.relationships[key].data;
        if (Array.isArray(rel)) {
          result[key] = rel.map(r => includedMap.get(`${r.type}:${r.id}`)) || [];
        } else if (rel) {
          result[key] = includedMap.get(`${rel.type}:${rel.id}`);
        }
      }
    }
    return result;
  };

  return Array.isArray(response.data)
    ? response.data.map(resolveRelationships)
    : [resolveRelationships(response.data)];
};
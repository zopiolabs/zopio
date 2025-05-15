import { CrudProvider } from "@repo/crud";

export const createLocalClient = (): CrudProvider => {
  let store = new Map<string, any>();
  let id = 0;

  return {
    async getList() {
      const data = Array.from(store.values());
      return { data, total: data.length };
    },
    async getOne({ id }) {
      return { data: store.get(id) };
    },
    async create({ variables }) {
      const currentId = ++id;
      store.set(currentId, { id: currentId, ...variables });
      return { data: store.get(currentId) };
    },
    async update({ id, variables }) {
      const existing = store.get(id);
      if (!existing) throw new Error("Item not found");
      store.set(id, { ...existing, ...variables });
      return { data: store.get(id) };
    },
    async deleteOne({ id }) {
      const data = store.get(id);
      store.delete(id);
      return { data };
    }
  };
};
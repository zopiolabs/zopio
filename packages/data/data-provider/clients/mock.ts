import type { CrudProvider } from '@repo/crud';

export const mockProvider = (): CrudProvider => {
  return {
    async getList() {
      return { data: [], total: 0 };
    },
    async getOne() {
      return { data: {} };
    },
    async create() {
      return { data: {} };
    },
    async update() {
      return { data: {} };
    },
    async deleteOne() {
      return { data: {} };
    },
  };
};

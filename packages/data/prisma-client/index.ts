import { CrudProvider } from "@repo/crud";
import { PrismaClientProviderOptions } from "./types";

export const createPrismaClient = (options: PrismaClientProviderOptions): CrudProvider => {
  const { client } = options;

  if (!client) {
    throw new Error("Prisma client is required");
  }

  return {
    async getList({ resource }) {
      const data = await client[resource].findMany();
      const total = await client[resource].count();
      return { data, total };
    },
    async getOne({ resource, id }) {
      const data = await client[resource].findUnique({ where: { id } });
      return { data };
    },
    async create({ resource, variables }) {
      const data = await client[resource].create({ data: variables });
      return { data };
    },
    async update({ resource, id, variables }) {
      const data = await client[resource].update({ where: { id }, data: variables });
      return { data };
    },
    async deleteOne({ resource, id }) {
      const data = await client[resource].delete({ where: { id } });
      return { data };
    }
  };
};
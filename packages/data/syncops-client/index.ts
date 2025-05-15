import { CrudProvider } from "@repo/crud";
import { SyncOpsClientConfig } from "./types";

export const createSyncOpsClient = (config: SyncOpsClientConfig): CrudProvider => {
  const { baseUrl, headers } = config;

  const buildUrl = (resource: string, id?: string | number) =>
    \`\${baseUrl}/\${resource}\${id ? `/\${id}` : ""}\`;

  return {
    async getList({ resource }) {
      const res = await fetch(buildUrl(resource), { headers });
      const data = await res.json();
      return { data, total: data.length ?? 0 };
    },

    async getOne({ resource, id }) {
      const res = await fetch(buildUrl(resource, id), { headers });
      const data = await res.json();
      return { data };
    },

    async create({ resource, variables }) {
      const res = await fetch(buildUrl(resource), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(variables),
      });
      const data = await res.json();
      return { data };
    },

    async update({ resource, id, variables }) {
      const res = await fetch(buildUrl(resource, id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(variables),
      });
      const data = await res.json();
      return { data };
    },

    async deleteOne({ resource, id }) {
      const res = await fetch(buildUrl(resource, id), {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      return { data };
    }
  };
};
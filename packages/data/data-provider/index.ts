type Params = {
  resource: string;
  id?: number | string;
  variables?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export type DataProvider = {
  getOne: (params: Params) => Promise<unknown>;
  getList: (params: Params) => Promise<unknown[]>;
  create: (params: Params) => Promise<unknown>;
  update: (params: Params) => Promise<unknown>;
  delete: (params: Params) => Promise<unknown>;
};

export const dataProvider: DataProvider = {
  async getOne({ resource, id }) {
    const res = await fetch(`/api/${resource}/${id}`);
    return res.json();
  },
  async getList({ resource, query }) {
    const qs = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : "";
    const res = await fetch(`/api/${resource}${qs}`);
    return res.json();
  },
  async create({ resource, variables }) {
    const res = await fetch(`/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    return res.json();
  },
  async update({ resource, id, variables }) {
    const res = await fetch(`/api/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(variables),
    });
    return res.json();
  },
  async delete({ resource, id }) {
    const res = await fetch(`/api/${resource}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

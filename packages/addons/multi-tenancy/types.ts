export interface Tenant {
  id: string;
  slug: string;
  name?: string;
  [key: string]: any;
}

export interface TenantContext {
  currentTenant: Tenant;
}

export type TenantResolver = (req: Request) => Promise<Tenant | null>;

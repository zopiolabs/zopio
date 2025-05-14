import type { Tenant, TenantContext } from "./types";

let tenantCtx: TenantContext | null = null;

export const setTenantContext = (tenant: Tenant): void => {
  tenantCtx = { currentTenant: tenant };
};

export const getTenantContext = (): TenantContext | null => {
  return tenantCtx;
};

export const clearTenantContext = (): void => {
  tenantCtx = null;
};

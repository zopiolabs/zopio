import type { TenantResolver } from "./types";
import { setTenantContext, clearTenantContext } from "./context";

export const withTenant = (resolveTenant: TenantResolver) => {
  return async (req: Request, next: () => Promise<Response>): Promise<Response> => {
    const tenant = await resolveTenant(req);

    if (tenant) {
      setTenantContext(tenant);
    }

    const res = await next();

    clearTenantContext();
    return res;
  };
};

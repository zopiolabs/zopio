import { createRestClient } from "@repo/rest-client";
import { CrudProvider } from "@repo/crud";

export const restProvider = (config?: Record<string, unknown>): CrudProvider => {
  return createRestClient({
    baseUrl: config?.baseUrl as string ?? "/api",
  });
};
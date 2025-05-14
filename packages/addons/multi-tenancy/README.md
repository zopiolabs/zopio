# @addon/multi-tenancy

Simple tenant resolution addon for Zopio.

## Features

- TenantContext setter/getter/cleaner
- `withTenant` middleware to auto-resolve and set tenant context
- Framework-agnostic, edge-safe, and extendable

## Example

```ts
import { withTenant, getTenantContext } from "@addon/multi-tenancy";

const resolver = async (req) => {
  const subdomain = new URL(req.url).hostname.split(".")[0];
  return { id: subdomain, slug: subdomain };
};

export const handler = withTenant(resolver)(async (req) => {
  const ctx = getTenantContext();
  return new Response(`Tenant: ${ctx?.currentTenant.slug}`);
});
```

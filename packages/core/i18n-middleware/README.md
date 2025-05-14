# @addon/i18n-middleware

Edge-safe i18n detection and middleware for Zopio.

## Features

- Detects locale from URL, Accept-Language header, or fallback
- Middleware-ready function with edge compatibility
- Simple integration for SSR, API routes, or app handlers

## Example

```ts
import { withI18n } from "@addon/i18n-middleware";

export const handler = withI18n(["en", "tr"])(req => {
  return new Response("Locale aware response");
});
```

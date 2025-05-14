# @addon/i18n-loader

Remote JSON translation file loader for Zopio i18n.

## Features

- Load translations by locale and namespace
- JSON-based, CDN/edge-safe compatible
- Simple fetch-based API

## Example

```ts
import { loadTranslations } from "@addon/i18n-loader";

const data = await loadTranslations({
  locale: "en",
  namespace: "dashboard",
  baseUrl: "https://cdn.mydomain.com/locales"
});
```

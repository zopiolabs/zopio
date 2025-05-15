# @repo/zopio-client

Official Zopio API client that implements the @repo/crud interface. It is used to communicate with the internal Zopio backend across apps.

## Features

- Connects to Zopio's REST API
- Accepts dynamic base URL and headers
- Compatible with all @repo/crud consumers

## Usage

```ts
import { createZopioClient } from "@repo/zopio-client";

const client = createZopioClient({
  baseUrl: "https://api.zopio.dev",
  headers: {
    Authorization: "Bearer token"
  }
});
```
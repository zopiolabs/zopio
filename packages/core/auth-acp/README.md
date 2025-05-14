# @repo/auth-acp

Access Control Provider module for the Zopio framework.

## Features

- Centralized access decision engine
- Compatible with edge environments
- Backend-first access logic

## Usage

```ts
import { createAccessControlProvider } from "@repo/auth-acp";

const acp = createAccessControlProvider({
  rules: [
    { resource: "post", action: "edit", roles: ["admin", "editor"] },
    { resource: "user", action: "delete", roles: ["admin"] },
  ],
});

const result = acp.can({
  resource: "post",
  action: "edit",
  role: "editor",
});

console.log(result); // true
```

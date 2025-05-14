# @repo/auth-abac

Attribute-Based Access Control (ABAC) module for the Zopio framework.

## Features

- Access decisions based on user attributes (region, plan, organization)
- Supports dynamic policies
- Pure function and tree-shakable

## Usage

```ts
import { checkAttributes } from "@repo/auth-abac";

const policy = {
  region: ["us", "eu"],
  plan: ["pro", "enterprise"],
};

const user = {
  region: "us",
  plan: "pro",
  age: 34,
};

const result = checkAttributes(user, policy);
console.log(result); // true
```

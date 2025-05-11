# @zopio/devtools

CLI tools for managing local development tasks in Zopio framework.

## Commands

- `create-user` — creates a mock user (email, role)
- `create-tenant` — seeds a tenant by name
- `enable-plugin` — enables a plugin by ID

## Usage

```bash
npx @zopio/devtools create-user --email hi@zopio.dev --role admin
npx @zopio/devtools create-tenant --name acme
npx @zopio/devtools enable-plugin --id @zopio/bi
```

## Notes

This package is intended for local development, prototyping and future dashboard automation.

# @repo/odoo-adapter

A utility and adapter layer for handling Odoo API structures within Zopio Framework. Designed to work alongside `@repo/odoo-client`.

## Modules

- `normalizeOdooRecord` – transforms raw Odoo responses
- `flattenOdooInput` – prepares create/update inputs
- `buildOdooDomain` – builds filter queries
- `snakeToCamel` / `camelToSnake` – key formatting
- `isMany2One`, `parseMany2One` – relation helpers

This module helps integrate Odoo's unique structures into a clean, type-safe workflow.
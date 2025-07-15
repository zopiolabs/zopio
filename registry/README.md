# Zopio Registry

The Zopio Registry is the central repository for all modules that can be listed in the Zopio Hub marketplace. This directory contains the definitions, schemas, and examples for all module types in the Zopio ecosystem.

## Directory Structure

```text
registry/
├── apps/              # Application modules
├── integrations/      # Integration modules for external services
├── plugins/           # Plugin modules for extending functionality
├── tools/             # CLI and utility tools
├── schemas/           # JSON schemas for module validation
├── types/             # TypeScript type definitions
├── ci/                # CI/CD scripts for validation
├── examples/          # Example implementations
└── templates/         # Templates for creating new modules
```

## Module Types

### Apps

Apps are full-featured applications that can be installed in the Zopio platform. They have their own routes, navigation, and UI components.

Example: `apps/sample-app`

### Integrations

Integrations connect Zopio with external services and APIs. They typically provide authentication, data fetching, and webhook handling.

Example: `integrations/sample-integration`

### Plugins

Plugins extend the functionality of Zopio or other apps. They can provide UI components, data processing, or other functionality.

Example: `plugins/sample-plugin`

### Tools

Tools are command-line utilities and scripts that help with development, deployment, or other tasks.

Example: `tools/sample-tool`

## Module Structure

Each module must have a `zopio.module.json` manifest file that describes its metadata, dependencies, and integration points. The manifest should conform to the schema defined in `schemas/module.schema.json` and the specific schema for its module type.

A typical module structure:

```text
module-name/
├── zopio.module.json  # Module manifest
├── index.ts/tsx       # Main entry point
├── package.json       # NPM package definition
└── [other files]      # Implementation files
```

## Creating a New Module

1. Choose the appropriate module type (app, integration, plugin, or tool)
2. Create a new directory in the corresponding folder
3. Create a `zopio.module.json` manifest file using the appropriate schema
4. Implement the module according to the type-specific requirements
5. Validate your module using the CI scripts

## Validation

You can validate your module manifests against the schemas using the validation script:

```bash
node registry/ci/validate-modules.js
```

## Type Definitions

TypeScript type definitions for module manifests are available in the `types/` directory:

- `types/app.ts` - Type definitions for app modules
- `types/integration.ts` - Type definitions for integration modules
- `types/plugin.ts` - Type definitions for plugin modules
- `types/tool.ts` - Type definitions for tool modules

## Examples

The `examples/` directory contains example implementations of various module types and usage patterns.

## Templates

The `templates/` directory contains templates for creating new modules. These can be used with the sample tool to generate new module scaffolding.

## Contributing

When contributing a new module to the registry:

1. Ensure your module follows the appropriate schema
2. Include comprehensive documentation
3. Add proper TypeScript types
4. Test your module thoroughly
5. Run the validation scripts to ensure compliance

## License

All modules in the Zopio Registry are subject to the license specified in their respective manifest files.

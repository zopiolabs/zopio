# Zopio Marketplace

This directory contains optional plugins that can be installed and used with Zopio. These plugins are designed to be modular and follow a peer dependencies pattern by default.

## Overview

The Zopio Marketplace provides a centralized repository for plugins, extensions, and integrations that enhance the core Zopio platform. All marketplace components follow consistent development patterns and coding standards to ensure seamless integration with the main application.

## Module Categories

The marketplace is organized into the following categories:

- `/developer-plugins` - Tools and utilities for developers building on Zopio
- `/business-plugins` - Business-focused extensions and integrations
- `/fintech-plugins` - Financial technology integrations and tools
- `/insurtech-plugins` - Insurance technology solutions
- `/embedded-apps` - Embeddable applications and widgets
- `/integrations` - Third-party service integrations

Each category contains plugins that follow a consistent structure and naming convention.

## Development Guidelines

Each plugin in the marketplace should:

1. Use peer dependencies for core Zopio packages
2. Follow the naming convention `@repo/plugin-{category}-{name}` or `@repo/integration-{name}` for integrations
3. Include proper documentation and examples
4. Be properly typed with TypeScript
5. Include tests for critical functionality
6. Use the Biome formatter and linter
7. Extend the base TypeScript configuration

## Creating a New Plugin

We provide a plugin generator script to simplify the creation of new plugins:

```bash
npm run create-plugin <category> <plugin-name> [description]
```

For example:

```bash
npm run create-plugin developer-plugins my-tool "A tool for developers"
```

This will create a new plugin with the correct structure, including:

- Package.json with proper dependencies
- TypeScript configuration
- Basic component structure
- README.md template
- Test setup

Alternatively, you can manually create a plugin by:

1. Identifying the appropriate category for your plugin
2. Creating a new directory in the category folder with your plugin name
3. Setting up the package.json with proper peer dependencies
4. Implementing your plugin functionality
5. Adding documentation in the README.md
6. Adding tests in the tests directory

## Usage Guidelines

Plugins can be installed directly from the repository or published to a package registry.

```bash
# Install a plugin
pnpm add @repo/plugin-{category}-{name}
```

Then import and use the plugin according to its documentation.

## Development Tools

The marketplace includes several tools to help with development:

### Format Script

Run the format script to automatically format and lint all marketplace plugins:

```bash
npm run format
```

This will use Biome to format and lint all plugins in all categories.

### Create Plugin Script

Use the create-plugin script to scaffold new plugins:

```bash
npm run create-plugin <category> <plugin-name> [description]
```

## Documentation References

The `modules.json` file in the marketplace root directory contains a registry of all available plugins with their descriptions and import examples. This file is automatically updated when creating new plugins with the `create-plugin` script.

## Integration Examples

Each plugin should include examples of how to integrate with Zopio applications. These examples should be included in the plugin's README.md file.

## Contributing Guidelines

When contributing to the marketplace:

1. Ensure your code follows the Zopio coding standards
2. Run the format script before submitting changes
3. Include comprehensive tests for your plugin
4. Update the documentation to reflect any changes
5. Follow the Git commit message conventions used in the main repository

## License Information

**Marketplace plugins use a different license than the core Zopio framework:**

- **Marketplace Plugins**: [MIT License](./LICENSE) - All plugins in this marketplace are open source under MIT
- **Core Zopio Framework**: [Business Source License 1.1 (BSL)](../LICENSE) - The main framework uses BSL

This dual licensing structure allows the community to freely create, modify, and distribute plugins while the core framework maintains business source licensing. Contributors to marketplace plugins must agree to the [Contributor License Agreement](../CLA.md).

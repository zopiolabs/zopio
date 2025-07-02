# Zopio Marketplace

A modern, community-driven marketplace for Zopio plugins and extensions. This application allows users to discover, browse, and install plugins for their Zopio environment.

## Overview

The Zopio Marketplace is designed to be a central hub for the Zopio community to share and discover plugins. It features a clean, modern UI built with Next.js 15 and the Zopio design system.

## Features

- **Plugin Discovery**: Browse plugins by category, search for specific functionality, or explore trending plugins
- **Plugin Details**: View comprehensive information about each plugin including installation instructions, usage examples, and screenshots
- **Community Contributions**: Submit your own plugins to the marketplace via GitHub pull requests
- **Modern UI**: Built with the Zopio design system for a consistent look and feel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:3003

## Project Structure

```
apps/marketplace/
├── app/                  # Next.js app directory
│   ├── categories/       # Category browsing pages
│   ├── plugins/          # Plugin listing and detail pages
│   ├── search/           # Search results page
│   ├── submit-plugin/    # Plugin submission page
│   ├── trending/         # Trending plugins page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Homepage
│   └── providers.tsx     # Context providers
├── components/           # Reusable UI components
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Contributing

New plugins are added to the marketplace through GitHub pull requests. To submit a plugin:

1. Fork the repository
2. Create a new branch for your plugin
3. Add your plugin to the appropriate category
4. Submit a pull request

Please ensure your plugin follows the [contribution guidelines](CONTRIBUTING.md).

## Development

### Adding New Features

To add new features to the marketplace itself:

1. Fork the repository
2. Create a new branch for your feature
3. Implement your feature
4. Submit a pull request

### Code Style

This project uses the Zopio coding standards and linting rules. Please ensure your code passes all linting checks before submitting a pull request.

## License

The Zopio Marketplace application is part of the core Zopio framework and is licensed under the Business Source License 1.1 (BUSL-1.1) - see the [LICENSE](../../LICENSE) file for details.

However, **marketplace plugins** are individually licensed under the MIT License - see the [marketplace LICENSE](../../marketplace/LICENSE) file for plugin licensing details.

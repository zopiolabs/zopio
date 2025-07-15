# Documentation App

This is the documentation application for the Framework project, built with [Mintlify](https://mintlify.com/).

## Overview

This application serves as the central documentation hub for the Framework project, providing comprehensive guides, API references, and examples for developers.

## Features

- **Comprehensive Documentation**: Detailed guides for all Framework packages
- **API Reference**: Complete API documentation for all packages
- **Interactive Examples**: Code snippets and examples
- **Search Functionality**: Built-in search for quick access to documentation
- **Responsive Design**: Mobile-friendly documentation

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn
# or
pnpm install
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will start the Mintlify development server on port 3004. You can access the documentation at [http://localhost:3004](http://localhost:3004).

### Linting

To check for broken links in the documentation:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Documentation Structure

The documentation is organized as follows:

- **Introduction**: Overview of the Framework
- **Quickstart**: Get up and running quickly
- **Essentials**: Core concepts and features
- **API Reference**: Detailed API documentation
- **Development**: Development guides and best practices

## Adding Documentation

To add new documentation:

1. Create a new `.mdx` file in the appropriate directory
2. Add the new page to the navigation in `mint.json`
3. Run the development server to preview your changes

### Example MDX File

```mdx
---
title: 'My New Page'
description: 'Description of my new page'
---

# My New Page

Content goes here...

## Subheading

More content...

```

## Internationalization

The documentation supports multiple languages through our internationalization package:

- English (en)
- Spanish (es)
- German (de)
- Turkish (tr)

For more information on internationalization, see the [Internationalization Documentation](../../packages/internationalization/README.md).

## Contributing

We welcome contributions to improve the documentation. Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Related Resources

- [Framework Repository](https://github.com/organization/framework)
- [Mintlify Documentation](https://mintlify.com/docs)

## License

MIT

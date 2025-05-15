# ESLint Config Custom

A shared ESLint configuration for the Zopio project.

## Overview

This package provides a minimal ESLint configuration that coexists with Biome, which is the primary linting and formatting tool used in the Zopio project.

## Usage

```json
// package.json
{
  "devDependencies": {
    "eslint-config-custom": "workspace:*"
  }
}
```

```js
// .eslintrc.js
module.exports = {
  extends: ["custom"]
};
```

## Integration with Biome

This configuration is designed to defer most linting rules to Biome, which is the primary linting and formatting tool used in the Zopio project. It provides a minimal ESLint configuration for packages that still depend on ESLint.

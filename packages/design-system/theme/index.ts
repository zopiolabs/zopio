/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Design System Theme
 *
 * This file exports the design tokens and utility functions for using them
 * consistently across the application.
 */

import tokensImport from './tokens';

// Re-export tokens for external use
export const tokens = tokensImport;

/**
 * Get a color value from the design system tokens
 * @param path - Path to the color value (e.g., 'primary', 'primary.500')
 * @returns The color value as a string
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let value: Record<string, unknown> = tokens.colors;

  for (const part of parts) {
    if (value[part] === undefined) {
      return '';
    }
    value = value[part] as Record<string, unknown>;
  }

  if (typeof value !== 'string') {
    return (value as Record<string, string>).DEFAULT || '';
  }

  return value as string;
}

/**
 * Get a typography value from the design system tokens
 * @param category - Typography category (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)
 * @param key - Key within the category
 * @returns The typography value as a string
 */
export function getTypography(
  category: keyof typeof tokens.typography,
  key: string
): string {
  type TypographyKey = keyof (typeof tokens.typography)[typeof category];
  const value = tokens.typography[category]?.[key as TypographyKey];

  if (value === undefined) {
    return '';
  }

  return value;
}

/**
 * Get a spacing value from the design system tokens
 * @param key - Spacing key
 * @returns The spacing value as a string
 */
export function getSpacing(key: keyof typeof tokens.spacing): string {
  const value = tokens.spacing[key];

  if (value === undefined) {
    return '';
  }

  return value;
}

/**
 * Get a border radius value from the design system tokens
 * @param key - Border radius key
 * @returns The border radius value as a string
 */
export function getBorderRadius(
  key: keyof typeof tokens.borders.radius = 'DEFAULT'
): string {
  const value = tokens.borders.radius[key];

  if (value === undefined) {
    return tokens.borders.radius.DEFAULT;
  }

  return value;
}

/**
 * Get a shadow value from the design system tokens
 * @param key - Shadow key
 * @returns The shadow value as a string
 */
export function getShadow(key: string): string {
  type ShadowKey = keyof typeof tokens.shadows;
  const value = tokens.shadows[key as ShadowKey];

  if (value === undefined) {
    return tokens.shadows.DEFAULT;
  }

  return value;
}

/**
 * CSS-in-JS helper for consistent styling
 * @param styles - Style object with token references
 * @returns Processed style object with resolved token values
 */
export function createStyles(
  styles: Record<string, unknown>
): Record<string, unknown> {
  const processValue = (value: unknown): unknown => {
    if (typeof value !== 'string') {
      if (typeof value === 'object' && value !== null) {
        // Ensure value is a valid Record before processing
        const safeValue = value as Record<string, unknown>;
        return Object.entries(safeValue).reduce<Record<string, unknown>>(
          (acc, [k, v]) => {
            acc[k] = processValue(v);
            return acc;
          },
          Object.create(null) as Record<string, unknown>
        );
      }
      return value;
    }

    // Process token references in string values
    return value.replace(/\$tokens\.([\w.]+)/g, (_, path) => {
      const [category, ...rest] = path.split('.');
      const key = rest.join('.');

      switch (category) {
        case 'colors':
          return getColor(key);
        case 'typography': {
          if (rest.length < 2) {
            return '';
          }
          return getTypography(
            rest[0] as keyof typeof tokens.typography,
            rest[1]
          );
        }
        case 'spacing':
          return getSpacing(key as keyof typeof tokens.spacing);
        case 'borders': {
          if (rest[0] === 'radius') {
            return getBorderRadius(
              rest[1] as keyof typeof tokens.borders.radius
            );
          }
          return '';
        }
        case 'shadows':
          return getShadow(key);
        default:
          return '';
      }
    });
  };

  return processValue(styles) as Record<string, unknown>;
}

// Export utility functions
export default {
  tokens,
  getColor,
  getTypography,
  getSpacing,
  getBorderRadius,
  getShadow,
  createStyles,
};

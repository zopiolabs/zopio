/**
 * SPDX-License-Identifier: MIT
 */

import { allColors } from '@repo/design-system/lib/colors';
import { cn } from '@repo/design-system/lib/utils';
import type { HTMLAttributes } from 'react';

interface ColorPaletteProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  showHex?: boolean;
  showName?: boolean;
  type?: 'base' | 'accent' | 'semantic' | 'all';
}

interface ColorSwatchProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
  name: string;
  showHex?: boolean;
  showName?: boolean;
  className?: string;
}

export function ColorSwatch({
  color,
  name,
  showHex = true,
  showName = true,
  className,
  ...props
}: ColorSwatchProps) {
  // For semantic colors using HSL variables, we need special handling
  const isHslVar = color.includes('var(--');
  const isLight = isHslVar ? false : isLightColor(color);

  // Create a swatch with visible text regardless of the background color
  return (
    <div
      className={cn(
        'relative flex items-center justify-between rounded-md',
        // Adjust padding and height based on display mode
        !showName && !showHex ? 'h-12 px-2' : 'h-14 px-4',
        isHslVar ? 'border border-gray-200 dark:border-gray-700' : '',
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {/* Add a semi-transparent overlay for semantic colors to ensure text visibility */}
      {isHslVar && (
        <div className="absolute inset-0 rounded-md bg-white/50 dark:bg-black/50" />
      )}

      {/* If neither name nor hex is shown, add an empty span to maintain structure */}
      {!showName && !showHex && <span className="sr-only">{name}</span>}

      {showName && (
        <span
          className={cn(
            'relative z-10 font-medium text-sm',
            isHslVar
              ? 'text-black dark:text-white'
              : isLight
                ? 'text-black'
                : 'text-white'
          )}
        >
          {name}
        </span>
      )}
      {showHex && (
        <span
          className={cn(
            'relative z-10 font-mono text-sm',
            isHslVar
              ? 'text-black/70 dark:text-white/70'
              : isLight
                ? 'text-black/70'
                : 'text-white/70'
          )}
        >
          {color}
        </span>
      )}
    </div>
  );
}

export function ColorGroup({
  name,
  colors,
  showHex = true,
  showName = true,
  className,
  ...props
}: {
  name: string;
  colors: { name: string; value: string }[];
  showHex?: boolean;
  showName?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <h3 className="font-semibold text-lg">{name}</h3>
      <div className="grid gap-2">
        {colors.map((color) => (
          <ColorSwatch
            key={color.name}
            color={color.value}
            name={color.name}
            showHex={showHex}
            showName={showName}
          />
        ))}
      </div>
    </div>
  );
}

export function ColorPalette({
  className,
  showHex = true,
  showName = true,
  type = 'all',
  ...props
}: ColorPaletteProps) {
  const colorGroups =
    type === 'all'
      ? [...allColors.base, ...allColors.accent, ...allColors.semantic]
      : allColors[type];

  return (
    <div
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {colorGroups.map((group) => (
        <ColorGroup
          key={group.name}
          name={group.name}
          colors={group.colors}
          showHex={showHex}
          showName={showName}
        />
      ))}
    </div>
  );
}

// Helper function to determine if a color is light or dark
function isLightColor(hexColor: string): boolean {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');

  // Parse the hex color
  const r = Number.parseInt(hexColor.substr(0, 2), 16);
  const g = Number.parseInt(hexColor.substr(2, 2), 16);
  const b = Number.parseInt(hexColor.substr(4, 2), 16);

  // Calculate the perceived brightness using the formula
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return true if the color is light (brightness > 128)
  return brightness > 128;
}

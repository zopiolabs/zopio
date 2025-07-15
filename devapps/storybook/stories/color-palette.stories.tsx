/**
 * SPDX-License-Identifier: MIT
 */

import { ColorPalette } from '@repo/design-system/ui/color-palette';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * The Color Palette component displays the design system's color tokens in an organized, visual format.
 * It provides a comprehensive view of all available colors, including base colors, accent colors, and semantic colors.
 *
 * ## Features
 * - Displays color swatches with names and hex/HSL values
 * - Groups colors by type (base, accent, semantic)
 * - Automatically adjusts text color for readability based on background color
 * - Responsive grid layout that adapts to different screen sizes
 *
 * ## Accessibility
 * - Ensures sufficient contrast between text and background colors
 * - Provides both visual (color) and text-based (name/value) information
 */
const meta = {
  title: 'UI/ColorPalette',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showHex: {
      control: 'boolean',
      description: 'Show hex/HSL values for each color',
      defaultValue: true,
    },
    showName: {
      control: 'boolean',
      description: 'Show name for each color',
      defaultValue: true,
    },
    type: {
      control: 'select',
      options: ['base', 'accent', 'semantic', 'all'],
      description: 'Type of colors to display',
      defaultValue: 'all',
    },
  },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Displays all color categories (base, accent, and semantic) in a responsive grid layout.
 */
export const AllColors: Story = {
  args: {
    type: 'all',
    showHex: true,
    showName: true,
  },
};

/**
 * Displays only base colors (Slate, Gray, Zinc, Neutral, Stone).
 * These are neutral colors that form the foundation of the design system.
 */
export const BaseColors: Story = {
  args: {
    type: 'base',
    showHex: true,
    showName: true,
  },
};

/**
 * Displays only accent colors (Red, Orange, Amber, Yellow, etc.).
 * These are vibrant colors used for emphasis, alerts, and interactive elements.
 */
export const AccentColors: Story = {
  args: {
    type: 'accent',
    showHex: true,
    showName: true,
  },
};

/**
 * Displays only semantic colors (Primary, Secondary, Accent, etc.).
 * These are functional colors with specific meanings in the UI.
 */
export const SemanticColors: Story = {
  args: {
    type: 'semantic',
    showHex: true,
    showName: true,
  },
};

/**
 * Displays colors without their hex/HSL values, showing only the color names.
 */
export const WithoutHexValues: Story = {
  args: {
    type: 'all',
    showHex: false,
    showName: true,
  },
};

/**
 * Displays colors without their names, showing only the hex/HSL values.
 */
export const WithoutNames: Story = {
  args: {
    type: 'all',
    showHex: true,
    showName: false,
  },
};

/**
 * Displays colors with minimal information - no names or hex values.
 * Useful for a pure visual reference of the color palette.
 */
export const MinimalDisplay: Story = {
  args: {
    type: 'all',
    showHex: false,
    showName: false,
  },
};

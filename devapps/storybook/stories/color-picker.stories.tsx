/**
 * SPDX-License-Identifier: MIT
 */

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

/**
 * The Color Picker component provides an interactive interface for selecting colors with support for
 * various color formats (HEX, RGB, HSL) and transparency.
 *
 * ## Features
 * - Interactive color selection area with hue and saturation/lightness controls
 * - Alpha (transparency) slider
 * - Multiple output formats (HEX, RGB, CSS, HSL)
 * - EyeDropper tool for selecting colors from anywhere on screen (in supported browsers)
 * - Fully controlled or uncontrolled usage
 *
 * ## Accessibility
 * - Keyboard navigable controls
 * - ARIA attributes for screen readers
 * - Focus management for interactive elements
 */
const meta = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A complete color picker with all available components.
 * This example demonstrates the full functionality including color selection area,
 * hue slider, alpha slider, format selector, and eyedropper tool.
 */
export const Complete: Story = {
  render: () => {
    const [color, setColor] = useState<[number, number, number, number]>([
      255, 0, 0, 1,
    ]);

    return (
      <div className="w-[300px] space-y-4">
        <ColorPicker
          className="space-y-4"
          onChange={(value) =>
            setColor(value as [number, number, number, number])
          }
          value={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-2">
            <ColorPickerSelection className="aspect-square" />
            <div className="flex flex-col justify-between">
              <div
                className="h-8 w-8 rounded-md border border-border shadow-sm"
                style={{
                  backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
                }}
              />
              <ColorPickerEyeDropper />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">Hue</span>
              <ColorPickerHue />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">Alpha</span>
              <ColorPickerAlpha />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerOutput />
            <ColorPickerFormat className="flex-1" />
          </div>
        </ColorPicker>
      </div>
    );
  },
};

/**
 * A minimal color picker with just the essential components.
 * This example shows a simplified version with only the color selection area and hue slider.
 */
export const Minimal: Story = {
  render: () => (
    <div className="w-[250px] space-y-4">
      <ColorPicker className="space-y-4">
        <ColorPickerSelection className="aspect-square" />
        <ColorPickerHue />
      </ColorPicker>
    </div>
  ),
};

/**
 * A color picker with a custom initial value.
 * This example demonstrates setting a default color value.
 */
export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <ColorPicker className="space-y-4" defaultValue="#3b82f6">
        <ColorPickerSelection className="aspect-square" />
        <ColorPickerHue />
        <ColorPickerFormat />
      </ColorPicker>
    </div>
  ),
};

/**
 * A color picker with transparency control.
 * This example shows how to include the alpha slider for transparency adjustment.
 */
export const WithTransparency: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <ColorPicker className="space-y-4" defaultValue="rgba(59, 130, 246, 0.5)">
        <ColorPickerSelection className="aspect-square" />
        <ColorPickerHue />
        <ColorPickerAlpha />
        <ColorPickerFormat />
      </ColorPicker>
    </div>
  ),
};

/**
 * A color picker with format switching.
 * This example demonstrates the ability to switch between different color formats.
 */
export const WithFormatSwitching: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <ColorPicker className="space-y-4">
        <ColorPickerSelection className="aspect-square" />
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat className="flex-1" />
        </div>
      </ColorPicker>
    </div>
  ),
};

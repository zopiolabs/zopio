/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/ui/card';
import { ColorPicker } from '@repo/design-system/ui/color-picker';
import { Label } from '@repo/design-system/ui/label';

/**
 * Allows users to select a color. Modeled after the color picker in Figma.
 */
const meta: Meta<typeof ColorPicker> = {
  title: 'ui/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the color picker trigger',
    },
    value: {
      control: { type: 'color' },
      description: 'Current color value (controlled)',
    },
    defaultValue: {
      control: { type: 'color' },
      description: 'Default color value (uncontrolled)',
    },
    format: {
      control: { type: 'select' },
      options: ['hex', 'rgb', 'hsl'],
      description: 'Color format for display and output',
    },
    showEyeDropper: {
      control: { type: 'boolean' },
      description: 'Show eyedropper tool for picking colors from screen',
    },
    showAlpha: {
      control: { type: 'boolean' },
      description: 'Show alpha/opacity slider',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the color picker',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default color picker.
 */
export const Default: Story = {
  args: {
    defaultValue: '#3b82f6',
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <ColorPicker size="sm" defaultValue="#ef4444" />
        <p className="mt-2 text-muted-foreground text-xs">Small</p>
      </div>
      <div className="text-center">
        <ColorPicker size="md" defaultValue="#10b981" />
        <p className="mt-2 text-muted-foreground text-xs">Medium</p>
      </div>
      <div className="text-center">
        <ColorPicker size="lg" defaultValue="#8b5cf6" />
        <p className="mt-2 text-muted-foreground text-xs">Large</p>
      </div>
    </div>
  ),
};

/**
 * Different color formats.
 */
export const Formats: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="text-center">
        <ColorPicker defaultValue="#3b82f6" format="hex" />
        <p className="mt-2 text-muted-foreground text-xs">HEX format</p>
      </div>
      <div className="text-center">
        <ColorPicker defaultValue="#10b981" format="rgb" />
        <p className="mt-2 text-muted-foreground text-xs">RGB format</p>
      </div>
      <div className="text-center">
        <ColorPicker defaultValue="#f59e0b" format="hsl" />
        <p className="mt-2 text-muted-foreground text-xs">HSL format</p>
      </div>
    </div>
  ),
};

/**
 * With alpha/opacity support.
 */
export const WithAlpha: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="text-center">
        <ColorPicker defaultValue="#3b82f6" showAlpha={true} format="rgb" />
        <p className="mt-2 text-muted-foreground text-xs">RGB with alpha</p>
      </div>
      <div className="text-center">
        <ColorPicker defaultValue="#10b981" showAlpha={true} format="hsl" />
        <p className="mt-2 text-muted-foreground text-xs">HSL with alpha</p>
      </div>
    </div>
  ),
};

/**
 * Controlled color picker.
 */
export const Controlled: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');

    const presetColors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <ColorPicker value={color} onValueChange={setColor} size="lg" />
          <div>
            <p className="font-medium text-sm">Selected Color</p>
            <p className="font-mono text-muted-foreground text-xs">{color}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium text-sm">Preset Colors</p>
          <div className="grid grid-cols-8 gap-2">
            {presetColors.map((presetColor) => (
              <Button
                key={presetColor}
                className="h-8 w-8 rounded border-2 border-border transition-transform hover:scale-110"
                style={{ backgroundColor: presetColor }}
                onClick={() => setColor(presetColor)}
                title={presetColor}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="text-center">
        <ColorPicker defaultValue="#3b82f6" disabled />
        <p className="mt-2 text-muted-foreground text-xs">Disabled</p>
      </div>
      <div className="text-center">
        <ColorPicker defaultValue="#ef4444" disabled size="lg" />
        <p className="mt-2 text-muted-foreground text-xs">Large disabled</p>
      </div>
    </div>
  ),
};

/**
 * Without eyedropper tool.
 */
export const WithoutEyeDropper: Story = {
  args: {
    defaultValue: '#8b5cf6',
    showEyeDropper: false,
  },
};

/**
 * Form integration example.
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#f59e0b',
    });

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Theme Configuration</CardTitle>
          <CardDescription>
            Choose colors for your application theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary">Primary Color</Label>
            <div className="flex items-center gap-3">
              <ColorPicker
                id="primary"
                value={formData.primaryColor}
                onValueChange={(color) =>
                  setFormData((prev) => ({ ...prev, primaryColor: color }))
                }
              />
              <span className="font-mono text-sm">{formData.primaryColor}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary">Secondary Color</Label>
            <div className="flex items-center gap-3">
              <ColorPicker
                id="secondary"
                value={formData.secondaryColor}
                onValueChange={(color) =>
                  setFormData((prev) => ({ ...prev, secondaryColor: color }))
                }
              />
              <span className="font-mono text-sm">
                {formData.secondaryColor}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent">Accent Color</Label>
            <div className="flex items-center gap-3">
              <ColorPicker
                id="accent"
                value={formData.accentColor}
                onValueChange={(color) =>
                  setFormData((prev) => ({ ...prev, accentColor: color }))
                }
              />
              <span className="font-mono text-sm">{formData.accentColor}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Save Theme</Button>
          </div>
        </CardContent>
      </Card>
    );
  },
};

/**
 * Color palette builder.
 */
export const PaletteBuilder: Story = {
  render: () => {
    const [palette, setPalette] = useState([
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#84cc16',
      '#22c55e',
    ]);

    const addColor = () => {
      setPalette((prev) => [...prev, '#000000']);
    };

    const updateColor = (index: number, color: string) => {
      setPalette((prev) => prev.map((c, i) => (i === index ? color : c)));
    };

    const removeColor = (index: number) => {
      setPalette((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Color Palette Builder</CardTitle>
          <CardDescription>
            Create and customize your color palette
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {palette.map((color, index) => (
              <div key={index} className="text-center">
                <ColorPicker
                  value={color}
                  onValueChange={(newColor) => updateColor(index, newColor)}
                  size="lg"
                />
                <p className="mt-1 font-mono text-muted-foreground text-xs">
                  {color}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColor(index)}
                  className="mt-1 h-6 text-xs"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={addColor} variant="outline" className="flex-1">
              Add Color
            </Button>
            <Button className="flex-1">Export Palette</Button>
          </div>
        </CardContent>
      </Card>
    );
  },
};

/**
 * Design system colors.
 */
export const DesignSystemColors: Story = {
  render: () => {
    const [colors, setColors] = useState({
      background: '#ffffff',
      foreground: '#0f172a',
      primary: '#3b82f6',
      secondary: '#f1f5f9',
      accent: '#f59e0b',
      destructive: '#ef4444',
      muted: '#f8fafc',
      border: '#e2e8f0',
    });

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Design System Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <ColorPicker
                  value={value}
                  onValueChange={(color) =>
                    setColors((prev) => ({ ...prev, [key]: color }))
                  }
                />
                <div className="flex-1">
                  <p className="font-medium text-sm capitalize">{key}</p>
                  <p className="font-mono text-muted-foreground text-xs">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.background }}
        >
          <div className="space-y-3" style={{ color: colors.foreground }}>
            <h4 className="font-semibold">Preview</h4>
            <p className="text-sm">This is how your colors look together.</p>
            <div className="flex gap-2">
              <div
                className="rounded px-3 py-1 text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                Primary
              </div>
              <div
                className="rounded px-3 py-1 text-sm"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.foreground,
                }}
              >
                Secondary
              </div>
              <div
                className="rounded px-3 py-1 text-sm"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                }}
              >
                Accent
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

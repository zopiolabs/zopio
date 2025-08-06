/**
 * SPDX-License-Identifier: MIT
 */

import { NumberCounter } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'UI/NumberCounter',
  component: NumberCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    values: {
      control: 'object',
      description: 'Array of numeric values to cycle through',
    },
    trend: {
      control: { type: 'select', options: [-1, 0, 1] },
      description: 'Direction of animation trend',
    },
    format: {
      control: 'object',
      description:
        'Intl.NumberFormat options for formatting the displayed number',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when value changes',
    },
  },
} satisfies Meta<typeof NumberCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default example showing a number counter with compact notation
 */
export const Default: Story = {
  args: {
    values: [543, 12000, -3200],
    trend: 0,
    format: { notation: 'compact' },
  },
};

/**
 * Currency example showing monetary values with currency formatting
 */
export const Currency: Story = {
  args: {
    values: [1250, 8750, 12500],
    trend: 1,
    format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
  },
};

/**
 * Percentage example showing values formatted as percentages
 */
export const Percentage: Story = {
  args: {
    values: [0.25, 0.5, 0.75, 1],
    trend: 1,
    format: { style: 'percent', maximumFractionDigits: 0 },
  },
};

/**
 * Example with negative values to demonstrate trend indicators
 */
export const MixedValues: Story = {
  args: {
    values: [1500, -750, 3000, -1200],
    trend: 0,
    format: { notation: 'compact' },
  },
};

/**
 * Example showing the component in different themes
 */
export const ThemeVariants: Story = {
  render: (args) => (
    <div className="flex flex-row gap-8">
      <div className="rounded-lg bg-white p-6 shadow">
        <NumberCounter {...args} />
      </div>
      <div className="rounded-lg bg-slate-900 p-6 shadow">
        <NumberCounter {...args} />
      </div>
    </div>
  ),
  args: {
    values: [543, 12000, -3200],
    trend: 0,
    format: { notation: 'compact' },
  },
};

/**
 * Example with custom styling
 */
export const CustomStyling: Story = {
  args: {
    values: [543, 12000, -3200],
    trend: 0,
    format: { notation: 'compact' },
    className:
      'bg-gradient-to-r from-blue-500 p-4 rounded-xl text-white to-purple-500',
  },
};

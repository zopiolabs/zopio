/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { Button } from '@repo/design-system/ui/button';
import { NumberFlow } from '@repo/design-system/ui/number-flow';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof NumberFlow> = {
  title: 'ui/NumberFlow',
  component: NumberFlow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that smoothly animates between number values with customizable formatting and easing options.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'The target number value to animate to',
    },
    duration: {
      control: { type: 'range', min: 100, max: 5000, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    format: {
      control: { type: 'select' },
      options: ['default', 'currency', 'percentage', 'compact'],
      description: 'Number formatting style',
    },
    currency: {
      control: { type: 'text' },
      description: 'Currency code for currency format',
    },
    locale: {
      control: { type: 'text' },
      description: 'Locale for number formatting',
    },
    prefix: {
      control: { type: 'text' },
      description: 'Text to prepend to the number',
    },
    suffix: {
      control: { type: 'text' },
      description: 'Text to append to the number',
    },
    decimalPlaces: {
      control: { type: 'number', min: 0, max: 4 },
      description: 'Number of decimal places to show',
    },
    easing: {
      control: { type: 'select' },
      options: ['linear', 'ease-out', 'ease-in-out'],
      description: 'Animation easing function',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberFlow>;

const InteractiveDemo = () => {
  const [value, setValue] = useState(0);

  const presetValues = [0, 100, 1000, 5000, 10000, 50000, 100000];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <div className="mb-4 font-bold text-4xl">
          <NumberFlow
            value={value}
            duration={1500}
            format="default"
            easing="ease-out"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {presetValues.map((preset) => (
            <Button
              key={preset}
              onClick={() => setValue(preset)}
              className="rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
            >
              {preset.toLocaleString()}
            </Button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 text-center">
          <div className="mb-2 text-gray-600 text-sm">Currency</div>
          <div className="font-bold text-2xl">
            <NumberFlow
              value={value}
              duration={1500}
              format="currency"
              currency="USD"
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <div className="mb-2 text-gray-600 text-sm">Percentage</div>
          <div className="font-bold text-2xl">
            <NumberFlow
              value={Math.min(value / 1000, 100)}
              duration={1500}
              format="percentage"
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <div className="mb-2 text-gray-600 text-sm">Compact</div>
          <div className="font-bold text-2xl">
            <NumberFlow value={value} duration={1500} format="compact" />
          </div>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <div className="mb-2 text-gray-600 text-sm">With Prefix/Suffix</div>
          <div className="font-bold text-2xl">
            <NumberFlow
              value={value}
              duration={1500}
              prefix="🎯 "
              suffix=" points"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: InteractiveDemo,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing different formatting options. Click the buttons to see smooth number transitions.',
      },
    },
  },
};

export const DifferentEasing: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="space-y-6 p-6">
        <div className="mb-6 text-center">
          <Button
            onClick={() => setValue(value === 0 ? 1000 : 0)}
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Toggle Value ({value === 0 ? '0 → 1000' : '1000 → 0'})
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <div className="mb-2 text-gray-600 text-sm">Linear</div>
            <div className="font-bold text-3xl">
              <NumberFlow value={value} duration={2000} easing="linear" />
            </div>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="mb-2 text-gray-600 text-sm">Ease Out</div>
            <div className="font-bold text-3xl">
              <NumberFlow value={value} duration={2000} easing="ease-out" />
            </div>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="mb-2 text-gray-600 text-sm">Ease In Out</div>
            <div className="font-bold text-3xl">
              <NumberFlow value={value} duration={2000} easing="ease-in-out" />
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compare different easing functions. Toggle the value to see how each easing affects the animation.',
      },
    },
  },
};

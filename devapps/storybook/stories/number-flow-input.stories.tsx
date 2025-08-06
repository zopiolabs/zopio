/**
 * SPDX-License-Identifier: MIT
 */

import { NumberFlowInput } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof NumberFlowInput> = {
  title: 'UI/NumberFlowInput',
  component: NumberFlowInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberFlowInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(5);

    return (
      <div className="flex flex-col gap-4">
        <NumberFlowInput
          value={value}
          min={0}
          max={10}
          onValueChange={(newValue) => setValue(newValue)}
          className="text-2xl"
        />
        <p className="mt-4 text-gray-500 text-sm">
          Current value: {value} (Min: 0, Max: 10)
        </p>
      </div>
    );
  },
};

export const WithCustomStep: Story = {
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <div className="flex flex-col gap-4">
        <NumberFlowInput
          value={value}
          min={0}
          max={100}
          step={5}
          onValueChange={(newValue) => setValue(newValue)}
          className="text-2xl"
        />
        <p className="mt-4 text-gray-500 text-sm">
          Current value: {value} (Min: 0, Max: 100, Step: 5)
        </p>
      </div>
    );
  },
};

export const LargeNumbers: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    return (
      <div className="flex flex-col gap-4">
        <NumberFlowInput
          value={value}
          min={0}
          max={10000}
          step={100}
          onValueChange={(newValue) => setValue(newValue)}
          className="text-2xl"
        />
        <p className="mt-4 text-gray-500 text-sm">
          Current value: {value} (Min: 0, Max: 10000, Step: 100)
        </p>
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [value, setValue] = useState(42);

    return (
      <div className="flex flex-col gap-4 rounded-lg bg-gray-950 p-8">
        <NumberFlowInput
          value={value}
          min={0}
          max={100}
          onValueChange={(newValue) => setValue(newValue)}
          className="dark text-2xl"
        />
        <p className="mt-4 text-gray-400 text-sm">
          Current value: {value} (Min: 0, Max: 100)
        </p>
      </div>
    );
  },
};

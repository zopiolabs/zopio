/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';

import { ProgressWithValue } from '@repo/design-system/ui';

/**
 * A progress bar that displays the current value in various positions.
 */
const meta: Meta<typeof ProgressWithValue> = {
  title: 'ui/ProgressWithValue',
  component: ProgressWithValue,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['start', 'start-outside', 'follow', 'end', 'end-outside'],
      description: 'Position of the value label',
      defaultValue: 'end',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value',
    },
    label: {
      description: 'Custom label renderer function',
    },
    valueClassName: {
      control: 'text',
      description: 'Additional className for the value label',
    },
  },
  args: {
    value: 45,
    position: 'end',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the progress with value.
 */
export const Default: Story = {};

/**
 * The progress with value displayed at the start position.
 */
export const StartPosition: Story = {
  args: {
    position: 'start',
  },
};

/**
 * The progress with value displayed outside at the start.
 */
export const StartOutsidePosition: Story = {
  args: {
    position: 'start-outside',
  },
};

/**
 * The progress with value that follows the indicator.
 */
export const FollowPosition: Story = {
  args: {
    position: 'follow',
  },
};

/**
 * The progress with value displayed at the end position.
 */
export const EndPosition: Story = {
  args: {
    position: 'end',
  },
};

/**
 * The progress with value displayed outside at the end.
 */
export const EndOutsidePosition: Story = {
  args: {
    position: 'end-outside',
  },
};

/**
 * The progress with a custom label renderer.
 */
export const CustomLabel: Story = {
  args: {
    label: (value) => `${value} of 100 complete`,
  },
};

/**
 * A demo that shows the progress value changing over time.
 */
export const AnimatedDemo: Story = {
  render: () => <AnimatedProgressDemo />,
};

// Demo component for animated progress
const AnimatedProgressDemo = () => {
  const PERCENTAGE = [0, 10, 15, 30, 45, 50, 65, 80, 90, 100];
  const [value, setValue] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setValue(PERCENTAGE[index % PERCENTAGE.length]);
      index++;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-10">
      <ProgressWithValue value={value} position="follow" />
    </div>
  );
};

/**
 * Different styles applied to the progress with value.
 */
export const CustomStyling: Story = {
  args: {
    className: 'h-8 bg-blue-200',
    valueClassName: 'font-bold text-blue-800',
  },
};

/**
 * When the progress is completed.
 */
export const Completed: Story = {
  args: {
    value: 100,
  },
};

/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';

import { EnhancedProgress } from '@repo/design-system/ui/enhanced-progress';

/**
 * An enhanced progress component that supports linear and radial progress bars with various styles,
 * labels, animations, and status indicators.
 */
const meta: Meta<typeof EnhancedProgress> = {
  title: 'UI/EnhancedProgress',
  component: EnhancedProgress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value for the progress',
      defaultValue: 100,
    },
    labelPosition: {
      control: 'select',
      options: [
        'none',
        'start',
        'start-outside',
        'follow',
        'end',
        'end-outside',
      ],
      description: 'Position of the value label',
      defaultValue: 'none',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'square', 'pill'],
      description: 'Shape of the progress bar',
      defaultValue: 'rounded',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the progress is indeterminate',
      defaultValue: false,
    },
    status: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
      description: 'Status of the progress bar',
      defaultValue: 'default',
    },
    showStatusIcon: {
      control: 'boolean',
      description: 'Whether to show a status icon when completed or error',
      defaultValue: false,
    },
    radial: {
      control: 'boolean',
      description: 'Whether to show a radial progress instead of a linear one',
      defaultValue: false,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the progress bar',
      defaultValue: 'md',
    },
    thickness: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Thickness of the radial progress',
      defaultValue: 'md',
    },
  },
  args: {
    value: 45,
    max: 100,
    labelPosition: 'none',
    shape: 'rounded',
    indeterminate: false,
    status: 'default',
    showStatusIcon: false,
    radial: false,
    size: 'md',
    thickness: 'md',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default linear progress bar.
 */
export const Default: Story = {};

/**
 * Progress bar with a label at the end.
 */
export const WithLabel: Story = {
  args: {
    labelPosition: 'end',
  },
};

/**
 * Progress bar with different shapes.
 */
export const Shapes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Rounded (Default)</h3>
        <EnhancedProgress {...args} shape="rounded" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Square</h3>
        <EnhancedProgress {...args} shape="square" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Pill</h3>
        <EnhancedProgress {...args} shape="pill" value={65} />
      </div>
    </div>
  ),
};

/**
 * Progress bar with different sizes.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Small</h3>
        <EnhancedProgress {...args} size="sm" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Medium (Default)</h3>
        <EnhancedProgress {...args} size="md" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Large</h3>
        <EnhancedProgress {...args} size="lg" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Extra Large</h3>
        <EnhancedProgress {...args} size="xl" value={65} />
      </div>
    </div>
  ),
};

/**
 * Progress bar with different label positions.
 */
export const LabelPositions: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Start</h3>
        <EnhancedProgress {...args} labelPosition="start" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Start Outside</h3>
        <EnhancedProgress {...args} labelPosition="start-outside" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Follow</h3>
        <EnhancedProgress {...args} labelPosition="follow" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">End</h3>
        <EnhancedProgress {...args} labelPosition="end" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">End Outside</h3>
        <EnhancedProgress {...args} labelPosition="end-outside" value={65} />
      </div>
    </div>
  ),
};

/**
 * Progress bar with different statuses.
 */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Default</h3>
        <EnhancedProgress {...args} status="default" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Success</h3>
        <EnhancedProgress {...args} status="success" value={100} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Error</h3>
        <EnhancedProgress {...args} status="error" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Warning</h3>
        <EnhancedProgress {...args} status="warning" value={65} />
      </div>
    </div>
  ),
};

/**
 * Progress bar with status icons.
 */
export const WithStatusIcons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Completed</h3>
        <EnhancedProgress {...args} showStatusIcon value={100} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Error</h3>
        <EnhancedProgress {...args} showStatusIcon status="error" value={65} />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">In Progress</h3>
        <EnhancedProgress {...args} showStatusIcon value={65} />
      </div>
    </div>
  ),
};

/**
 * Indeterminate progress bar.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

/**
 * Progress bar with custom label.
 */
export const CustomLabel: Story = {
  args: {
    labelPosition: 'end-outside',
    label: (value) => `${value} of 100 tasks completed`,
  },
};

/**
 * Animated progress demo.
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
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <h3 className="mb-2 font-medium text-sm">Linear Progress</h3>
        <EnhancedProgress
          value={value}
          labelPosition="end-outside"
          showStatusIcon
        />
      </div>
      <div className="w-full">
        <h3 className="mb-2 font-medium text-sm">Radial Progress</h3>
        <EnhancedProgress value={value} radial labelPosition="end-outside" />
      </div>
    </div>
  );
};

/**
 * Radial progress examples.
 */
export const RadialProgress: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Small</h3>
        <EnhancedProgress
          {...args}
          radial
          size="sm"
          value={65}
          labelPosition="none"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Medium</h3>
        <EnhancedProgress
          {...args}
          radial
          size="md"
          value={65}
          labelPosition="none"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Large</h3>
        <EnhancedProgress
          {...args}
          radial
          size="lg"
          value={65}
          labelPosition="none"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Extra Large</h3>
        <EnhancedProgress
          {...args}
          radial
          size="xl"
          value={65}
          labelPosition="none"
        />
      </div>
    </div>
  ),
};

/**
 * Radial progress with different thicknesses.
 */
export const RadialThickness: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">
          Small Thickness
        </h3>
        <EnhancedProgress
          {...args}
          radial
          thickness="sm"
          value={65}
          labelPosition="none"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">
          Medium Thickness
        </h3>
        <EnhancedProgress
          {...args}
          radial
          thickness="md"
          value={65}
          labelPosition="none"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">
          Large Thickness
        </h3>
        <EnhancedProgress
          {...args}
          radial
          thickness="lg"
          value={65}
          labelPosition="none"
        />
      </div>
    </div>
  ),
};

/**
 * Radial progress with labels.
 */
export const RadialWithLabels: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">
          With Internal Label
        </h3>
        <EnhancedProgress {...args} radial value={65} labelPosition="end" />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">
          With External Label
        </h3>
        <EnhancedProgress
          {...args}
          radial
          value={65}
          labelPosition="end-outside"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Custom Label</h3>
        <EnhancedProgress
          {...args}
          radial
          value={65}
          labelPosition="end"
          label={(value) => `${value}%`}
        />
      </div>
    </div>
  ),
};

/**
 * Radial progress with different statuses.
 */
export const RadialStatuses: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Default</h3>
        <EnhancedProgress
          {...args}
          radial
          status="default"
          value={65}
          labelPosition="end"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Success</h3>
        <EnhancedProgress
          {...args}
          radial
          status="success"
          value={100}
          labelPosition="end"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Error</h3>
        <EnhancedProgress
          {...args}
          radial
          status="error"
          value={65}
          labelPosition="end"
        />
      </div>
      <div>
        <h3 className="mb-2 text-center font-medium text-sm">Warning</h3>
        <EnhancedProgress
          {...args}
          radial
          status="warning"
          value={65}
          labelPosition="end"
        />
      </div>
    </div>
  ),
};

/**
 * Custom styling examples.
 */
export const CustomStyling: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Custom Linear Progress</h3>
        <EnhancedProgress
          {...args}
          value={65}
          className="h-8 bg-blue-200"
          classNames={{
            indicator: 'bg-blue-600',
            label: 'font-bold text-blue-800',
          }}
          labelPosition="end"
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Custom Radial Progress</h3>
        <EnhancedProgress
          {...args}
          radial
          value={65}
          classNames={{
            root: 'bg-amber-100',
            indicator: 'text-amber-600',
            label: 'font-bold text-amber-800',
          }}
          labelPosition="end"
        />
      </div>
    </div>
  ),
};

/**
 * Progress bar with completed state.
 */
export const Completed: Story = {
  args: {
    value: 100,
    labelPosition: 'end-outside',
    showStatusIcon: true,
    status: 'success',
  },
};

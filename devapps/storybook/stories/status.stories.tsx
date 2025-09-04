/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Status } from '@repo/design-system/ui/status';

/**
 * Status components are used to display the uptime of a service.
 */
const meta: Meta<typeof Status> = {
  title: 'ui/Status',
  component: Status,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'operational',
        'degraded',
        'partial',
        'outage',
        'maintenance',
        'unknown',
      ],
      description: 'Status variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the status component',
    },
    label: {
      control: { type: 'text' },
      description: 'Custom label for the status',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Enable ping animation',
    },
    showIndicator: {
      control: { type: 'boolean' },
      description: 'Show status indicator dot',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default operational status.
 */
export const Default: Story = {
  args: {
    variant: 'operational',
  },
};

/**
 * All status variants.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status variant="operational" />
      <Status variant="degraded" />
      <Status variant="partial" />
      <Status variant="outage" />
      <Status variant="maintenance" />
      <Status variant="unknown" />
    </div>
  ),
};

/**
 * Status with custom labels.
 */
export const CustomLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status variant="operational" label="All Systems Go" />
      <Status variant="degraded" label="Slow Response Times" />
      <Status variant="partial" label="API Issues" />
      <Status variant="outage" label="Database Down" />
      <Status variant="maintenance" label="Scheduled Maintenance" />
      <Status variant="unknown" label="Investigating" />
    </div>
  ),
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status variant="operational" size="sm" />
      <Status variant="operational" size="md" />
      <Status variant="operational" size="lg" />
    </div>
  ),
};

/**
 * Animated status indicators.
 */
export const Animated: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status variant="operational" animated />
      <Status variant="degraded" animated />
      <Status variant="outage" animated />
    </div>
  ),
};

/**
 * Without indicators.
 */
export const WithoutIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status variant="operational" showIndicator={false} />
      <Status variant="degraded" showIndicator={false} />
      <Status variant="outage" showIndicator={false} />
    </div>
  ),
};

/**
 * Service status dashboard example.
 */
export const Dashboard: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-lg">Service Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">API Gateway</span>
          <Status variant="operational" size="sm" animated />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Database</span>
          <Status variant="degraded" size="sm" label="Slow queries" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">CDN</span>
          <Status variant="operational" size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Authentication</span>
          <Status variant="maintenance" size="sm" label="Updating" animated />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">File Storage</span>
          <Status variant="partial" size="sm" label="Limited access" />
        </div>
      </div>
    </div>
  ),
};

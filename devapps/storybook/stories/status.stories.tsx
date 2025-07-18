/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from '@repo/design-system/ui/status';

/**
 * Status components are used to display the uptime of a service.
 * Supports different status types with automatic colors and animations.
 */
const meta = {
  title: 'ui/Status',
  component: Status,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'offline', 'maintenance', 'degraded'],
      description: 'The status type to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    status: 'online',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Status>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default status indicator with basic settings.
 */
export const Default: Story = {
  render: (args) => (
    <Status {...args}>
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),
};

/**
 * All status types displayed together.
 */
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status status="online">
        <StatusIndicator />
        <StatusLabel />
      </Status>

      <Status status="offline">
        <StatusIndicator />
        <StatusLabel />
      </Status>

      <Status status="maintenance">
        <StatusIndicator />
        <StatusLabel />
      </Status>

      <Status status="degraded">
        <StatusIndicator />
        <StatusLabel />
      </Status>
    </div>
  ),
};

/**
 * Status with custom labels.
 */
export const CustomLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status status="online">
        <StatusIndicator />
        <StatusLabel>System is operational</StatusLabel>
      </Status>

      <Status status="offline">
        <StatusIndicator />
        <StatusLabel>System is down</StatusLabel>
      </Status>

      <Status status="maintenance">
        <StatusIndicator />
        <StatusLabel>Under scheduled maintenance</StatusLabel>
      </Status>

      <Status status="degraded">
        <StatusIndicator />
        <StatusLabel>Performance issues detected</StatusLabel>
      </Status>
    </div>
  ),
};

/**
 * Status indicators in different contexts.
 */
export const InContext: Story = {
  render: () => (
    <div className="flex w-[500px] flex-col gap-6">
      {/* In a table-like layout */}
      <div className="overflow-hidden rounded-md border">
        <div className="bg-muted/50 px-4 py-2 font-medium text-sm">
          Service Status
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between px-4 py-3">
            <span>API Service</span>
            <Status status="online">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>Database</span>
            <Status status="degraded">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>Authentication</span>
            <Status status="offline">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>Storage</span>
            <Status status="maintenance">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
        </div>
      </div>

      {/* In a card layout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="font-medium">API Endpoint</h3>
          <p className="text-muted-foreground text-sm">Main service endpoint</p>
          <div className="mt-2">
            <Status status="online">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="font-medium">Database Cluster</h3>
          <p className="text-muted-foreground text-sm">Primary database</p>
          <div className="mt-2">
            <Status status="degraded">
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Status with custom styling.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Status
        status="online"
        className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
      >
        <StatusIndicator />
        <StatusLabel className="text-emerald-700 dark:text-emerald-400">
          Fully operational
        </StatusLabel>
      </Status>

      <Status
        status="offline"
        className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
      >
        <StatusIndicator />
        <StatusLabel className="text-red-700 dark:text-red-400">
          Service unavailable
        </StatusLabel>
      </Status>

      <Status
        status="maintenance"
        className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
      >
        <StatusIndicator />
        <StatusLabel className="text-blue-700 dark:text-blue-400">
          Scheduled maintenance
        </StatusLabel>
      </Status>

      <Status
        status="degraded"
        className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
      >
        <StatusIndicator />
        <StatusLabel className="text-amber-700 dark:text-amber-400">
          Performance degraded
        </StatusLabel>
      </Status>
    </div>
  ),
};

/**
 * Status indicators with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Status status="online" className="text-xs">
          <StatusIndicator />
          <StatusLabel>Small</StatusLabel>
        </Status>

        <Status status="online" className="text-sm">
          <StatusIndicator />
          <StatusLabel>Medium</StatusLabel>
        </Status>

        <Status status="online" className="text-base">
          <StatusIndicator />
          <StatusLabel>Large</StatusLabel>
        </Status>
      </div>

      <div className="flex items-center gap-6">
        <Status status="maintenance" className="py-1 text-xs">
          <StatusIndicator />
          <StatusLabel>Small</StatusLabel>
        </Status>

        <Status status="maintenance" className="py-1.5 text-sm">
          <StatusIndicator />
          <StatusLabel>Medium</StatusLabel>
        </Status>

        <Status status="maintenance" className="py-2 text-base">
          <StatusIndicator />
          <StatusLabel>Large</StatusLabel>
        </Status>
      </div>
    </div>
  ),
};

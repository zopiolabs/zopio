/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@repo/design-system/ui/button';
import { Spinner } from '@repo/design-system/ui/spinner';

/**
 * A spinner is a visual indicator that shows progress or activity.
 */
const meta: Meta<typeof Spinner> = {
  title: 'ui/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
      ],
      description: 'Visual variant of the spinner',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessibility label for the spinner',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Show the label text visually',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default spinner.
 */
export const Default: Story = {
  args: {
    size: 'md',
    variant: 'default',
  },
};

/**
 * Different sizes of spinners.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

/**
 * Different variants of spinners.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Spinner variant="default" />
        <Spinner variant="primary" />
        <Spinner variant="secondary" />
      </div>
      <div className="flex items-center gap-4">
        <Spinner variant="destructive" />
        <Spinner variant="success" />
        <Spinner variant="warning" />
      </div>
    </div>
  ),
};

/**
 * Spinners with visible labels.
 */
export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Spinner showLabel label="Loading..." />
      <Spinner showLabel label="Processing data..." variant="primary" />
      <Spinner showLabel label="Saving changes..." variant="success" />
      <Spinner showLabel label="Uploading files..." variant="warning" />
    </div>
  ),
};

/**
 * Loading button example.
 */
export const LoadingButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner size="sm" className="mr-2" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner size="sm" className="mr-2" variant="primary" />
        Processing
      </Button>
    </div>
  ),
};

/**
 * Centered loading state.
 */
export const CenteredLoading: Story = {
  render: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-muted/50">
      <Spinner size="lg" showLabel label="Loading content..." />
    </div>
  ),
};

/**
 * Inline spinner in text.
 */
export const InlineSpinner: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-sm">
        Fetching data <Spinner size="sm" />
      </p>
      <p className="flex items-center gap-2 text-sm">
        <Spinner size="sm" variant="success" />
        Data loaded successfully
      </p>
    </div>
  ),
};

/**
 * Different contexts and use cases.
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Card loading state */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Dashboard</h3>
          <Spinner size="sm" />
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          Loading dashboard data...
        </p>
      </div>

      {/* Form submission */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Form Submission</h3>
        <div className="mt-4 flex items-center gap-2">
          <Spinner size="sm" variant="primary" />
          <span className="text-sm">Submitting form...</span>
        </div>
      </div>

      {/* File upload */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold text-lg">File Upload</h3>
        <div className="mt-4 flex items-center gap-2">
          <Spinner size="sm" variant="warning" />
          <span className="text-sm">Uploading files (2 of 5)...</span>
        </div>
      </div>
    </div>
  ),
};

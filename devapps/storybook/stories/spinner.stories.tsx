/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import { Spinner } from '@repo/design-system/ui/spinner';

/**
 * A spinner is a visual indicator that shows progress or activity.
 * Supports multiple variants and customizable sizes.
 */
const meta = {
  title: 'ui/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'circle',
        'pinwheel',
        'circle-filled',
        'ellipsis',
        'ring',
        'bars',
        'infinite',
      ],
      description: 'The visual style of the spinner',
    },
    size: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
      description: 'Size of the spinner in pixels',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    variant: 'default',
    size: 24,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default spinner with basic settings.
 */
export const Default: Story = {};

/**
 * All spinner variants displayed together.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="default" size={24} />
          <Label>Default</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="circle" size={24} />
          <Label>Circle</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="pinwheel" size={24} />
          <Label>Pinwheel</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="circle-filled" size={24} />
          <Label>Circle Filled</Label>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="ellipsis" size={24} />
          <Label>Ellipsis</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="ring" size={24} />
          <Label>Ring</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="bars" size={24} />
          <Label>Bars</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="infinite" size={24} />
          <Label>Infinite</Label>
        </div>
      </div>
    </div>
  ),
};

/**
 * Spinners with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {[
        'default',
        'circle',
        'pinwheel',
        'circle-filled',
        'ellipsis',
        'ring',
        'bars',
        'infinite',
      ].map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <Label className="font-semibold text-lg capitalize">{variant}</Label>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner
                variant={
                  variant as import(
                    '@repo/design-system/ui/spinner'
                  ).SpinnerProps['variant']
                }
                size={16}
              />
              <Label>Small (16px)</Label>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner
                variant={
                  variant as import(
                    '@repo/design-system/ui/spinner'
                  ).SpinnerProps['variant']
                }
                size={24}
              />
              <Label>Medium (24px)</Label>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner
                variant={
                  variant as import(
                    '@repo/design-system/ui/spinner'
                  ).SpinnerProps['variant']
                }
                size={32}
              />
              <Label>Large (32px)</Label>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner
                variant={
                  variant as import(
                    '@repo/design-system/ui/spinner'
                  ).SpinnerProps['variant']
                }
                size={48}
              />
              <Label>XL (48px)</Label>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Spinners with different colors.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-primary" size={24} />
          <Label>Primary</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-secondary" size={24} />
          <Label>Secondary</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-red-500" size={24} />
          <Label>Red</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-green-500" size={24} />
          <Label>Green</Label>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-blue-500" size={24} />
          <Label>Blue</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-yellow-500" size={24} />
          <Label>Yellow</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-purple-500" size={24} />
          <Label>Purple</Label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner className="text-pink-500" size={24} />
          <Label>Pink</Label>
        </div>
      </div>
    </div>
  ),
};

/**
 * Example usage in a button.
 */
export const InButton: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
          <Spinner size={16} className="text-primary-foreground" />
          Loading...
        </Button>
        <Button className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-secondary-foreground">
          <Spinner
            variant="circle"
            size={16}
            className="text-secondary-foreground"
          />
          Processing...
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground">
          <Spinner variant="ellipsis" size={16} />
          Please wait...
        </Button>
        <Button className="flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-destructive-foreground">
          <Spinner
            variant="bars"
            size={16}
            className="text-destructive-foreground"
          />
          Submitting...
        </Button>
      </div>
    </div>
  ),
};

/**
 * Example usage in a card or container.
 */
export const InContainer: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex h-32 w-64 items-center justify-center rounded-lg border p-8">
        <Spinner variant="default" size={32} />
      </div>

      <div className="flex h-32 w-64 flex-col items-center justify-center gap-2 rounded-lg border p-8">
        <Spinner variant="circle-filled" size={32} className="text-primary" />
        <p className="text-muted-foreground text-sm">Loading data...</p>
      </div>

      <div className="flex h-32 w-64 items-center justify-center rounded-lg border bg-primary/5 p-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner variant="infinite" size={40} className="text-primary" />
          <p className="font-medium text-sm">Fetching results...</p>
        </div>
      </div>
    </div>
  ),
};

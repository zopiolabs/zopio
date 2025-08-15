/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui/button';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { NumberFlow } from '@repo/design-system/ui/number-flow';

/**
 * A smooth, animated number transition component with support for various formats and animations.
 */
const meta: Meta<typeof NumberFlow> = {
  title: 'ui/NumberFlow',
  component: NumberFlow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'accent', 'destructive', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', '2xl', '3xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    continuous: {
      control: 'boolean',
    },
    willChange: {
      control: 'boolean',
    },
  },
  args: {
    value: 123,
    variant: 'default',
    size: 'default',
    weight: 'normal',
    continuous: false,
    willChange: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic number flow with default settings.
 */
export const Default: Story = {
  args: {
    value: 123,
  },
};

/**
 * Currency formatting with USD.
 */
export const Currency: Story = {
  args: {
    value: 1234.56,
    format: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    },
  },
};

/**
 * Compact notation for large numbers.
 */
export const Compact: Story = {
  args: {
    value: 1234567,
    format: {
      notation: 'compact',
      compactDisplay: 'short',
    },
    continuous: true,
    willChange: true,
  },
};

/**
 * Percentage formatting.
 */
export const Percentage: Story = {
  args: {
    value: 0.8567,
    format: {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  },
};

/**
 * Interactive counter with buttons to change value.
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);

    return (
      <div className="flex flex-col items-center gap-4">
        <NumberFlow {...args} value={value} />
        <div className="flex gap-2">
          <Button onClick={() => setValue((v) => v - 10)} variant="outline">
            -10
          </Button>
          <Button onClick={() => setValue((v) => v - 1)} variant="outline">
            -1
          </Button>
          <Button onClick={() => setValue(0)} variant="outline">
            Reset
          </Button>
          <Button onClick={() => setValue((v) => v + 1)} variant="outline">
            +1
          </Button>
          <Button onClick={() => setValue((v) => v + 10)} variant="outline">
            +10
          </Button>
        </div>
      </div>
    );
  },
  args: {
    size: '2xl',
    weight: 'bold',
  },
};

/**
 * Success trend indicator.
 */
export const TrendUp: Story = {
  args: {
    value: 15420,
    trend: 'up',
    prefix: '+',
    size: 'lg',
    weight: 'semibold',
  },
};

/**
 * Decline trend indicator.
 */
export const TrendDown: Story = {
  args: {
    value: 2340,
    trend: 'down',
    prefix: '-',
    size: 'lg',
    weight: 'semibold',
  },
};

/**
 * Large display with custom formatting.
 */
export const LargeDisplay: Story = {
  args: {
    value: 999999,
    size: '3xl',
    weight: 'bold',
    format: {
      notation: 'compact',
      compactDisplay: 'short',
    },
    continuous: true,
  },
};

/**
 * Small muted text.
 */
export const Small: Story = {
  args: {
    value: 42,
    size: 'sm',
    variant: 'muted',
    suffix: ' items',
  },
};

/**
 * Decimal number with continuous animation.
 */
export const Decimal: Story = {
  render: (args) => {
    const [value, setValue] = useState(Math.PI);

    return (
      <div className="flex flex-col items-center gap-4">
        <NumberFlow {...args} value={value} />
        <div className="flex gap-2">
          <Button onClick={() => setValue(Math.PI)} variant="outline">
            π
          </Button>
          <Button onClick={() => setValue(Math.E)} variant="outline">
            e
          </Button>
          <Button onClick={() => setValue(Math.sqrt(2))} variant="outline">
            √2
          </Button>
        </div>
      </div>
    );
  },
  args: {
    format: {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    },
    continuous: true,
    size: 'xl',
    weight: 'medium',
  },
};

/**
 * Social media metrics style.
 */
export const SocialMetrics: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="text-center">
        <NumberFlow value={1247} size="lg" weight="bold" />
        <div className="text-muted-foreground text-sm">Followers</div>
      </div>
      <div className="text-center">
        <NumberFlow value={89} size="lg" weight="bold" />
        <div className="text-muted-foreground text-sm">Following</div>
      </div>
      <div className="text-center">
        <NumberFlow value={342} size="lg" weight="bold" />
        <div className="text-muted-foreground text-sm">Posts</div>
      </div>
    </div>
  ),
};

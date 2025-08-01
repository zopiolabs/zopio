/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  Heart,
  Home,
  Info,
  Mail,
  Settings,
  Star,
  User,
  X,
} from 'lucide-react';

import { Button, Icon } from '@repo/design-system/ui';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: false,
      description: 'The icon component to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'custom'],
      description: 'The size of the icon',
    },
    color: {
      control: 'select',
      options: [
        'current',
        'primary',
        'secondary',
        'muted',
        'accent',
        'destructive',
        'success',
        'warning',
        'info',
      ],
      description: 'The color of the icon',
    },
    variant: {
      control: 'select',
      options: ['default', 'solid', 'outline', 'bold', 'thin'],
      description: 'The variant of the icon',
    },
    animation: {
      control: 'select',
      options: ['none', 'spin', 'pulse', 'bounce'],
      description: 'The animation of the icon',
    },
    label: {
      control: 'text',
      description: 'Accessibility label for the icon',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the icon is decorative only (no semantic meaning)',
    },
  },
  args: {
    as: Home,
    size: 'md',
    color: 'current',
    variant: 'default',
    animation: 'none',
    decorative: false,
    label: 'Home',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-4">
      <Icon {...args} as={Home} size="xs" label="Extra Small" />
      <Icon {...args} as={Home} size="sm" label="Small" />
      <Icon {...args} as={Home} size="md" label="Medium" />
      <Icon {...args} as={Home} size="lg" label="Large" />
      <Icon {...args} as={Home} size="xl" label="Extra Large" />
      <Icon {...args} as={Home} size="2xl" label="2X Large" />
      <Icon {...args} as={Home} size="3xl" label="3X Large" />
      <Icon {...args} as={Home} size="4xl" label="4X Large" />
      <Icon
        {...args}
        as={Home}
        size="custom"
        className="size-20"
        label="Custom Size"
      />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="current" label="Current" />
        <span className="text-xs">current</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="primary" label="Primary" />
        <span className="text-xs">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="secondary" label="Secondary" />
        <span className="text-xs">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="muted" label="Muted" />
        <span className="text-xs">muted</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="accent" label="Accent" />
        <span className="text-xs">accent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="destructive" label="Destructive" />
        <span className="text-xs">destructive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="success" label="Success" />
        <span className="text-xs">success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="warning" label="Warning" />
        <span className="text-xs">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} color="info" label="Info" />
        <span className="text-xs">info</span>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} variant="default" label="Default" />
        <span className="text-xs">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} variant="solid" label="Solid" />
        <span className="text-xs">solid</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} variant="outline" label="Outline" />
        <span className="text-xs">outline</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} variant="bold" label="Bold" />
        <span className="text-xs">bold</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} variant="thin" label="Thin" />
        <span className="text-xs">thin</span>
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Settings} animation="none" label="No Animation" />
        <span className="text-xs">none</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Settings} animation="spin" label="Spin" />
        <span className="text-xs">spin</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={AlertCircle} animation="pulse" label="Pulse" />
        <span className="text-xs">pulse</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={ArrowRight} animation="bounce" label="Bounce" />
        <span className="text-xs">bounce</span>
      </div>
    </div>
  ),
};

export const CommonIcons: Story = {
  render: (args) => (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Home} label="Home" />
        <span className="text-xs">Home</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={User} label="User" />
        <span className="text-xs">User</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Settings} label="Settings" />
        <span className="text-xs">Settings</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Mail} label="Mail" />
        <span className="text-xs">Mail</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Check} label="Check" />
        <span className="text-xs">Check</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={X} label="X" />
        <span className="text-xs">X</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Info} label="Info" />
        <span className="text-xs">Info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={CircleAlert} label="Alert" />
        <span className="text-xs">Alert</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={ChevronRight} label="ChevronRight" />
        <span className="text-xs">ChevronRight</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Heart} label="Heart" />
        <span className="text-xs">Heart</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={Star} label="Star" />
        <span className="text-xs">Star</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} as={FileText} label="FileText" />
        <span className="text-xs">FileText</span>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon {...args} as={Home} size="sm" label="Home" />
        <span>Home</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon {...args} as={Mail} size="sm" label="Contact us" />
        <span>Contact us</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Settings</span>
        <Icon {...args} as={Settings} size="sm" label="Settings" />
      </div>
      <Button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
        <span>Next</span>
        <Icon {...args} as={ArrowRight} size="sm" label="Next" />
      </Button>
    </div>
  ),
};

export const Accessibility: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium text-sm">
          With aria-label (for interactive icons)
        </h3>
        <Button
          aria-label="Close dialog"
          className="rounded-full p-2 hover:bg-accent"
        >
          <Icon {...args} as={X} size="sm" label="Close" />
        </Button>
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">
          Decorative icons (aria-hidden)
        </h3>
        <div className="flex items-center gap-2">
          <Icon {...args} as={Info} size="sm" decorative />
          <span>This is informational text with a decorative icon</span>
        </div>
      </div>
    </div>
  ),
};

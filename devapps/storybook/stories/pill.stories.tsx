/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bell, Heart, Mail, Settings, Star, User } from 'lucide-react';

import { Pill } from '@repo/design-system/ui/pill';

/**
 * A flexible badge component designed for a variety of use cases.
 */
const meta: Meta<typeof Pill> = {
  title: 'ui/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'success',
        'warning',
        'error',
        'info',
      ],
      description: 'Visual variant of the pill',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the pill',
    },
    removable: {
      control: { type: 'boolean' },
      description: 'Show remove button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the pill',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default pill component.
 */
export const Default: Story = {
  args: {
    children: 'Default Pill',
  },
};

/**
 * Different variants of pills.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill variant="default">Default</Pill>
      <Pill variant="primary">Primary</Pill>
      <Pill variant="secondary">Secondary</Pill>
      <Pill variant="destructive">Destructive</Pill>
      <Pill variant="outline">Outline</Pill>
      <Pill variant="ghost">Ghost</Pill>
      <Pill variant="success">Success</Pill>
      <Pill variant="warning">Warning</Pill>
      <Pill variant="error">Error</Pill>
      <Pill variant="info">Info</Pill>
    </div>
  ),
};

/**
 * Different sizes of pills.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Pill size="sm">Small</Pill>
      <Pill size="md">Medium</Pill>
      <Pill size="lg">Large</Pill>
    </div>
  ),
};

/**
 * Pills with avatars.
 */
export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill
        avatar={{
          src: 'https://github.com/shadcn.png',
          alt: 'User',
          fallback: 'CN',
        }}
      >
        John Doe
      </Pill>
      <Pill
        variant="primary"
        avatar={{
          fallback: 'JD',
        }}
      >
        Jane Doe
      </Pill>
      <Pill
        size="sm"
        avatar={{
          src: 'https://github.com/vercel.png',
          fallback: 'V',
        }}
      >
        Vercel
      </Pill>
    </div>
  ),
};

/**
 * Pills with status indicators.
 */
export const WithStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill status={{ type: 'success' }}>Online</Pill>
      <Pill status={{ type: 'error' }}>Offline</Pill>
      <Pill status={{ type: 'warning' }}>Away</Pill>
      <Pill status={{ type: 'info' }}>Busy</Pill>
      <Pill status={{ type: 'success', animated: true }}>Live</Pill>
    </div>
  ),
};

/**
 * Pills with icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill icon={User}>Profile</Pill>
      <Pill icon={Star} variant="warning">
        Favorite
      </Pill>
      <Pill icon={Settings} variant="outline">
        Settings
      </Pill>
      <Pill icon={Mail} variant="info">
        Messages
      </Pill>
      <Pill icon={Bell} variant="success">
        Notifications
      </Pill>
    </div>
  ),
};

/**
 * Pills with delta indicators.
 */
export const WithDelta: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill delta={{ type: 'increase', value: '+12%' }} variant="success">
        Revenue
      </Pill>
      <Pill delta={{ type: 'decrease', value: '-5%' }} variant="error">
        Traffic
      </Pill>
      <Pill delta={{ type: 'neutral', value: '0%' }} variant="outline">
        Conversion
      </Pill>
      <Pill delta={{ type: 'increase', value: '+2.5K' }} variant="info">
        Users
      </Pill>
    </div>
  ),
};

/**
 * Pills with avatar groups.
 */
export const WithAvatarGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Pill
        avatars={[
          { src: 'https://github.com/shadcn.png', fallback: 'CN' },
          { fallback: 'JD' },
          { fallback: 'AB' },
        ]}
      >
        3 members
      </Pill>
      <Pill
        variant="primary"
        avatars={[
          { fallback: 'A' },
          { fallback: 'B' },
          { fallback: 'C' },
          { fallback: 'D' },
          { fallback: 'E' },
        ]}
      >
        5 collaborators
      </Pill>
    </div>
  ),
};

/**
 * Removable pills.
 */
export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill removable onRemove={() => console.log('Pill removed')}>
        Removable
      </Pill>
      <Pill variant="primary" removable>
        Tag 1
      </Pill>
      <Pill variant="secondary" removable>
        Tag 2
      </Pill>
      <Pill variant="outline" removable>
        Filter
      </Pill>
    </div>
  ),
};

/**
 * Interactive pills.
 */
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill
        onClick={() => console.log('Clickable pill clicked')}
        className="cursor-pointer"
      >
        Clickable
      </Pill>
      <Pill
        variant="primary"
        onClick={() => console.log('Clickable pill clicked')}
        avatar={{ fallback: 'JD' }}
      >
        View Profile
      </Pill>
      <Pill
        variant="outline"
        onClick={() => console.log('Clickable pill clicked')}
        icon={Settings}
      >
        Settings
      </Pill>
    </div>
  ),
};

/**
 * Disabled pills.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill disabled>Disabled</Pill>
      <Pill variant="primary" disabled removable>
        Disabled Removable
      </Pill>
      <Pill variant="outline" disabled>
        Disabled Clickable
      </Pill>
    </div>
  ),
};

/**
 * Complex pill examples.
 */
export const Complex: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">User Status</h4>
        <div className="flex flex-wrap gap-2">
          <Pill
            variant="success"
            avatar={{ src: 'https://github.com/shadcn.png', fallback: 'CN' }}
            status={{ type: 'success', animated: true }}
          >
            John Doe - Online
          </Pill>
          <Pill
            variant="warning"
            avatar={{ fallback: 'JD' }}
            status={{ type: 'warning' }}
          >
            Jane Doe - Away
          </Pill>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Metrics</h4>
        <div className="flex flex-wrap gap-2">
          <Pill
            variant="success"
            icon={Heart}
            delta={{ type: 'increase', value: '+15%' }}
          >
            Engagement
          </Pill>
          <Pill
            variant="info"
            icon={User}
            delta={{ type: 'increase', value: '+1.2K' }}
          >
            New Users
          </Pill>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Team Projects</h4>
        <div className="flex flex-wrap gap-2">
          <Pill
            variant="primary"
            avatars={[{ fallback: 'A' }, { fallback: 'B' }, { fallback: 'C' }]}
            removable
          >
            Project Alpha
          </Pill>
          <Pill
            variant="outline"
            avatars={[{ fallback: 'D' }, { fallback: 'E' }]}
            status={{ type: 'warning' }}
          >
            Project Beta
          </Pill>
        </div>
      </div>
    </div>
  ),
};

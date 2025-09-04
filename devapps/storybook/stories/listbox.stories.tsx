/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Bell,
  Download,
  Heart,
  Mail,
  Settings,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';

import {
  Listbox,
  ListboxItem,
  ListboxSection,
} from '@repo/design-system/ui/listbox';

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
const meta: Meta<typeof Listbox> = {
  title: 'ui/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'faded', 'bordered', 'light'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    disallowEmptySelection: {
      control: 'boolean',
    },
    isVirtualized: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'faded',
    size: 'md',
    selectionMode: 'none',
    disallowEmptySelection: true,
    isVirtualized: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Listbox {...args}>
      <ListboxItem key="new">New file</ListboxItem>
      <ListboxItem key="copy">Copy link</ListboxItem>
      <ListboxItem key="edit">Edit file</ListboxItem>
      <ListboxItem key="delete">Delete file</ListboxItem>
    </Listbox>
  ),
};

export const WithDisabledKeys: Story = {
  render: (args) => (
    <Listbox {...args} disabledKeys={['edit', 'delete']}>
      <ListboxItem key="new">New file</ListboxItem>
      <ListboxItem key="copy">Copy link</ListboxItem>
      <ListboxItem key="edit">Edit file</ListboxItem>
      <ListboxItem key="delete">Delete file</ListboxItem>
    </Listbox>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Listbox variant="flat">
        <ListboxItem key="flat1">Flat variant</ListboxItem>
        <ListboxItem key="flat2">Item 2</ListboxItem>
        <ListboxItem key="flat3">Item 3</ListboxItem>
      </Listbox>
      <Listbox variant="faded">
        <ListboxItem key="faded1">Faded variant</ListboxItem>
        <ListboxItem key="faded2">Item 2</ListboxItem>
        <ListboxItem key="faded3">Item 3</ListboxItem>
      </Listbox>
      <Listbox variant="bordered">
        <ListboxItem key="bordered1">Bordered variant</ListboxItem>
        <ListboxItem key="bordered2">Item 2</ListboxItem>
        <ListboxItem key="bordered3">Item 3</ListboxItem>
      </Listbox>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const SingleSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(['cat'])
    );

    return (
      <div className="space-y-4">
        <Listbox
          {...args}
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <ListboxItem key="cat">Cat</ListboxItem>
          <ListboxItem key="dog">Dog</ListboxItem>
          <ListboxItem key="elephant">Elephant</ListboxItem>
          <ListboxItem key="lion">Lion</ListboxItem>
          <ListboxItem key="tiger">Tiger</ListboxItem>
        </Listbox>
        <p className="text-muted-foreground text-sm">
          Selected: {Array.from(selectedKeys).join(', ') || 'None'}
        </p>
      </div>
    );
  },
};

export const MultipleSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(['cat', 'dog'])
    );

    return (
      <div className="space-y-4">
        <Listbox
          {...args}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <ListboxItem key="cat">Cat</ListboxItem>
          <ListboxItem key="dog">Dog</ListboxItem>
          <ListboxItem key="elephant">Elephant</ListboxItem>
          <ListboxItem key="lion">Lion</ListboxItem>
          <ListboxItem key="tiger">Tiger</ListboxItem>
        </Listbox>
        <p className="text-muted-foreground text-sm">
          Selected: {Array.from(selectedKeys).join(', ') || 'None'}
        </p>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Listbox {...args}>
      <ListboxItem key="profile" startContent={<User className="h-4 w-4" />}>
        Profile
      </ListboxItem>
      <ListboxItem
        key="settings"
        startContent={<Settings className="h-4 w-4" />}
      >
        Settings
      </ListboxItem>
      <ListboxItem
        key="mail"
        startContent={<Mail className="h-4 w-4" />}
        endContent={
          <span className="rounded bg-primary px-1 text-primary-foreground text-xs">
            3
          </span>
        }
      >
        Messages
      </ListboxItem>
      <ListboxItem
        key="notifications"
        startContent={<Bell className="h-4 w-4" />}
        endContent={
          <span className="rounded bg-destructive px-1 text-destructive-foreground text-xs">
            5
          </span>
        }
      >
        Notifications
      </ListboxItem>
    </Listbox>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Listbox {...args} className="max-w-sm">
      <ListboxItem
        key="profile"
        startContent={<User className="h-4 w-4" />}
        description="View and edit your profile information"
      >
        Profile Settings
      </ListboxItem>
      <ListboxItem
        key="billing"
        startContent={<Settings className="h-4 w-4" />}
        description="Manage your subscription and billing"
      >
        Billing & Plans
      </ListboxItem>
      <ListboxItem
        key="notifications"
        startContent={<Bell className="h-4 w-4" />}
        description="Configure email and push notifications"
      >
        Notifications
      </ListboxItem>
      <ListboxItem
        key="security"
        startContent={<Settings className="h-4 w-4" />}
        description="Password, 2FA, and security settings"
      >
        Security
      </ListboxItem>
    </Listbox>
  ),
};

export const WithTopBottomContent: Story = {
  render: (args) => (
    <Listbox
      {...args}
      topContent={
        <div className="font-medium text-sm">Choose your favorite</div>
      }
      bottomContent={
        <div className="text-muted-foreground text-xs">
          You can select multiple items
        </div>
      }
      selectionMode="multiple"
    >
      <ListboxItem key="react" startContent={<Heart className="h-4 w-4" />}>
        React
      </ListboxItem>
      <ListboxItem key="vue" startContent={<Heart className="h-4 w-4" />}>
        Vue
      </ListboxItem>
      <ListboxItem key="angular" startContent={<Heart className="h-4 w-4" />}>
        Angular
      </ListboxItem>
      <ListboxItem key="svelte" startContent={<Heart className="h-4 w-4" />}>
        Svelte
      </ListboxItem>
    </Listbox>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Listbox {...args} className="max-w-xs">
      <ListboxSection title="Actions">
        <ListboxItem key="new" startContent={<Star className="h-4 w-4" />}>
          New file
        </ListboxItem>
        <ListboxItem key="copy" startContent={<Star className="h-4 w-4" />}>
          Copy link
        </ListboxItem>
        <ListboxItem key="edit" startContent={<Star className="h-4 w-4" />}>
          Edit file
        </ListboxItem>
      </ListboxSection>
      <ListboxSection title="Danger zone">
        <ListboxItem
          key="archive"
          startContent={<Download className="h-4 w-4" />}
        >
          Archive
        </ListboxItem>
        <ListboxItem
          key="delete"
          startContent={<Download className="h-4 w-4" />}
        >
          Delete
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Listbox size="sm">
        <ListboxItem key="sm1">Small size</ListboxItem>
        <ListboxItem key="sm2">Item 2</ListboxItem>
        <ListboxItem key="sm3">Item 3</ListboxItem>
      </Listbox>
      <Listbox size="md">
        <ListboxItem key="md1">Medium size</ListboxItem>
        <ListboxItem key="md2">Item 2</ListboxItem>
        <ListboxItem key="md3">Item 3</ListboxItem>
      </Listbox>
      <Listbox size="lg">
        <ListboxItem key="lg1">Large size</ListboxItem>
        <ListboxItem key="lg2">Item 2</ListboxItem>
        <ListboxItem key="lg3">Item 3</ListboxItem>
      </Listbox>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const DynamicItems: Story = {
  render: (args) => {
    const items = [
      { key: 'home', label: 'Home', icon: <User className="h-4 w-4" /> },
      { key: 'about', label: 'About', icon: <Settings className="h-4 w-4" /> },
      { key: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
      { key: 'help', label: 'Help', icon: <Bell className="h-4 w-4" /> },
    ];

    return (
      <Listbox {...args} selectionMode="single">
        {items.map((item) => (
          <ListboxItem key={item.key} startContent={item.icon}>
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>
    );
  },
};

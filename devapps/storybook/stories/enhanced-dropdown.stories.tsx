/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Bell,
  Calendar,
  CreditCard,
  Download,
  Edit,
  FileText,
  Inbox,
  Laptop,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Smartphone,
  Sun,
  Tablet,
  Trash,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';

import { Badge } from '@repo/design-system/ui/badge';
import { Button } from '@repo/design-system/ui/button';
import {
  EnhancedDropdown,
  EnhancedDropdownCheckboxItem,
  EnhancedDropdownContent,
  EnhancedDropdownGroup,
  EnhancedDropdownItem,
  EnhancedDropdownLabel,
  EnhancedDropdownPortal,
  EnhancedDropdownRadioGroup,
  EnhancedDropdownRadioItem,
  EnhancedDropdownSection,
  EnhancedDropdownSeparator,
  EnhancedDropdownSub,
  EnhancedDropdownSubContent,
  EnhancedDropdownSubTrigger,
  EnhancedDropdownTrigger,
} from '@repo/design-system/ui/enhanced-dropdown';

/**
 * An enhanced dropdown menu component that displays a menu to the user with various features
 * like descriptions, icons, shortcuts, sections, and more.
 */
const meta: Meta<typeof EnhancedDropdown> = {
  title: 'UI/EnhancedDropdown',
  component: EnhancedDropdown,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default enhanced dropdown menu with basic items.
 */
export const Default: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>Open Menu</EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-56">
        <EnhancedDropdownLabel>My Account</EnhancedDropdownLabel>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem>Profile</EnhancedDropdownItem>
        <EnhancedDropdownItem>Billing</EnhancedDropdownItem>
        <EnhancedDropdownItem>Settings</EnhancedDropdownItem>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem variant="destructive">
          Log out
        </EnhancedDropdownItem>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with icons and shortcuts.
 */
export const WithIconsAndShortcuts: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>
        <Button variant="outline">Open Menu</Button>
      </EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-56">
        <EnhancedDropdownLabel>My Account</EnhancedDropdownLabel>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem
          startContent={<User className="size-4" />}
          shortcut="⇧⌘P"
        >
          Profile
        </EnhancedDropdownItem>
        <EnhancedDropdownItem
          startContent={<CreditCard className="size-4" />}
          shortcut="⌘B"
        >
          Billing
        </EnhancedDropdownItem>
        <EnhancedDropdownItem
          startContent={<Settings className="size-4" />}
          shortcut="⌘S"
        >
          Settings
        </EnhancedDropdownItem>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem
          variant="destructive"
          startContent={<LogOut className="size-4" />}
          shortcut="⇧⌘Q"
        >
          Log out
        </EnhancedDropdownItem>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with item descriptions.
 */
export const WithDescriptions: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>
        <Button variant="outline">Actions</Button>
      </EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-72">
        <EnhancedDropdownLabel>Actions</EnhancedDropdownLabel>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem
          startContent={<Edit className="size-4" />}
          description="Edit the current document and save changes"
        >
          Edit Document
        </EnhancedDropdownItem>
        <EnhancedDropdownItem
          startContent={<Copy className="size-4" />}
          description="Create a duplicate of the current document"
        >
          Duplicate
        </EnhancedDropdownItem>
        <EnhancedDropdownItem
          startContent={<Download className="size-4" />}
          description="Download the document to your local device"
        >
          Download
        </EnhancedDropdownItem>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem
          variant="destructive"
          startContent={<Trash className="size-4" />}
          description="Permanently delete this document"
        >
          Delete
        </EnhancedDropdownItem>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with sections.
 */
export const WithSections: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>
        <Button variant="outline">Dashboard</Button>
      </EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-56">
        <EnhancedDropdownSection title="Personal">
          <EnhancedDropdownItem startContent={<User className="size-4" />}>
            Profile
          </EnhancedDropdownItem>
          <EnhancedDropdownItem startContent={<Settings className="size-4" />}>
            Settings
          </EnhancedDropdownItem>
        </EnhancedDropdownSection>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownSection title="Communication">
          <EnhancedDropdownItem startContent={<Mail className="size-4" />}>
            Messages
          </EnhancedDropdownItem>
          <EnhancedDropdownItem startContent={<Bell className="size-4" />}>
            Notifications
          </EnhancedDropdownItem>
        </EnhancedDropdownSection>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownSection title="Team">
          <EnhancedDropdownItem startContent={<Users className="size-4" />}>
            Members
          </EnhancedDropdownItem>
          <EnhancedDropdownItem startContent={<UserPlus className="size-4" />}>
            Invite
          </EnhancedDropdownItem>
        </EnhancedDropdownSection>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with nested submenus.
 */
export const WithSubmenus: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>
        <Button variant="outline">Options</Button>
      </EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-56">
        <EnhancedDropdownItem startContent={<Search className="size-4" />}>
          Search
        </EnhancedDropdownItem>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownGroup>
          <EnhancedDropdownItem
            startContent={<Plus className="size-4" />}
            shortcut="⌘+T"
          >
            New Project
          </EnhancedDropdownItem>
          <EnhancedDropdownSub>
            <EnhancedDropdownSubTrigger
              startContent={<UserPlus className="size-4" />}
            >
              Invite Users
            </EnhancedDropdownSubTrigger>
            <EnhancedDropdownPortal>
              <EnhancedDropdownSubContent>
                <EnhancedDropdownItem
                  startContent={<Mail className="size-4" />}
                >
                  Email Invitation
                </EnhancedDropdownItem>
                <EnhancedDropdownItem
                  startContent={<MessageSquare className="size-4" />}
                >
                  Message Invitation
                </EnhancedDropdownItem>
                <EnhancedDropdownSeparator />
                <EnhancedDropdownSub>
                  <EnhancedDropdownSubTrigger
                    startContent={<PlusCircle className="size-4" />}
                  >
                    More Options
                  </EnhancedDropdownSubTrigger>
                  <EnhancedDropdownPortal>
                    <EnhancedDropdownSubContent>
                      <EnhancedDropdownItem>
                        Copy Invite Link
                      </EnhancedDropdownItem>
                      <EnhancedDropdownItem>
                        Create Group Invite
                      </EnhancedDropdownItem>
                      <EnhancedDropdownItem>
                        Schedule Invitation
                      </EnhancedDropdownItem>
                    </EnhancedDropdownSubContent>
                  </EnhancedDropdownPortal>
                </EnhancedDropdownSub>
              </EnhancedDropdownSubContent>
            </EnhancedDropdownPortal>
          </EnhancedDropdownSub>
        </EnhancedDropdownGroup>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with checkboxes for multiple selection.
 */
export const WithCheckboxes: Story = {
  render: function Render(args) {
    const [autosave, setAutosave] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [showNotifications, setShowNotifications] = useState(true);

    return (
      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Preferences</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-56">
          <EnhancedDropdownLabel>Editor Preferences</EnhancedDropdownLabel>
          <EnhancedDropdownSeparator />
          <EnhancedDropdownCheckboxItem
            checked={autosave}
            onCheckedChange={setAutosave}
            shortcut="⌘S"
          >
            Autosave
          </EnhancedDropdownCheckboxItem>
          <EnhancedDropdownCheckboxItem
            checked={showComments}
            onCheckedChange={setShowComments}
            shortcut="⌘C"
          >
            Show Comments
          </EnhancedDropdownCheckboxItem>
          <EnhancedDropdownCheckboxItem
            checked={showNotifications}
            onCheckedChange={setShowNotifications}
            shortcut="⌘N"
          >
            Show Notifications
          </EnhancedDropdownCheckboxItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    );
  },
};

/**
 * A dropdown menu with radio items for single selection.
 */
export const WithRadioItems: Story = {
  render: function Render(args) {
    const [device, setDevice] = useState('laptop');
    const [status, setStatus] = useState('online');

    return (
      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Settings</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-56">
          <EnhancedDropdownLabel>Device</EnhancedDropdownLabel>
          <EnhancedDropdownRadioGroup value={device} onValueChange={setDevice}>
            <EnhancedDropdownRadioItem value="laptop">
              <div className="flex items-center gap-2">
                <Laptop className="size-4" />
                <span>Laptop</span>
              </div>
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="smartphone">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4" />
                <span>Smartphone</span>
              </div>
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="tablet">
              <div className="flex items-center gap-2">
                <Tablet className="size-4" />
                <span>Tablet</span>
              </div>
            </EnhancedDropdownRadioItem>
          </EnhancedDropdownRadioGroup>
          <EnhancedDropdownSeparator />
          <EnhancedDropdownLabel>Status</EnhancedDropdownLabel>
          <EnhancedDropdownRadioGroup value={status} onValueChange={setStatus}>
            <EnhancedDropdownRadioItem value="online">
              Online
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="away">
              Away
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="offline">
              Offline
            </EnhancedDropdownRadioItem>
          </EnhancedDropdownRadioGroup>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    );
  },
};

/**
 * A dropdown menu with different content variants.
 */
export const ContentVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Default</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" variant="default">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Flat</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" variant="flat">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Elevated</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" variant="elevated">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    </div>
  ),
};

/**
 * A dropdown menu with different backdrop options.
 */
export const BackdropVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <EnhancedDropdown {...args} backdrop="transparent">
        <EnhancedDropdownTrigger>
          <Button variant="outline">Transparent</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args} backdrop="blur">
        <EnhancedDropdownTrigger>
          <Button variant="outline">Blur</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args} backdrop="opaque">
        <EnhancedDropdownTrigger>
          <Button variant="outline">Opaque</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    </div>
  ),
};

/**
 * A dropdown menu with custom positioning.
 */
export const CustomPositioning: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Left Aligned</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" align="start">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Center Aligned</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" align="center">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>

      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline">Right Aligned</Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40" align="end">
          <EnhancedDropdownItem>Option 1</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 2</EnhancedDropdownItem>
          <EnhancedDropdownItem>Option 3</EnhancedDropdownItem>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    </div>
  ),
};

/**
 * A dropdown menu with rich content in items.
 */
export const RichContent: Story = {
  render: (args) => (
    <EnhancedDropdown {...args}>
      <EnhancedDropdownTrigger>
        <Button variant="outline">Notifications</Button>
      </EnhancedDropdownTrigger>
      <EnhancedDropdownContent className="w-80">
        <EnhancedDropdownLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="outline">5 New</Badge>
        </EnhancedDropdownLabel>
        <EnhancedDropdownSeparator />
        <div className="max-h-80 overflow-auto">
          <EnhancedDropdownItem className="p-0">
            <div className="flex flex-col gap-1 p-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium">New document shared</span>
                  <span className="text-muted-foreground text-xs">2m ago</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                John Doe shared a document with you: "Q3 Marketing Plan"
              </p>
            </div>
          </EnhancedDropdownItem>
          <EnhancedDropdownSeparator />
          <EnhancedDropdownItem className="p-0">
            <div className="flex flex-col gap-1 p-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium">Meeting reminder</span>
                  <span className="text-muted-foreground text-xs">1h ago</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Team standup meeting in 30 minutes
              </p>
            </div>
          </EnhancedDropdownItem>
          <EnhancedDropdownSeparator />
          <EnhancedDropdownItem className="p-0">
            <div className="flex flex-col gap-1 p-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <Inbox className="size-4 text-primary" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium">New message</span>
                  <span className="text-muted-foreground text-xs">3h ago</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Jane Smith: "Can you review the latest design changes?"
              </p>
            </div>
          </EnhancedDropdownItem>
        </div>
        <EnhancedDropdownSeparator />
        <EnhancedDropdownItem className="justify-center text-center font-medium">
          View all notifications
        </EnhancedDropdownItem>
      </EnhancedDropdownContent>
    </EnhancedDropdown>
  ),
};

/**
 * A dropdown menu with theme switcher example.
 */
export const ThemeSwitcher: Story = {
  render: function Render(args) {
    const [theme, setTheme] = useState('system');

    return (
      <EnhancedDropdown {...args}>
        <EnhancedDropdownTrigger>
          <Button variant="outline" size="icon">
            {theme === 'light' && <Sun className="size-[1.2rem]" />}
            {theme === 'dark' && <Moon className="size-[1.2rem]" />}
            {theme === 'system' && <Laptop className="size-[1.2rem]" />}
          </Button>
        </EnhancedDropdownTrigger>
        <EnhancedDropdownContent className="w-40">
          <EnhancedDropdownRadioGroup value={theme} onValueChange={setTheme}>
            <EnhancedDropdownRadioItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="size-4" />
                <span>Light</span>
              </div>
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="size-4" />
                <span>Dark</span>
              </div>
            </EnhancedDropdownRadioItem>
            <EnhancedDropdownRadioItem value="system">
              <div className="flex items-center gap-2">
                <Laptop className="size-4" />
                <span>System</span>
              </div>
            </EnhancedDropdownRadioItem>
          </EnhancedDropdownRadioGroup>
        </EnhancedDropdownContent>
      </EnhancedDropdown>
    );
  },
};

// Helper component for the Copy icon
function Copy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c0-1.1.9-2 2-2h2" />
      <path d="M4 12c0-1.1.9-2 2-2h2" />
      <path d="M4 8c0-1.1.9-2 2-2h2" />
    </svg>
  );
}

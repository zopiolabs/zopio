/**
 * SPDX-License-Identifier: MIT
 */

import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuSection,
  MenuTitle,
} from '@repo/design-system/ui/menu';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Menu> = {
  title: 'UI/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

/**
 * Basic vertical menu with items.
 */
export const Default: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Messages</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Help</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Menu with icons and active state.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu>
        <MenuItem
          icon={
            <svg
              aria-labelledby="profile-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="profile-icon-title">Profile Icon</title>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={
            <svg
              aria-labelledby="settings-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="settings-icon-title">Settings Icon</title>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          active
        >
          Settings
        </MenuItem>
        <MenuItem
          icon={
            <svg
              aria-labelledby="messages-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="messages-icon-title">Messages Icon</title>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        >
          Messages
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={
            <svg
              aria-labelledby="help-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="help-icon-title">Help Icon</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          }
          disabled
        >
          Help
        </MenuItem>
        <MenuItem
          icon={
            <svg
              aria-labelledby="logout-icon-title-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="logout-icon-title-1">Logout Icon</title>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          }
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Menu with sections and titles.
 */
export const WithSections: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu>
        <MenuTitle>Account</MenuTitle>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuDivider />
        <MenuTitle>Content</MenuTitle>
        <MenuItem>Documents</MenuItem>
        <MenuItem>Photos</MenuItem>
        <MenuItem>Videos</MenuItem>
        <MenuDivider />
        <MenuTitle>Actions</MenuTitle>
        <MenuItem>Help</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Menu with keyboard shortcuts.
 */
export const WithShortcuts: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘N</span>}
        >
          New File
        </MenuItem>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘O</span>}
        >
          Open
        </MenuItem>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘S</span>}
        >
          Save
        </MenuItem>
        <MenuDivider />
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘Z</span>}
        >
          Undo
        </MenuItem>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘⇧Z</span>}
        >
          Redo
        </MenuItem>
        <MenuDivider />
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘X</span>}
        >
          Cut
        </MenuItem>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘C</span>}
        >
          Copy
        </MenuItem>
        <MenuItem
          suffix={<span className="text-muted-foreground text-xs">⌘V</span>}
        >
          Paste
        </MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Horizontal menu variant.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu variant="horizontal" className="w-full">
        <MenuItem>Home</MenuItem>
        <MenuItem active>Products</MenuItem>
        <MenuItem>Services</MenuItem>
        <MenuItem>About</MenuItem>
        <MenuItem>Contact</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Compact menu variant.
 */
export const Compact: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu variant="compact">
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Messages</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Help</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Menu with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu size="sm">
        <MenuTitle>Small</MenuTitle>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
      <Menu size="md">
        <MenuTitle>Medium (Default)</MenuTitle>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
      <Menu size="lg">
        <MenuTitle>Large</MenuTitle>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Bordered menu variant.
 */
export const Bordered: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu bordered>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Messages</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Help</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </div>
  ),
};

/**
 * Menu with nested sections.
 */
export const NestedSections: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu>
        <MenuSection title="User">
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuSection>
        <MenuDivider />
        <MenuSection title="Content">
          <MenuItem>Documents</MenuItem>
          <MenuItem>Photos</MenuItem>
          <MenuItem>Videos</MenuItem>
        </MenuSection>
        <MenuDivider />
        <MenuSection title="System">
          <MenuItem>Help</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuSection>
      </Menu>
    </div>
  ),
};

/**
 * Menu with both icons and shortcuts.
 */
export const CompleteExample: Story = {
  render: () => (
    <div className="rounded-lg bg-background p-4">
      <Menu bordered>
        <MenuTitle>File</MenuTitle>
        <MenuItem
          icon={
            <svg
              aria-labelledby="file-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="file-icon-title">File Icon</title>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
          suffix={<span className="text-muted-foreground text-xs">⌘N</span>}
        >
          New File
        </MenuItem>
        <MenuItem
          icon={
            <svg
              aria-labelledby="save-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="save-icon-title">Save Icon</title>
              <path d="M5 8V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" />
              <path d="M19 16v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3" />
              <rect width="14" height="8" x="5" y="8" rx="1" />
            </svg>
          }
          suffix={<span className="text-muted-foreground text-xs">⌘S</span>}
        >
          Save
        </MenuItem>
        <MenuDivider />
        <MenuTitle>Edit</MenuTitle>
        <MenuItem
          icon={
            <svg
              aria-labelledby="undo-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="undo-icon-title">Undo Icon</title>
              <path d="M3 10h18" />
              <path d="m8 5-5 5 5 5" />
            </svg>
          }
          suffix={<span className="text-muted-foreground text-xs">⌘Z</span>}
        >
          Undo
        </MenuItem>
        <MenuItem
          icon={
            <svg
              aria-labelledby="redo-icon-title"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="redo-icon-title">Redo Icon</title>
              <path d="M21 10H3" />
              <path d="m16 5 5 5-5 5" />
            </svg>
          }
          suffix={<span className="text-muted-foreground text-xs">⌘⇧Z</span>}
        >
          Redo
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={
            <svg
              aria-labelledby="logout-icon-title-2"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title id="logout-icon-title-2">Logout Icon</title>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          }
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  ),
};

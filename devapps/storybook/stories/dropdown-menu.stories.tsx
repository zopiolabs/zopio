/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Brush,
  Droplet,
  Layers,
  Mail,
  Palette,
  Plus,
  PlusCircle,
  Search,
  Shapes,
  UserPlus,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/design-system/ui/dropdown-menu';

/**
 * Displays a menu to the user — such as a set of actions or functions —
 * triggered by a button.
 */
const meta: Meta<typeof DropdownMenu> = {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the dropdown menu.
 */
export const Default: Story = {};

/**
 * A dropdown menu with shortcuts.
 */
export const WithShortcuts: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Controls</DropdownMenuLabel>
        <DropdownMenuItem>
          Back
          <DropdownMenuShortcut>⌘[</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Forward
          <DropdownMenuShortcut>⌘]</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with submenus.
 */
export const WithSubmenus: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem>
          <Search className="mr-2 size-4" />
          <span>Search</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Plus className="mr-2 size-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 size-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 size-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 size-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with radio items.
 */
export const WithRadioItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel inset>Status</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="warning">
          <DropdownMenuRadioItem value="info">Info</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="warning">Warning</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="error">Error</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with material options.
 */
export const WithMaterials: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Materials</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Material</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Palette className="mr-2 size-4" />
            <span>Solid Colors</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Droplet className="mr-2 size-4" />
            <span>Gradient</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Brush className="mr-2 size-4" />
            <span>Texture</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Layers className="mr-2 size-4" />
            <span>Advanced Materials</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem>
                <span>Metallic</span>
                <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Glass</span>
                <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Fabric</span>
                <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shapes className="mr-2 size-4" />
                <span>Custom Material...</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with checkboxes.
 */
export const WithCheckboxes: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuCheckboxItem checked>
          Autosave
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show Comments</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A dropdown menu with material properties.
 */
export const MaterialProperties: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>Properties</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Material Properties</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Reflective</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Roughness</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Transparency</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Normal Mapping</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Rendering Quality</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="medium">
          <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

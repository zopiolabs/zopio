/**
 * SPDX-License-Identifier: MIT
 */

import { ThemeSwitcher } from '@repo/design-system/ui/theme-switcher';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

/**
 * A component to switch between light, dark and system theme.
 * Supports both controlled and uncontrolled modes.
 * Features include draggable buttons, popover, glimpse tooltips, and list view.
 */
const meta = {
  title: 'ui/Theme Switcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'The current theme value (for controlled component)',
    },
    defaultValue: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'The default theme value (for uncontrolled component)',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when theme changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    draggable: {
      control: 'boolean',
      description: 'Enable draggable theme buttons',
    },
    showPopover: {
      control: 'boolean',
      description: 'Show theme switcher in a popover',
    },
    showGlimpse: {
      control: 'boolean',
      description: 'Show glimpse tooltips on hover',
    },
    showList: {
      control: 'boolean',
      description: 'Show themes in a list view',
    },
  },
  args: {
    defaultValue: 'system',
    draggable: false,
    showPopover: false,
    showGlimpse: false,
    showList: false,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default theme switcher with system theme selected by default.
 */
export const Default: Story = {
  render: (args) => <ThemeSwitcher {...args} />,
};

/**
 * Uncontrolled mode example where the component manages its own state.
 * Check the console for the onChange event.
 */
export const Uncontrolled: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="mb-2 text-muted-foreground text-sm">
        Click on the icons to change the theme
      </p>
      <ThemeSwitcher
        defaultValue="system"
        onChange={(theme) => console.log(`Theme changed to: ${theme}`)}
      />
    </div>
  ),
};

/**
 * Controlled mode example where the parent component manages the state.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-muted-foreground text-sm">
          Current theme: <strong>{theme}</strong>
        </p>
        <ThemeSwitcher value={theme} onChange={setTheme} />
      </div>
    );
  },
};

/**
 * Theme switcher with different styling.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ThemeSwitcher
        defaultValue="light"
        className="bg-slate-100 dark:bg-slate-800"
      />

      <ThemeSwitcher
        defaultValue="dark"
        className="bg-blue-50 ring-blue-200 dark:bg-blue-950 dark:ring-blue-800"
      />

      <ThemeSwitcher
        defaultValue="system"
        className="bg-amber-50 ring-amber-200 dark:bg-amber-950 dark:ring-amber-800"
      />
    </div>
  ),
};

/**
 * Theme switcher in different contexts.
 */
export const InContext: Story = {
  render: () => (
    <div className="flex w-[500px] flex-col gap-8">
      {/* In a header */}
      <div className="overflow-hidden rounded-md border">
        <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
          <span className="font-medium">Application Settings</span>
          <ThemeSwitcher defaultValue="system" />
        </div>
        <div className="p-4">
          <p className="text-muted-foreground text-sm">
            Content with theme switcher in the header
          </p>
        </div>
      </div>

      {/* In a settings panel */}
      <div className="rounded-md border p-4">
        <h3 className="mb-4 font-medium">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeSwitcher defaultValue="light" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Font Size</span>
            <div className="flex items-center gap-2">
              <span className="text-xs">A</span>
              <input type="range" className="w-24" />
              <span className="text-base">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Theme switcher with draggable buttons.
 * You can drag the theme buttons horizontally.
 */
export const Draggable: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="mb-2 text-muted-foreground text-sm">
        Drag the theme buttons horizontally
      </p>
      <ThemeSwitcher
        defaultValue="system"
        draggable={true}
        onChange={(theme) => console.log(`Theme changed to: ${theme}`)}
      />
    </div>
  ),
};

/**
 * Theme switcher with glimpse tooltips.
 * Hover over the theme buttons to see more information.
 */
export const WithGlimpse: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="mb-2 text-muted-foreground text-sm">
        Hover over the theme buttons for more information
      </p>
      <ThemeSwitcher defaultValue="system" showGlimpse={true} />
    </div>
  ),
};

/**
 * Theme switcher in a popover.
 * Click the button to open a popover with theme options.
 */
export const WithPopover: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="mb-2 text-muted-foreground text-sm">
        Click the button to open theme options
      </p>
      <ThemeSwitcher defaultValue="system" showPopover={true} />
    </div>
  ),
};

/**
 * Theme switcher with list view.
 * Shows theme options in a detailed list format.
 */
export const ListView: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col items-center gap-4">
      <p className="mb-2 text-muted-foreground text-sm">
        Theme options in list format
      </p>
      <ThemeSwitcher defaultValue="system" showList={true} />
    </div>
  ),
};

/**
 * Theme switcher with combined features.
 * Demonstrates draggable buttons with glimpse tooltips.
 */
export const CombinedFeatures: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-muted-foreground text-sm">
          Draggable with Glimpse
        </p>
        <ThemeSwitcher
          defaultValue="system"
          draggable={true}
          showGlimpse={true}
        />
      </div>

      <div className="flex w-[300px] flex-col items-center gap-4">
        <p className="mb-2 text-muted-foreground text-sm">
          Popover with List View
        </p>
        <ThemeSwitcher
          defaultValue="light"
          showPopover={true}
          showList={true}
        />
      </div>
    </div>
  ),
};

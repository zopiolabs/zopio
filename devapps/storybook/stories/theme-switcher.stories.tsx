/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/ui/card';
import {
  ThemeProvider,
  ThemeSwitcher,
  useThemeContext,
} from '@repo/design-system/ui/theme-switcher';

/**
 * A component to switch between light, dark and system theme.
 */
const meta: Meta<typeof ThemeSwitcher> = {
  title: 'ui/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the theme switcher',
    },
    value: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Current theme value (controlled)',
    },
    defaultValue: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Default theme value (uncontrolled)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the theme switcher',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default theme switcher.
 */
export const Default: Story = {
  args: {
    defaultValue: 'system',
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <ThemeSwitcher size="sm" defaultValue="light" />
        <p className="mt-2 text-muted-foreground text-xs">Small</p>
      </div>
      <div className="text-center">
        <ThemeSwitcher size="md" defaultValue="dark" />
        <p className="mt-2 text-muted-foreground text-xs">Medium</p>
      </div>
      <div className="text-center">
        <ThemeSwitcher size="lg" defaultValue="system" />
        <p className="mt-2 text-muted-foreground text-xs">Large</p>
      </div>
    </div>
  ),
};

/**
 * Controlled theme switcher.
 */
export const Controlled: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    return (
      <div className="space-y-4 text-center">
        <div>
          <p className="mb-2 text-muted-foreground text-sm">
            Current theme: <span className="font-medium">{theme}</span>
          </p>
          <ThemeSwitcher value={theme} onValueChange={setTheme} />
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
            Set Light
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
            Set Dark
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme('system')}
          >
            Set System
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Uncontrolled with callback.
 */
export const UncontrolledWithCallback: Story = {
  render: () => {
    const [lastChanged, setLastChanged] = useState<string>('');

    return (
      <div className="space-y-4 text-center">
        <ThemeSwitcher
          defaultValue="system"
          onValueChange={(theme) => {
            setLastChanged(
              `Changed to: ${theme} at ${new Date().toLocaleTimeString()}`
            );
          }}
        />

        {lastChanged && (
          <p className="text-muted-foreground text-sm">{lastChanged}</p>
        )}
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="text-center">
        <ThemeSwitcher defaultValue="light" disabled />
        <p className="mt-2 text-muted-foreground text-xs">Light (disabled)</p>
      </div>
      <div className="text-center">
        <ThemeSwitcher defaultValue="dark" disabled />
        <p className="mt-2 text-muted-foreground text-xs">Dark (disabled)</p>
      </div>
      <div className="text-center">
        <ThemeSwitcher defaultValue="system" disabled />
        <p className="mt-2 text-muted-foreground text-xs">System (disabled)</p>
      </div>
    </div>
  ),
};

/**
 * Theme context example.
 */
const ThemeContextExample = () => {
  const { theme, resolvedTheme, setTheme } = useThemeContext();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Context</CardTitle>
        <CardDescription>
          Using the theme context to access and control theme state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Current theme:</span>
          <span className="font-medium text-sm">{theme}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Resolved theme:</span>
          <span className="font-medium text-sm">{resolvedTheme}</span>
        </div>

        <ThemeSwitcher value={theme} onValueChange={setTheme} />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
            Light
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
            Dark
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme('system')}
          >
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const WithThemeProvider: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system" storageKey="storybook-theme">
      <ThemeContextExample />
    </ThemeProvider>
  ),
};

/**
 * In navigation bar context.
 */
export const InNavigation: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <nav className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="font-medium">My App</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <ThemeSwitcher defaultValue="system" size="sm" />
        </div>
      </nav>
    </div>
  ),
};

/**
 * Multiple theme switchers.
 */
export const Multiple: Story = {
  render: () => {
    const [globalTheme, setGlobalTheme] = useState<'light' | 'dark' | 'system'>(
      'system'
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-2 font-semibold text-lg">Global Theme Control</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            All switchers below are synchronized
          </p>
          <ThemeSwitcher
            value={globalTheme}
            onValueChange={setGlobalTheme}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <h4 className="mb-2 font-medium">Header</h4>
            <ThemeSwitcher
              value={globalTheme}
              onValueChange={setGlobalTheme}
              size="sm"
            />
          </Card>

          <Card className="p-4 text-center">
            <h4 className="mb-2 font-medium">Sidebar</h4>
            <ThemeSwitcher
              value={globalTheme}
              onValueChange={setGlobalTheme}
              size="sm"
            />
          </Card>

          <Card className="p-4 text-center">
            <h4 className="mb-2 font-medium">Settings</h4>
            <ThemeSwitcher
              value={globalTheme}
              onValueChange={setGlobalTheme}
              size="sm"
            />
          </Card>
        </div>
      </div>
    );
  },
};

/**
 * Custom styling.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="mb-2 font-medium">Rounded corners</h4>
        <ThemeSwitcher defaultValue="dark" className="rounded-xl" />
      </div>

      <div className="text-center">
        <h4 className="mb-2 font-medium">With shadow</h4>
        <ThemeSwitcher defaultValue="light" className="shadow-lg" />
      </div>

      <div className="text-center">
        <h4 className="mb-2 font-medium">Custom border</h4>
        <ThemeSwitcher
          defaultValue="system"
          className="border-2 border-primary/20"
        />
      </div>
    </div>
  ),
};

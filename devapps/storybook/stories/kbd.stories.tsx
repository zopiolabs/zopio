/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Kbd, Key } from '@repo/design-system/ui/kbd';

/**
 * A component for displaying keyboard shortcuts and key combinations.
 */
const meta: Meta<typeof Kbd> = {
  title: 'ui/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the kbd component',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'secondary'],
      description: 'Visual variant of the kbd',
    },
    separator: {
      control: { type: 'text' },
      description: 'Separator between keys',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default kbd component.
 */
export const Default: Story = {
  args: {
    children: '⌘K',
  },
};

/**
 * Different sizes of kbd components.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd size="sm">⌘K</Kbd>
      <Kbd size="md">⌘K</Kbd>
      <Kbd size="lg">⌘K</Kbd>
    </div>
  ),
};

/**
 * Different variants of kbd components.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd variant="default">⌘K</Kbd>
      <Kbd variant="outline">⌘K</Kbd>
      <Kbd variant="secondary">⌘K</Kbd>
    </div>
  ),
};

/**
 * Kbd with key combinations using the keys prop.
 */
export const KeyCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Kbd keys={['cmd', 'k']} />
      <Kbd keys={['ctrl', 'shift', 'p']} />
      <Kbd keys={['alt', 'tab']} />
      <Kbd keys={['cmd', 'shift', 'z']} />
    </div>
  ),
};

/**
 * Custom separators between keys.
 */
export const CustomSeparator: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Kbd keys={['cmd', 'k']} separator="+" />
      <Kbd keys={['ctrl', 'alt', 'del']} separator=" + " />
      <Kbd keys={['shift', 'enter']} separator=" then " />
      <Kbd keys={['cmd', 'c']} separator=" & " />
    </div>
  ),
};

/**
 * Common keyboard shortcuts.
 */
export const CommonShortcuts: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Copy</span>
          <Kbd keys={['cmd', 'c']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Paste</span>
          <Kbd keys={['cmd', 'v']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Undo</span>
          <Kbd keys={['cmd', 'z']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Redo</span>
          <Kbd keys={['cmd', 'shift', 'z']} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Save</span>
          <Kbd keys={['cmd', 's']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Find</span>
          <Kbd keys={['cmd', 'f']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">New Tab</span>
          <Kbd keys={['cmd', 't']} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Close Tab</span>
          <Kbd keys={['cmd', 'w']} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Special keys and symbols.
 */
export const SpecialKeys: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Modifiers</h4>
        <div className="space-y-1">
          <Kbd keys={['cmd']} />
          <Kbd keys={['ctrl']} />
          <Kbd keys={['alt']} />
          <Kbd keys={['shift']} />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Navigation</h4>
        <div className="space-y-1">
          <Kbd keys={['up']} />
          <Kbd keys={['down']} />
          <Kbd keys={['left']} />
          <Kbd keys={['right']} />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Actions</h4>
        <div className="space-y-1">
          <Kbd keys={['enter']} />
          <Kbd keys={['esc']} />
          <Kbd keys={['tab']} />
          <Kbd keys={['space']} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Kbd in text context.
 */
export const InText: Story = {
  render: () => (
    <div className="max-w-md space-y-4 text-sm">
      <p>
        Press <Kbd keys={['cmd', 'k']} /> to open the command palette.
      </p>
      <p>
        Use <Kbd keys={['cmd', 'shift', 'p']} /> to open the command palette in
        VS Code.
      </p>
      <p>
        To save your work, press <Kbd keys={['cmd', 's']} /> or use the menu.
      </p>
      <p>
        Navigate between tabs with <Kbd keys={['cmd', 'shift', '[']} /> and{' '}
        <Kbd keys={['cmd', 'shift', ']']} />.
      </p>
    </div>
  ),
};

/**
 * Individual Key components.
 */
export const IndividualKeys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Key>⌘</Key>
      <span>+</span>
      <Key>⇧</Key>
      <span>+</span>
      <Key>P</Key>
    </div>
  ),
};

/**
 * Help documentation example.
 */
export const HelpDocumentation: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 rounded-lg border p-6">
      <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>

      <div className="space-y-3">
        <div>
          <h4 className="mb-2 font-medium text-sm">General</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Command palette
              </span>
              <Kbd keys={['cmd', 'k']} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Quick search
              </span>
              <Kbd keys={['cmd', 'shift', 'k']} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Settings</span>
              <Kbd keys={['cmd', ',']} size="sm" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Navigation</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Go back</span>
              <Kbd keys={['cmd', '[']} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Go forward</span>
              <Kbd keys={['cmd', ']']} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Sidebar</span>
              <Kbd keys={['cmd', 'b']} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

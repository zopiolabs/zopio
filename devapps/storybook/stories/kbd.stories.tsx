/**
 * SPDX-License-Identifier: MIT
 */

import { Kbd, KbdKey } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'UI/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>Press</span>
        <Kbd>
          <KbdKey aria-label="Command">⌘</KbdKey>
          <KbdKey aria-label="K">K</KbdKey>
        </Kbd>
        <span>to open the command palette.</span>
      </div>
    </div>
  ),
};

export const WithCustomSeparator: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>Press</span>
        <Kbd separator={<span className="text-primary">→</span>}>
          <KbdKey aria-label="Control">Ctrl</KbdKey>
          <KbdKey aria-label="Alt">Alt</KbdKey>
          <KbdKey aria-label="Delete">Del</KbdKey>
        </Kbd>
        <span>to restart.</span>
      </div>
    </div>
  ),
};

export const SingleKey: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>Press</span>
        <Kbd>
          <KbdKey aria-label="Escape">Esc</KbdKey>
        </Kbd>
        <span>to exit.</span>
      </div>
    </div>
  ),
};

export const KeyCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-4 space-y-4">
      <div className="flex items-center gap-2">
        <span>Copy:</span>
        <Kbd>
          <KbdKey aria-label="Command">⌘</KbdKey>
          <KbdKey aria-label="C">C</KbdKey>
        </Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>Paste:</span>
        <Kbd>
          <KbdKey aria-label="Command">⌘</KbdKey>
          <KbdKey aria-label="V">V</KbdKey>
        </Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>Save:</span>
        <Kbd>
          <KbdKey aria-label="Command">⌘</KbdKey>
          <KbdKey aria-label="S">S</KbdKey>
        </Kbd>
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>Press</span>
        <Kbd className="border-primary-foreground/20 bg-primary text-primary-foreground">
          <KbdKey aria-label="Command">⌘</KbdKey>
          <KbdKey aria-label="Shift">⇧</KbdKey>
          <KbdKey aria-label="P">P</KbdKey>
        </Kbd>
        <span>to open projects.</span>
      </div>
    </div>
  ),
};

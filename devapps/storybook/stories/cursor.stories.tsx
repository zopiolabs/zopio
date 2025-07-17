/**
 * SPDX-License-Identifier: MIT
 */

import {
  Cursor,
  CursorBody,
  CursorMessage,
  CursorName,
  CursorPointer,
} from '@repo/design-system/ui/cursor';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * A collaborative cursor component for displaying user presence with name and message.
 */
const meta: Meta<typeof Cursor> = {
  title: 'ui/Cursor',
  component: Cursor,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <div className="flex items-center gap-6 bg-muted p-8">
      {/* Example 1: Cursor with pointer, name, and message */}
      <Cursor {...args}>
        <CursorPointer />
        <CursorBody>
          <CursorName className="font-semibold">Jane Doe</CursorName>
          <CursorMessage className="text-muted-foreground text-xs">
            Editing...
          </CursorMessage>
        </CursorBody>
      </Cursor>

      {/* Example 2: Cursor with pointer and name only */}
      <Cursor>
        <CursorPointer />
        <CursorBody>
          <CursorName className="font-semibold">John Smith</CursorName>
        </CursorBody>
      </Cursor>

      {/* Example 3: Cursor with pointer only */}
      <Cursor>
        <CursorPointer />
      </Cursor>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default collaborative cursor examples.
 */
export const Default: Story = {};

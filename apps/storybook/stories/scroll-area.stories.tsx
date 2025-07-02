/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 */
const meta = {
  title: 'ui/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
  args: {
    className: 'h-32 w-80 rounded-md border p-4',
    type: 'auto',
    children:
      "Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester. And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop. The king was so angry that he banished Jokester from the kingdom, but the people still laughed, and they laughed, and they laughed. And they all lived happily ever after.",
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the scroll area.
 */
export const Default: Story = {};

/**
 * Use the `type` prop with `always` to always show the scroll area.
 */
export const Always: Story = {
  args: {
    type: 'always',
  },
};

/**
 * Use the `type` prop with `hover` to show the scroll area on hover.
 */
export const Hover: Story = {
  args: {
    type: 'hover',
  },
};

/**
 * Use the `type` prop with `scroll` to show the scroll area when scrolling.
 */
export const Scroll: Story = {
  args: {
    type: 'scroll',
  },
};

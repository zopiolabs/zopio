/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { ChatAvatarDemo } from '@repo/design-system/ui/chat-avatar-demo';

/**
 * Demo component showcasing the enhanced global draggable avatar with chat functionality
 */
const meta: Meta<typeof ChatAvatarDemo> = {
  title: 'ui/ChatAvatarDemo',
  component: ChatAvatarDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A demo component showcasing the enhanced global draggable avatar with chat window functionality.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default demo showing the chat avatar with an open chat window
 */
export const Default: Story = {};

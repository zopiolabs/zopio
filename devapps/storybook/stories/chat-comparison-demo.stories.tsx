/**
 * SPDX-License-Identifier: MIT
 */

import { ChatComparisonDemo } from '@repo/design-system/ui/chat-comparison-demo';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * A demo component that showcases both chat interfaces (custom chat window and chat-bubble)
 */
const meta: Meta<typeof ChatComparisonDemo> = {
  title: 'ui/ChatComparisonDemo',
  component: ChatComparisonDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A demo component that showcases both chat interfaces (custom chat window and chat-bubble integration).',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default view of the chat comparison demo
 */
export const Default: Story = {
  args: {
    className: 'p-8',
  },
};

/**
 * Fullscreen view with more space for the chat interfaces
 */
export const Fullscreen: Story = {
  args: {
    className: 'p-8 min-h-screen',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

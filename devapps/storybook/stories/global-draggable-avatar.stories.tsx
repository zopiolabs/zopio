/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import type * as React from 'react';
import { useEffect, useState } from 'react';

import { GlobalDraggableAvatar } from '@repo/design-system/ui/global-draggable-avatar';

/**
 * A global draggable avatar component that can be moved across the entire Storybook interface.
 * This component is rendered at the document.body level via a portal and is not confined to the canvas.
 */
const meta: Meta<typeof GlobalDraggableAvatar> = {
  title: 'ui/GlobalDraggableAvatar',
  component: GlobalDraggableAvatar,
  tags: ['autodocs'],
  argTypes: {
    initials: {
      control: 'text',
      description: 'Initials to display when no image is available',
      defaultValue: 'AB',
    },
    imageUrl: {
      control: 'text',
      description: 'Optional image URL for the avatar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
      defaultValue: 'md',
    },
    bgColor: {
      control: 'color',
      description: 'Background color for the avatar fallback',
      defaultValue: '#6366f1',
    },
    textColor: {
      control: 'color',
      description: 'Text color for the avatar fallback',
      defaultValue: '#ffffff',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for the avatar',
      defaultValue: 9999,
    },
    initialPosition: {
      control: 'object',
      description: 'Initial position of the avatar',
      defaultValue: { x: 100, y: 100 },
    },
    label: {
      control: 'text',
      description: 'Label to display above the avatar',
      defaultValue: 'Chat with me',
    },
    popoverMessage: {
      control: 'text',
      description: 'Message to display in the popover when clicked',
      defaultValue: 'How can we help you today?',
    },
    showPopover: {
      control: 'boolean',
      description: 'Whether to show the popover when clicked',
      defaultValue: true,
    },
    useChatWindow: {
      control: 'boolean',
      description:
        'Whether to use the enhanced chat window instead of a simple popover',
      defaultValue: false,
    },
    agentName: {
      control: 'text',
      description: 'Optional agent name for the chat window',
      defaultValue: 'Support Agent',
    },
    userName: {
      control: 'text',
      description: 'Optional user name for the chat window',
      defaultValue: 'You',
    },
    initialMessages: {
      control: 'object',
      description: 'Optional initial messages for the chat window',
    },
    onSendMessage: {
      action: 'message sent',
      description: 'Callback when a message is sent',
    },
  },
  parameters: {
    layout: 'fullscreen',
    // Disable default docs page since this component renders globally
    docs: {
      story: {
        inline: false,
      },
      description: {
        component:
          'This component renders at the document.body level and can be dragged across the entire Storybook interface, including sidebar, toolbar, and panels.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Helper component to render the global avatar only when the story is active
const GlobalAvatarRenderer = (
  props: React.ComponentProps<typeof GlobalDraggableAvatar>
) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  if (!isActive) {
    return null;
  }
  return <GlobalDraggableAvatar {...props} />;
};

/**
 * Default global draggable avatar with initials and chat label
 */
export const Default: Story = {
  render: (args) => <GlobalAvatarRenderer {...args} />,
  args: {
    initials: 'AB',
    size: 'md',
    bgColor: '#6366f1',
    textColor: '#ffffff',
    initialPosition: { x: 100, y: 100 },
    label: 'Chat with me',
    popoverMessage: 'How can we help you today?',
    showPopover: true,
  },
};

/**
 * Global draggable avatar with custom colors and custom label
 */
export const CustomColors: Story = {
  render: (args) => <GlobalAvatarRenderer {...args} />,
  args: {
    initials: 'ZY',
    size: 'lg',
    bgColor: '#ec4899',
    textColor: '#ffffff',
    initialPosition: { x: 200, y: 150 },
    label: 'Need help?',
    popoverMessage: 'Our team is ready to assist you!',
    showPopover: true,
  },
};

/**
 * Global draggable avatar with image
 */
export const WithImage: Story = {
  render: (args) => <GlobalAvatarRenderer {...args} />,
  args: {
    initials: 'JD',
    imageUrl: 'https://github.com/shadcn.png',
    size: 'xl',
    initialPosition: { x: 300, y: 200 },
    label: 'Chat with support',
    popoverMessage: 'How can our support team help you today?',
    showPopover: true,
  },
};

/**
 * Enhanced global draggable avatar with chat window functionality
 * This version uses the full chat interface instead of a simple popover
 */
export const WithChatWindow: Story = {
  render: (args) => <GlobalAvatarRenderer {...args} />,
  args: {
    initials: 'CS',
    size: 'lg',
    bgColor: '#0ea5e9',
    textColor: '#ffffff',
    initialPosition: { x: 100, y: 100 },
    label: 'Chat Support',
    useChatWindow: true,
    agentName: 'Support Agent',
    userName: 'You',
    initialMessages: [
      {
        id: 'msg-1',
        content: 'Welcome to our support chat! How can I help you today?',
        sender: 'agent',
        timestamp: new Date(),
      },
    ],
  },
};

/**
 * Multiple global draggable avatars with different labels and popover messages
 * Note: This will render multiple avatars that can all be dragged independently
 * The last avatar has showPopover set to false to demonstrate the non-popover version
 */
export const MultipleAvatars: Story = {
  render: () => (
    <>
      <GlobalAvatarRenderer
        initials="AB"
        size="sm"
        bgColor="#ec4899"
        textColor="#ffffff"
        initialPosition={{ x: 100, y: 100 }}
        label="Sales"
        popoverMessage="Need help with pricing or plans?"
      />
      <GlobalAvatarRenderer
        initials="CD"
        size="md"
        bgColor="#8b5cf6"
        textColor="#ffffff"
        initialPosition={{ x: 200, y: 100 }}
        label="Support"
        popoverMessage="Technical issues? We're here to help!"
      />
      <GlobalAvatarRenderer
        initials="EF"
        size="lg"
        bgColor="#06b6d4"
        textColor="#ffffff"
        initialPosition={{ x: 300, y: 100 }}
        label="Billing"
        popoverMessage="Questions about your subscription?"
      />
      <GlobalAvatarRenderer
        initials="GH"
        size="xl"
        bgColor="#10b981"
        textColor="#ffffff"
        initialPosition={{ x: 200, y: 200 }}
        label="Chat with me"
        popoverMessage="How can we help you today?"
        showPopover={false}
      />
    </>
  ),
};

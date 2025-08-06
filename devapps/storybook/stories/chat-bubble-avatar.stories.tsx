/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';

import { GlobalDraggableAvatar } from '@repo/design-system/ui';

/**
 * A draggable avatar component with chat-bubble integration that can be freely positioned anywhere on the screen.
 */
const meta: Meta<typeof GlobalDraggableAvatar> = {
  title: 'ui/GlobalDraggableAvatar/ChatBubble',
  component: GlobalDraggableAvatar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A draggable avatar component with chat-bubble integration that can be freely positioned anywhere on the screen.',
      },
    },
  },
  argTypes: {
    initials: {
      control: 'text',
      description: 'Initials to display when no image is available',
    },
    imageUrl: {
      control: 'text',
      description: 'URL for the avatar image',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
      description: 'Size of the avatar',
    },
    bgColor: {
      control: 'color',
      description: 'Background color for the avatar',
    },
    textColor: {
      control: 'color',
      description: 'Text color for the avatar initials',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for the avatar',
    },
    initialPosition: {
      control: 'object',
      description: 'Initial position of the avatar',
    },
    label: {
      control: 'text',
      description: 'Label to display above the avatar',
    },
    useChatBubble: {
      control: 'boolean',
      description: 'Whether to use the chat-bubble interface',
    },
    agentName: {
      control: 'text',
      description: 'Name of the agent in the chat',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default avatar with chat-bubble interface
 */
export const WithChatBubble: Story = {
  args: {
    initials: 'CB',
    size: 'lg',
    bgColor: '#0ea5e9',
    textColor: '#ffffff',
    initialPosition: { x: 100, y: 100 },
    label: 'Chat with me',
    useChatBubble: true,
    agentName: 'Chat Bubble Agent',
    initialMessages: [
      {
        id: 'msg-1',
        content: 'Welcome to our chat! How can I help you today?',
        sender: 'agent',
        timestamp: new Date(),
      },
    ],
  },
};

/**
 * Chat balloon anchored to avatar - demonstrates real-time position linking
 */
export const AnchoredChatBalloon: Story = {
  render: () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div>Loading...</div>;
    }

    return (
      <div className="p-4">
        <h1 className="mb-4 font-bold text-2xl">
          Chat Balloon Anchored to Avatar
        </h1>
        <p className="mb-8 text-muted-foreground">
          This example demonstrates how the chat balloon stays visually and
          positionally linked to the avatar. Try dragging the avatar around and
          notice how the chat balloon follows it in real-time.
        </p>

        <div className="mb-8 rounded-lg border bg-muted/30 p-4">
          <h2 className="mb-2 font-semibold">Instructions:</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Click on the avatar to open the chat balloon</li>
            <li>Drag the avatar around the screen</li>
            <li>Notice how the chat balloon follows the avatar in real-time</li>
            <li>
              Try both chat interfaces (bubble and window) to compare the
              behavior
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="mb-2 font-medium">Chat Bubble Interface</h3>
            <GlobalDraggableAvatar
              initials="CB"
              size="lg"
              bgColor="#0ea5e9"
              textColor="#ffffff"
              initialPosition={{ x: 100, y: 200 }}
              label="Chat Bubble"
              useChatBubble={true}
              agentName="Chat Agent"
              initialMessages={[
                {
                  id: 'msg-1',
                  content:
                    'This chat balloon is anchored to the avatar! Try dragging the avatar around.',
                  sender: 'agent',
                  timestamp: new Date(),
                },
              ]}
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium">Chat Window Interface</h3>
            <GlobalDraggableAvatar
              initials="CW"
              size="lg"
              bgColor="#10b981"
              textColor="#ffffff"
              initialPosition={{ x: 400, y: 200 }}
              label="Chat Window"
              useChatWindow={true}
              agentName="Chat Agent"
              initialMessages={[
                {
                  id: 'msg-1',
                  content:
                    'This chat window is anchored to the avatar! Try dragging the avatar around.',
                  sender: 'agent',
                  timestamp: new Date(),
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Multiple avatars with different chat interfaces
 */
export const MultipleAvatars: Story = {
  render: () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div>Loading...</div>;
    }

    return (
      <div className="p-4">
        <h1 className="mb-8 font-bold text-2xl">Multiple Chat Avatars Demo</h1>
        <p className="mb-8 text-muted-foreground">
          This example shows multiple avatars with different chat interfaces.
          Try clicking on each avatar to see the different chat experiences.
        </p>

        <GlobalDraggableAvatar
          initials="CB"
          size="lg"
          bgColor="#0ea5e9"
          textColor="#ffffff"
          initialPosition={{ x: 100, y: 200 }}
          label="Chat Bubble"
          useChatBubble={true}
          agentName="Chat Bubble Agent"
          initialMessages={[
            {
              id: 'msg-1',
              content: 'Welcome to the chat-bubble interface!',
              sender: 'agent',
              timestamp: new Date(),
            },
          ]}
        />

        <GlobalDraggableAvatar
          initials="CW"
          size="lg"
          bgColor="#10b981"
          textColor="#ffffff"
          initialPosition={{ x: 100, y: 400 }}
          label="Chat Window"
          useChatWindow={true}
          agentName="Chat Window Agent"
          initialMessages={[
            {
              id: 'msg-1',
              content: 'Welcome to the custom chat window interface!',
              sender: 'agent',
              timestamp: new Date(),
            },
          ]}
        />

        <GlobalDraggableAvatar
          initials="PO"
          size="lg"
          bgColor="#8b5cf6"
          textColor="#ffffff"
          initialPosition={{ x: 100, y: 600 }}
          label="Simple Popover"
          showPopover={true}
          popoverMessage="This is a simple popover message without chat functionality."
        />
      </div>
    );
  },
};

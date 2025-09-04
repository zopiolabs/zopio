/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';

import { Cursor } from '@repo/design-system/ui/cursor';

/**
 * A cursor component, great for realtime interactive applications.
 */
const meta: Meta<typeof Cursor> = {
  title: 'ui/Cursor',
  component: Cursor,
  tags: ['autodocs'],
  argTypes: {
    x: {
      control: { type: 'number' },
      description: 'X position of the cursor',
    },
    y: {
      control: { type: 'number' },
      description: 'Y position of the cursor',
    },
    color: {
      control: { type: 'color' },
      description: 'Color of the cursor',
    },
    name: {
      control: { type: 'text' },
      description: 'Name to display with the cursor',
    },
    message: {
      control: { type: 'text' },
      description: 'Message to display with the cursor',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default cursor with just the pointer.
 */
export const Default: Story = {
  args: {
    x: 100,
    y: 100,
    color: '#3b82f6',
  },
};

/**
 * A cursor with a name label.
 */
export const WithName: Story = {
  args: {
    x: 150,
    y: 150,
    color: '#10b981',
    name: 'John Doe',
  },
};

/**
 * A cursor with a message.
 */
export const WithMessage: Story = {
  args: {
    x: 200,
    y: 200,
    color: '#f59e0b',
    message: 'Looking at this section',
  },
};

/**
 * A cursor with both name and message.
 */
export const WithNameAndMessage: Story = {
  args: {
    x: 250,
    y: 250,
    color: '#ef4444',
    name: 'Jane Smith',
    message: 'Working on this feature',
  },
};

/**
 * A cursor with custom color.
 */
export const CustomColor: Story = {
  args: {
    x: 300,
    y: 300,
    color: '#8b5cf6',
    name: 'Designer',
    message: 'Reviewing design',
  },
};

/**
 * Interactive cursor that follows mouse movement.
 */
export const Interactive: Story = {
  render: () => {
    const [position, setPosition] = useState({ x: 200, y: 200 });

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        setPosition({ x: event.clientX, y: event.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
      <div className="h-screen w-full bg-gray-50 p-8">
        <div className="mb-4 text-gray-600 text-sm">
          Move your mouse to see the cursor follow
        </div>
        <Cursor
          x={position.x}
          y={position.y}
          color="#6366f1"
          name="You"
          message="Following your mouse"
        />
      </div>
    );
  },
};

/**
 * Multiple cursors showing collaboration.
 */
export const Collaboration: Story = {
  render: () => (
    <div className="h-screen w-full bg-gray-50 p-8">
      <div className="mb-4 text-gray-600 text-sm">
        Multiple users collaborating in real-time
      </div>
      <Cursor
        x={150}
        y={200}
        color="#3b82f6"
        name="Alice"
        message="Editing header"
      />
      <Cursor
        x={300}
        y={350}
        color="#10b981"
        name="Bob"
        message="Reviewing content"
      />
      <Cursor x={450} y={250} color="#f59e0b" name="Charlie" />
      <Cursor
        x={200}
        y={450}
        color="#ef4444"
        name="Diana"
        message="Adding comments"
      />
    </div>
  ),
};

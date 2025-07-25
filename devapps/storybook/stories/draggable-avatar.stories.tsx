/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { DraggableAvatar } from '@repo/design-system/ui/draggable-avatar';

/**
 * A draggable avatar component that can be freely moved around the screen.
 * This component allows for interactive positioning via mouse drag.
 */
const meta: Meta<typeof DraggableAvatar> = {
  title: 'ui/DraggableAvatar',
  component: DraggableAvatar,
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
    },
    textColor: {
      control: 'color',
      description: 'Text color for the avatar fallback',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative flex h-[500px] w-full items-center justify-center bg-slate-100 p-4 dark:bg-slate-800">
        <div className="absolute top-4 left-4 text-slate-500 text-sm dark:text-slate-400">
          Click and drag the avatar to move it around
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default draggable avatar with initials
 */
export const Default: Story = {
  args: {
    initials: 'AB',
    size: 'md',
    className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  },
};

/**
 * Draggable avatar with custom colors
 */
export const CustomColors: Story = {
  args: {
    initials: 'ZY',
    size: 'lg',
    bgColor: '#6366f1',
    textColor: '#ffffff',
    className: 'left-1/3 top-1/3',
  },
};

/**
 * Draggable avatar with image
 */
export const WithImage: Story = {
  args: {
    initials: 'JD',
    imageUrl: 'https://github.com/shadcn.png',
    size: 'xl',
    className: 'left-2/3 top-1/3',
  },
};

/**
 * Multiple draggable avatars in different sizes
 */
export const MultipleAvatars: Story = {
  render: () => (
    <>
      <DraggableAvatar
        initials="AB"
        size="sm"
        className="top-1/4 left-1/4"
        bgColor="#ec4899"
        textColor="#ffffff"
      />
      <DraggableAvatar
        initials="CD"
        size="md"
        className="top-1/4 left-2/4"
        bgColor="#8b5cf6"
        textColor="#ffffff"
      />
      <DraggableAvatar
        initials="EF"
        size="lg"
        className="top-1/4 left-3/4"
        bgColor="#06b6d4"
        textColor="#ffffff"
      />
      <DraggableAvatar
        initials="GH"
        size="xl"
        className="top-3/4 left-1/2"
        bgColor="#10b981"
        textColor="#ffffff"
      />
    </>
  ),
};

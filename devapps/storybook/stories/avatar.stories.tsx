/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/ui/avatar';

/**
 * An image element with a fallback for representing the user.
 */
const meta: Meta<typeof Avatar> = {
  title: 'ui/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the avatar.
 */
export const Default: Story = {};

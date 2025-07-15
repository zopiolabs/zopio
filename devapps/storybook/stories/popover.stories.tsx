/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/ui/popover';

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta: Meta<typeof Popover> = {
  title: 'ui/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {},

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {};

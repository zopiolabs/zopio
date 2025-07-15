/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/ui/hover-card';

/**
 * For sighted users to preview content available behind a link.
 */
const meta: Meta<typeof HoverCard> = {
  title: 'ui/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        The React Framework - created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the hover card.
 */
export const Default: Story = {};

/**
 * Use the `openDelay` and `closeDelay` props to control the delay before the
 * hover card opens and closes.
 */
export const Instant: Story = {
  args: {
    openDelay: 0,
    closeDelay: 0,
  },
};

/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Label } from '@repo/design-system/ui/label';

/**
 * Renders an accessible label associated with controls.
 */
const meta: Meta<typeof Label> = {
  title: 'ui/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
  args: {
    children: 'Your email address',
    htmlFor: 'email',
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

/**
 * The default form of the label.
 */
export const Default: Story = {};

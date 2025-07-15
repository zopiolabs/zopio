/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@repo/design-system/ui/input-otp';

/**
 * Accessible one-time password component with copy paste functionality.
 */
const meta: Meta<typeof InputOTP> = {
  title: 'ui/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    maxLength: 6,
    pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
    children: null,
  },

  render: (args) => (
    <InputOTP {...args} maxLength={4} render={undefined}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<{ maxLength: number }>;

/**
 * The default form of the InputOTP field.
 */
export const Default: Story = { args: { maxLength: 4 } };

/**
 * Use multiple groups to separate the input slots.
 */
export const SeparatedGroup: Story = {
  render: (args) => (
    <InputOTP {...args} maxLength={4} render={undefined}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

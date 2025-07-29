/**
 * SPDX-License-Identifier: MIT
 */

import { FloatingLabelInput } from '@repo/design-system/ui/floating-label-input';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof FloatingLabelInput> = {
  title: 'UI/FloatingLabelInput',
  component: FloatingLabelInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FloatingLabelInput>;

export const Default: Story = {
  args: {
    id: 'floating-demo',
    label: 'Floating Label',
  },
};

export const WithPlaceholder: Story = {
  args: {
    id: 'floating-placeholder',
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
};

export const Required: Story = {
  args: {
    id: 'floating-required',
    label: 'Username',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'floating-disabled',
    label: 'Disabled Input',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const WithDefaultValue: Story = {
  args: {
    id: 'floating-default-value',
    label: 'Full Name',
    defaultValue: 'John Doe',
  },
};

export const WithCustomWidth: Story = {
  args: {
    id: 'floating-custom-width',
    label: 'Custom Width',
    className: 'w-[300px]',
  },
};

export const WithType: Story = {
  args: {
    id: 'floating-type',
    label: 'Password',
    type: 'password',
  },
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <FloatingLabelInput
          id="floating-error"
          label="Email Address"
          className="border-red-500 focus-visible:ring-red-500"
        />
        <p className="mt-1 text-red-500 text-sm">
          Please enter a valid email address
        </p>
      </div>
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
      <FloatingLabelInput id="name" label="Full Name" />
      <FloatingLabelInput id="email" label="Email Address" type="email" />
      <FloatingLabelInput id="phone" label="Phone Number" type="tel" />
      <FloatingLabelInput id="website" label="Website" type="url" />
      <FloatingLabelInput
        id="password"
        label="Password"
        type="password"
        className="col-span-1 md:col-span-2"
      />
    </div>
  ),
};

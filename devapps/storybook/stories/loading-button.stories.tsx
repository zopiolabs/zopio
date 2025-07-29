/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Mail } from 'lucide-react';
import Link from 'next/link';

import { LoadingButton } from '@repo/design-system/ui/loading-button';

/**
 * A button component with built-in loading state that displays a spinner when loading.
 */
const meta: Meta<typeof LoadingButton> = {
  title: 'ui/LoadingButton',
  component: LoadingButton,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    loading: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default state of the loading button.
 */
export const Default: Story = {};

/**
 * The loading state of the button, displaying a spinner.
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Different variants of the loading button.
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <LoadingButton {...args} variant="default" loading>
        Default
      </LoadingButton>
      <LoadingButton {...args} variant="destructive" loading>
        Destructive
      </LoadingButton>
      <LoadingButton {...args} variant="outline" loading>
        Outline
      </LoadingButton>
      <LoadingButton {...args} variant="secondary" loading>
        Secondary
      </LoadingButton>
      <LoadingButton {...args} variant="ghost" loading>
        Ghost
      </LoadingButton>
      <LoadingButton {...args} variant="link" loading>
        Link
      </LoadingButton>
    </div>
  ),
};

/**
 * Different sizes of the loading button.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <LoadingButton {...args} size="default" loading>
        Default
      </LoadingButton>
      <LoadingButton {...args} size="sm" loading>
        Small
      </LoadingButton>
      <LoadingButton {...args} size="lg" loading>
        Large
      </LoadingButton>
      <LoadingButton {...args} size="icon" loading>
        <Mail />
      </LoadingButton>
    </div>
  ),
};

/**
 * Using the asChild prop to render the button as a Link component.
 */
export const AsChild: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <LoadingButton {...args} asChild loading>
        <Link href="#">As Link</Link>
      </LoadingButton>
      <LoadingButton {...args} asChild variant="secondary" loading>
        <Link href="#">Secondary Link</Link>
      </LoadingButton>
      <LoadingButton {...args} asChild disabled>
        <p>As paragraph</p>
      </LoadingButton>
    </div>
  ),
};

/**
 * Disabled state of the loading button.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Loading button with an icon.
 */
export const WithIcon: Story = {
  render: (args) => (
    <LoadingButton {...args} loading={false}>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </LoadingButton>
  ),
};

/**
 * Loading button with an icon in loading state.
 */
export const WithIconLoading: Story = {
  render: (args) => (
    <LoadingButton {...args} loading>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </LoadingButton>
  ),
};

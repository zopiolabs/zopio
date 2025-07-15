/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { useToast } from '@repo/design-system/hooks/use-toast';
import {
  Toast,
  ToastAction,
  type ToastActionElement,
  type ToastProps,
} from '@repo/design-system/ui/toast';
import { Toaster } from '@repo/design-system/ui/toaster';

/**
 * A succinct message that is displayed temporarily.
 */
const meta: Meta<typeof Toast> = {
  title: 'ui/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    const { toast } = useToast();
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            toast(args);
          }}
        >
          Show Toast
        </button>
        <Toaster />
      </div>
    );
  },
};

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args: Omit<ToasterToast, 'id'>;
};

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

/**
 * The default form of the toast.
 */
export const Default: Story = {
  args: {
    description: 'Your message has been sent.',
  },
};

/**
 * Use the `title` prop to provide a title for the toast.
 */
export const WithTitle: Story = {
  args: {
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
  },
};

/**
 * Use the `action` prop to provide an action for the toast.
 */
export const WithAction: Story = {
  args: {
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
};

/**
 * Use the `destructive` variant to indicate a destructive action.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
};

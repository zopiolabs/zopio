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
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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

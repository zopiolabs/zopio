/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Save } from 'lucide-react';
import { useState } from 'react';

import { ActionButton } from '@repo/design-system/ui';
import { Card } from '@repo/design-system/ui';

/**
 * ActionButton extends the standard Button with loading state management.
 * It prevents multiple submissions and maintains consistent width during loading.
 */
const meta: Meta<typeof ActionButton> = {
  title: 'ui/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    isPending: {
      control: 'boolean',
    },
    maintainWidth: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Submit',
    isPending: false,
    maintainWidth: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default ActionButton with loading state.
 */
export const Default: Story = {};

/**
 * ActionButton in a pending/loading state.
 */
export const Loading: Story = {
  args: {
    isPending: true,
  },
};

/**
 * ActionButton with different variants.
 */
export const Variants: Story = {
  render: () => {
    const [isPending, setIsPending] = useState<Record<string, boolean>>({});

    function handleClick(id: string) {
      setIsPending((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setIsPending((prev) => ({ ...prev, [id]: false }));
      }, 1500);
    }

    return (
      <Card className="w-full max-w-3xl p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Default</span>
            <ActionButton
              onClick={() => handleClick('default')}
              isPending={isPending.default}
            >
              Submit
            </ActionButton>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Secondary</span>
            <ActionButton
              variant="secondary"
              onClick={() => handleClick('secondary')}
              isPending={isPending.secondary}
            >
              Save Changes
            </ActionButton>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Destructive</span>
            <ActionButton
              variant="destructive"
              onClick={() => handleClick('destructive')}
              isPending={isPending.destructive}
            >
              Delete
            </ActionButton>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Outline</span>
            <ActionButton
              variant="outline"
              onClick={() => handleClick('outline')}
              isPending={isPending.outline}
            >
              Export
            </ActionButton>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Ghost</span>
            <ActionButton
              variant="ghost"
              onClick={() => handleClick('ghost')}
              isPending={isPending.ghost}
            >
              Cancel
            </ActionButton>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Link</span>
            <ActionButton
              variant="link"
              onClick={() => handleClick('link')}
              isPending={isPending.link}
            >
              Learn More
            </ActionButton>
          </div>
        </div>
      </Card>
    );
  },
};

/**
 * ActionButton with a custom spinner size.
 */
export const CustomSpinnerSize: Story = {
  args: {
    isPending: true,
    className: '[--spinner-size:1.5rem]',
  },
};

/**
 * ActionButton with an icon.
 */
export const WithIcon: Story = {
  render: (args) => {
    const [isPending, setIsPending] = useState(false);

    const handleClick = () => {
      setIsPending(true);
      setTimeout(() => setIsPending(false), 1500);
    };

    return (
      <ActionButton {...args} onClick={handleClick} isPending={isPending}>
        <Save className="mr-2 h-4 w-4" /> Save Changes
      </ActionButton>
    );
  },
  args: {
    variant: 'secondary',
  },
};

/**
 * ActionButton with width maintenance disabled.
 */
export const WithoutWidthMaintenance: Story = {
  render: () => {
    const [isPending, setIsPending] = useState(false);

    const handleClick = () => {
      setIsPending(true);
      setTimeout(() => setIsPending(false), 1500);
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div>
          <span className="mb-2 block font-medium text-sm">
            With width maintenance (default)
          </span>
          <ActionButton
            onClick={handleClick}
            isPending={isPending}
            maintainWidth={true}
          >
            Submit Form
          </ActionButton>
        </div>
        <div>
          <span className="mb-2 block font-medium text-sm">
            Without width maintenance
          </span>
          <ActionButton
            onClick={handleClick}
            isPending={isPending}
            maintainWidth={false}
          >
            Submit Form
          </ActionButton>
        </div>
      </div>
    );
  },
};

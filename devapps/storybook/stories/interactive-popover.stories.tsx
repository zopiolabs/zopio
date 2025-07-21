/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  LucideCheck,
  LucideEdit,
  LucideMessageSquare,
  LucideTrash,
  LucideUser,
} from 'lucide-react';

import {
  InteractivePopoverContent,
  InteractivePopoverTrigger,
  PopoverBody,
  PopoverButton,
  PopoverCloseButton,
  PopoverFooter,
  PopoverForm,
  PopoverHeader,
  PopoverLabel,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
} from '@repo/design-system/ui';

/**
 * An enhanced popover component with animation, forms, and interactive elements.
 */
const meta: Meta<typeof PopoverRoot> = {
  title: 'ui/InteractivePopover',
  component: PopoverRoot,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default interactive popover with a simple content.
 */
export const Default: Story = {
  render: () => (
    <PopoverRoot>
      <InteractivePopoverTrigger>Open Popover</InteractivePopoverTrigger>
      <InteractivePopoverContent>
        <PopoverHeader>Interactive Popover</PopoverHeader>
        <PopoverBody>
          This is an enhanced popover with animations and interactive elements.
        </PopoverBody>
        <PopoverFooter>
          <PopoverCloseButton />
        </PopoverFooter>
      </InteractivePopoverContent>
    </PopoverRoot>
  ),
};

/**
 * A form-based popover for adding notes or comments.
 */
export const FormPopover: Story = {
  render: () => (
    <PopoverRoot>
      <InteractivePopoverTrigger>
        <LucideMessageSquare className="mr-2 h-4 w-4" />
        Add Comment
      </InteractivePopoverTrigger>
      <InteractivePopoverContent className="w-[320px]">
        <PopoverForm
          onSubmit={(_) => {
            // Handle note submission
            // In a real app, this would call an API or update state
          }}
        >
          <PopoverLabel>Add a comment</PopoverLabel>
          <div className="px-4 pb-4">
            <PopoverTextarea className="min-h-[100px]" />
          </div>
          <PopoverFooter>
            <PopoverCloseButton />
            <PopoverSubmitButton>
              <LucideCheck className="mr-2 h-4 w-4" />
              Save
            </PopoverSubmitButton>
          </PopoverFooter>
        </PopoverForm>
      </InteractivePopoverContent>
    </PopoverRoot>
  ),
};

/**
 * A popover with action buttons.
 */
export const ActionPopover: Story = {
  render: () => (
    <PopoverRoot>
      <InteractivePopoverTrigger variant="ghost">
        Actions
      </InteractivePopoverTrigger>
      <InteractivePopoverContent className="w-[200px]">
        <PopoverBody>
          <PopoverButton
            onClick={() => {
              // Handle edit action
            }}
          >
            <LucideEdit className="h-4 w-4" />
            Edit
          </PopoverButton>
          <PopoverButton
            onClick={() => {
              // Handle delete action
            }}
          >
            <LucideTrash className="h-4 w-4" />
            Delete
          </PopoverButton>
        </PopoverBody>
      </InteractivePopoverContent>
    </PopoverRoot>
  ),
};

/**
 * A popover with custom styling.
 */
export const CustomStyled: Story = {
  render: () => (
    <PopoverRoot>
      <InteractivePopoverTrigger variant="outline">
        User Profile
      </InteractivePopoverTrigger>
      <InteractivePopoverContent className="w-[280px] p-0">
        <div className="flex items-center gap-4 bg-primary/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <LucideUser className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium">John Doe</h3>
            <p className="text-muted-foreground text-sm">Product Designer</p>
          </div>
        </div>
        <PopoverBody className="py-3">
          <p className="text-muted-foreground text-sm">
            User profile information and settings can be accessed here.
          </p>
        </PopoverBody>
        <PopoverFooter>
          <PopoverCloseButton />
          <PopoverSubmitButton variant="secondary">
            View Profile
          </PopoverSubmitButton>
        </PopoverFooter>
      </InteractivePopoverContent>
    </PopoverRoot>
  ),
};

/**
 * Multiple popovers on a single page.
 */
export const MultiplePopovers: Story = {
  render: () => (
    <div className="flex gap-4">
      <PopoverRoot>
        <InteractivePopoverTrigger variant="default">
          Popover 1
        </InteractivePopoverTrigger>
        <InteractivePopoverContent>
          <PopoverHeader>First Popover</PopoverHeader>
          <PopoverBody>Content for the first popover.</PopoverBody>
          <PopoverFooter>
            <PopoverCloseButton />
          </PopoverFooter>
        </InteractivePopoverContent>
      </PopoverRoot>

      <PopoverRoot>
        <InteractivePopoverTrigger variant="secondary">
          Popover 2
        </InteractivePopoverTrigger>
        <InteractivePopoverContent>
          <PopoverHeader>Second Popover</PopoverHeader>
          <PopoverBody>Content for the second popover.</PopoverBody>
          <PopoverFooter>
            <PopoverCloseButton />
          </PopoverFooter>
        </InteractivePopoverContent>
      </PopoverRoot>

      <PopoverRoot>
        <InteractivePopoverTrigger variant="outline">
          Popover 3
        </InteractivePopoverTrigger>
        <InteractivePopoverContent>
          <PopoverHeader>Third Popover</PopoverHeader>
          <PopoverBody>Content for the third popover.</PopoverBody>
          <PopoverFooter>
            <PopoverCloseButton />
          </PopoverFooter>
        </InteractivePopoverContent>
      </PopoverRoot>
    </div>
  ),
};

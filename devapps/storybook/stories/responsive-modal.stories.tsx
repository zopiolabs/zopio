/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@repo/design-system/ui/button';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from '@repo/design-system/ui/responsive-modal';

/**
 * A responsive modal component that adapts to different screen sizes.
 * On mobile, it slides in from the specified side (top, bottom, left, right).
 * On desktop, it appears as a centered modal dialog.
 */
const meta: Meta<typeof ResponsiveModalContent> = {
  title: 'ui/ResponsiveModal',
  component: ResponsiveModalContent,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The side from which the modal slides in on mobile devices',
      defaultValue: 'bottom',
    },
    className: {
      control: 'text',
      description: 'Additional className for the modal content',
    },
  },
  args: {
    side: 'bottom',
  },
  decorators: [
    (Story) => (
      <ResponsiveModal>
        <ResponsiveModalTrigger asChild>
          <Button variant="outline">Open Modal</Button>
        </ResponsiveModalTrigger>
        <Story />
      </ResponsiveModal>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default responsive modal that slides in from the bottom on mobile.
 */
export const Default: Story = {
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>Are you absolutely sure?</ResponsiveModalTitle>
        <ResponsiveModalDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="flex justify-end space-x-2 pt-6">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </ResponsiveModalContent>
  ),
};

/**
 * A responsive modal that slides in from the top on mobile.
 */
export const TopModal: Story = {
  args: {
    side: 'top',
  },
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>Notification</ResponsiveModalTitle>
        <ResponsiveModalDescription>
          You have a new message from the system administrator.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="flex justify-end pt-6">
        <Button>Acknowledge</Button>
      </div>
    </ResponsiveModalContent>
  ),
};

/**
 * A responsive modal that slides in from the left on mobile.
 */
export const LeftModal: Story = {
  args: {
    side: 'left',
  },
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>Navigation</ResponsiveModalTitle>
        <ResponsiveModalDescription>
          Quick access to important sections.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="py-4">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Profile
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Help
            </Button>
          </li>
        </ul>
      </div>
    </ResponsiveModalContent>
  ),
};

/**
 * A responsive modal that slides in from the right on mobile.
 */
export const RightModal: Story = {
  args: {
    side: 'right',
  },
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>User Settings</ResponsiveModalTitle>
        <ResponsiveModalDescription>
          Adjust your personal preferences.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Button variant="outline" size="sm">
            Toggle
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>
    </ResponsiveModalContent>
  ),
};

/**
 * A responsive modal with a footer section.
 */
export const WithFooter: Story = {
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>Terms of Service</ResponsiveModalTitle>
        <ResponsiveModalDescription>
          Please read our terms of service carefully before proceeding.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="py-4">
        <p className="text-muted-foreground text-sm">
          By clicking accept, you agree to our terms of service and privacy
          policy. These terms outline how we collect, use, and protect your data
          while using our services.
        </p>
      </div>
      <ResponsiveModalFooter>
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </ResponsiveModalFooter>
    </ResponsiveModalContent>
  ),
};

/**
 * A responsive modal with custom styling.
 */
export const CustomStyling: Story = {
  args: {
    className: 'border-primary',
  },
  render: (args) => (
    <ResponsiveModalContent {...args}>
      <ResponsiveModalHeader>
        <ResponsiveModalTitle className="text-primary">
          Custom Styled Modal
        </ResponsiveModalTitle>
        <ResponsiveModalDescription>
          This modal has custom styling applied to its components.
        </ResponsiveModalDescription>
      </ResponsiveModalHeader>
      <div className="border-t border-b py-4">
        <p className="text-sm italic">
          Content area with custom border styling.
        </p>
      </div>
      <div className="flex justify-end pt-4">
        <Button className="bg-primary hover:bg-primary/90">Close</Button>
      </div>
    </ResponsiveModalContent>
  ),
};

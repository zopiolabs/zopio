/**
 * SPDX-License-Identifier: MIT
 */

import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackHeader,
  DialogStackNext,
  DialogStackOverlay,
  DialogStackPrevious,
  DialogStackTitle,
  DialogStackTrigger,
} from '@repo/design-system/ui/dialog-stack';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

/**
 * Composable stacked dialogs, useful for creating a wizard, nested form or multi-step process.
 * It provides a consistent layout and styling for each dialog, and includes navigation components to move between them.
 */
const meta = {
  title: 'ui/DialogStack',
  component: DialogStack,
  tags: ['autodocs'],
  argTypes: {
    clickable: {
      control: 'boolean',
      description: 'Allow clicking on previous dialogs to navigate back',
      defaultValue: false,
    },
    open: {
      control: 'boolean',
      description: 'Control the open state of the dialog stack',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Set the default open state of the dialog stack',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof DialogStack>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default example with multiple dialogs stacked on top of each other.
 */
export const Default: Story = {
  render: (args) => (
    <DialogStack {...args}>
      <DialogStackTrigger>Open Dialog Stack</DialogStackTrigger>
      <DialogStackOverlay />
      <DialogStackBody>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 1: Personal Information</DialogStackTitle>
            <DialogStackDescription>
              Please provide your personal information to get started.
            </DialogStackDescription>
          </DialogStackHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium text-sm">
                  Full Name
                </label>
                <input
                  id="name"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="font-medium text-sm">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          <DialogStackFooter>
            <DialogStackNext className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Next
            </DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>

        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 2: Address</DialogStackTitle>
            <DialogStackDescription>
              Please provide your address details.
            </DialogStackDescription>
          </DialogStackHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="street" className="font-medium text-sm">
                  Street Address
                </label>
                <input
                  id="street"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="font-medium text-sm">
                    City
                  </label>
                  <input
                    id="city"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zip" className="font-medium text-sm">
                    Zip Code
                  </label>
                  <input
                    id="zip"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogStackFooter>
            <DialogStackPrevious className="text-muted-foreground hover:text-foreground">
              Previous
            </DialogStackPrevious>
            <DialogStackNext className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Next
            </DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>

        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 3: Review</DialogStackTitle>
            <DialogStackDescription>
              Please review your information before submitting.
            </DialogStackDescription>
          </DialogStackHeader>
          <div className="py-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                Thank you for providing your information. Please review and
                confirm that everything is correct before submitting.
              </p>
            </div>
          </div>
          <DialogStackFooter>
            <DialogStackPrevious className="text-muted-foreground hover:text-foreground">
              Previous
            </DialogStackPrevious>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              onClick={() => alert('Form submitted!')}
            >
              Submit
            </button>
          </DialogStackFooter>
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  ),
};

/**
 * Example with clickable navigation, allowing users to click on previous dialogs to navigate back.
 */
export const WithClickableNavigation: Story = {
  args: {
    clickable: true,
  },
  render: (args) => (
    <DialogStack {...args}>
      <DialogStackTrigger>Open Clickable Dialog Stack</DialogStackTrigger>
      <DialogStackOverlay />
      <DialogStackBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <DialogStackContent key={i}>
            <DialogStackHeader>
              <DialogStackTitle>Dialog {i + 1}</DialogStackTitle>
              <DialogStackDescription>
                {i === 0
                  ? 'This is the first dialog. You can navigate through the stack using the buttons below.'
                  : `This is dialog ${i + 1}. You can click on previous dialogs to navigate back.`}
              </DialogStackDescription>
            </DialogStackHeader>
            <div className="py-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">
                  {i === 5
                    ? 'This is the last dialog in the stack.'
                    : `Click "Next" to proceed to dialog ${i + 2}.`}
                </p>
              </div>
            </div>
            <DialogStackFooter>
              {i > 0 && (
                <DialogStackPrevious className="text-muted-foreground hover:text-foreground">
                  Previous
                </DialogStackPrevious>
              )}
              {i < 5 && (
                <DialogStackNext className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                  Next
                </DialogStackNext>
              )}
              {i === 5 && (
                <button
                  type="button"
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                  onClick={() => alert('Completed!')}
                >
                  Complete
                </button>
              )}
            </DialogStackFooter>
          </DialogStackContent>
        ))}
      </DialogStackBody>
    </DialogStack>
  ),
};

/**
 * Example with controlled state, where the open state is controlled externally.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Open Dialog Stack
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-input px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Close Dialog Stack
          </button>
        </div>
        <div className="text-muted-foreground text-sm">
          Current state:{' '}
          <span className="font-medium">{open ? 'Open' : 'Closed'}</span>
        </div>

        <DialogStack open={open} onOpenChange={setOpen}>
          <DialogStackOverlay />
          <DialogStackBody>
            <DialogStackContent>
              <DialogStackHeader>
                <DialogStackTitle>Controlled Dialog</DialogStackTitle>
                <DialogStackDescription>
                  This dialog's open state is controlled externally.
                </DialogStackDescription>
              </DialogStackHeader>
              <div className="py-4">
                <p className="text-sm">
                  You can control this dialog using the buttons outside of the
                  component.
                </p>
              </div>
              <DialogStackFooter>
                <button
                  type="button"
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </DialogStackFooter>
            </DialogStackContent>
          </DialogStackBody>
        </DialogStack>
      </div>
    );
  },
};

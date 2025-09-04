/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { DateTimePicker } from '@repo/design-system/ui/datetime-picker';

/**
 * A date picker component with range and presets, built using a composition of the Popover and Calendar components.
 */
const meta: Meta<typeof DateTimePicker> = {
  title: 'ui/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    withInput: {
      control: 'boolean',
    },
    captionLayout: {
      control: 'select',
      options: ['buttons', 'dropdown'],
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    size: 'default',
    placeholder: 'Pick a date',
    disabled: false,
    withInput: false,
    captionLayout: 'buttons',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the date picker, used for selecting dates with a calendar popup.
 */
export const Default: Story = {};

/**
 * A date picker with a label for better accessibility and user guidance.
 */
export const WithLabel: Story = {
  args: {
    label: 'Select Date',
  },
};

/**
 * A date picker with an input field that allows manual date entry alongside calendar selection.
 */
export const WithInput: Story = {
  args: {
    label: 'Subscription Date',
    placeholder: 'June 01, 2025',
    withInput: true,
  },
};

/**
 * A date picker configured for date of birth selection with dropdown navigation.
 */
export const DateOfBirth: Story = {
  args: {
    label: 'Date of birth',
    placeholder: 'Select date',
    captionLayout: 'dropdown',
  },
};

/**
 * A compact variant of the date picker with reduced spacing.
 */
export const Compact: Story = {
  args: {
    label: 'Event Date',
    variant: 'compact',
  },
};

/**
 * A small-sized date picker suitable for compact interfaces.
 */
export const Small: Story = {
  args: {
    label: 'Due Date',
    size: 'sm',
  },
};

/**
 * A large-sized date picker for better visibility and easier interaction.
 */
export const Large: Story = {
  args: {
    label: 'Meeting Date',
    size: 'lg',
  },
};

/**
 * A disabled date picker that prevents user interaction.
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Date',
    disabled: true,
  },
};

/**
 * A controlled date picker example showing how to manage state externally.
 */
export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <DateTimePicker {...args} value={date} onValueChange={setDate} />
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Controlled Date Picker',
  },
};

/**
 * A date picker with input field and dropdown navigation for enhanced usability.
 */
export const AdvancedInput: Story = {
  args: {
    label: 'Advanced Date Input',
    placeholder: 'Enter or select date',
    withInput: true,
    captionLayout: 'dropdown',
  },
};

/**
 * Multiple date pickers showcasing different configurations side by side.
 */
export const Showcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
      <DateTimePicker label="Basic Date Picker" placeholder="Pick a date" />
      <DateTimePicker
        label="With Input Field"
        placeholder="Type or select"
        withInput={true}
      />
      <DateTimePicker
        label="Date of Birth"
        placeholder="Select your birth date"
        captionLayout="dropdown"
      />
      <DateTimePicker label="Compact Variant" variant="compact" size="sm" />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

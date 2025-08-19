/**
 * SPDX-License-Identifier: MIT
 */

import { Calendar } from '@repo/design-system/ui/calendar';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Calendar> = {
  title: 'ui/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedDate: {
      control: 'date',
      description: 'The currently selected date',
    },
    onDateSelect: {
      action: 'date-selected',
      description: 'Callback fired when a date is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default calendar
export const Default: Story = {
  args: {},
};

// Calendar with selected date
export const WithSelectedDate: Story = {
  args: {
    selectedDate: new Date(2025, 7, 19), // August 19, 2025
  },
};

// Calendar with today's date selected
export const WithTodaySelected: Story = {
  args: {
    selectedDate: new Date(),
  },
};

// Calendar showing different month (January 2025)
export const DifferentMonth: Story = {
  args: {
    selectedDate: new Date(2025, 0, 15), // January 15, 2025
  },
};

// Calendar showing December (to show year transition)
export const DecemberMonth: Story = {
  args: {
    selectedDate: new Date(2024, 11, 25), // December 25, 2024
  },
};

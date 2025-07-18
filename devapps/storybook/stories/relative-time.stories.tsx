/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from '@repo/design-system/ui/relative-time';

/**
 * A component for displaying time across different time zones.
 */
const meta: Meta<typeof RelativeTime> = {
  title: 'ui/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  argTypes: {
    time: {
      control: 'date',
      description: 'The current time to display',
    },
    defaultTime: {
      control: 'date',
      description: 'The default time to display if time is not provided',
    },
    dateFormatOptions: {
      control: 'object',
      description: 'Options for date formatting',
    },
    timeFormatOptions: {
      control: 'object',
      description: 'Options for time formatting',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default usage of the RelativeTime component showing multiple time zones.
 */
export const Default: Story = {
  render: (args) => (
    <RelativeTime {...args} className="w-[300px]">
      <RelativeTimeZone zone="America/Los_Angeles">
        <RelativeTimeZoneLabel>PST</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>

      <RelativeTimeZone zone="America/New_York">
        <RelativeTimeZoneLabel>EST</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>

      <RelativeTimeZone zone="Europe/London">
        <RelativeTimeZoneLabel>GMT</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>

      <RelativeTimeZone zone="Asia/Tokyo">
        <RelativeTimeZoneLabel>JST</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
    </RelativeTime>
  ),
};

/**
 * Shows both date and time for a specific time zone.
 */
export const WithDate: Story = {
  render: (args) => (
    <RelativeTime {...args} className="w-[300px]">
      <RelativeTimeZone zone="UTC">
        <div className="flex flex-col gap-1">
          <RelativeTimeZoneLabel>UTC</RelativeTimeZoneLabel>
          <RelativeTimeZoneDate />
        </div>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
    </RelativeTime>
  ),
};

/**
 * Example with custom date and time format options.
 */
export const CustomFormat: Story = {
  render: (args) => (
    <RelativeTime
      {...args}
      className="w-[300px]"
      dateFormatOptions={{
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }}
      timeFormatOptions={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }}
    >
      <RelativeTimeZone zone="Europe/Paris">
        <div className="flex flex-col gap-1">
          <RelativeTimeZoneLabel>Paris</RelativeTimeZoneLabel>
          <RelativeTimeZoneDate />
        </div>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
    </RelativeTime>
  ),
};

/**
 * Example with static time (non-updating).
 */
export const StaticTime: Story = {
  render: (args) => (
    <RelativeTime
      {...args}
      className="w-[300px]"
      time={new Date('2025-01-01T12:00:00Z')}
    >
      <RelativeTimeZone zone="UTC">
        <RelativeTimeZoneLabel>UTC</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>

      <RelativeTimeZone zone="Asia/Dubai">
        <RelativeTimeZoneLabel>GST</RelativeTimeZoneLabel>
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
    </RelativeTime>
  ),
};

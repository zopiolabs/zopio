/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  RelativeTime,
  TimeZoneDisplay,
} from '@repo/design-system/ui/relative-time';

/**
 * A component that displays time in various formats and timezones.
 */
const meta: Meta<typeof RelativeTime> = {
  title: 'ui/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'muted', 'secondary'],
      description: 'Visual variant of the time display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the time display',
    },
    format: {
      control: { type: 'select' },
      options: ['relative', 'absolute', 'both'],
      description: 'Time display format',
    },
    updateInterval: {
      control: { type: 'number' },
      description: 'Update interval in milliseconds',
    },
    showTooltip: {
      control: { type: 'boolean' },
      description: 'Show tooltip with additional time info',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default relative time display.
 */
export const Default: Story = {
  args: {
    date: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
};

/**
 * Different time formats.
 */
export const Formats: Story = {
  render: () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

    return (
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium text-sm">Relative Format</h4>
          <RelativeTime date={pastDate} format="relative" />
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Absolute Format</h4>
          <RelativeTime date={pastDate} format="absolute" />
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Both Formats</h4>
          <RelativeTime date={pastDate} format="both" />
        </div>
      </div>
    );
  },
};

/**
 * Different variants and sizes.
 */
export const VariantsAndSizes: Story = {
  render: () => {
    const date = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-2 font-medium text-sm">Variants</h4>
          <div className="space-y-2">
            <RelativeTime date={date} variant="default" />
            <RelativeTime date={date} variant="muted" />
            <RelativeTime date={date} variant="secondary" />
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Sizes</h4>
          <div className="space-y-2">
            <RelativeTime date={date} size="sm" />
            <RelativeTime date={date} size="md" />
            <RelativeTime date={date} size="lg" />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Various time ranges.
 */
export const TimeRanges: Story = {
  render: () => {
    const now = new Date();
    const times = [
      { label: 'Just now', date: new Date(now.getTime() - 10 * 1000) },
      { label: '5 minutes ago', date: new Date(now.getTime() - 5 * 60 * 1000) },
      {
        label: '2 hours ago',
        date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        label: 'Yesterday',
        date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        label: '3 days ago',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        label: '1 week ago',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        label: '1 month ago',
        date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    ];

    return (
      <div className="space-y-3">
        {times.map((time, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{time.label}:</span>
            <RelativeTime date={time.date} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Future dates.
 */
export const FutureDates: Story = {
  render: () => {
    const now = new Date();
    const futureTimes = [
      { label: 'In 5 minutes', date: new Date(now.getTime() + 5 * 60 * 1000) },
      {
        label: 'In 2 hours',
        date: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        label: 'Tomorrow',
        date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      },
      {
        label: 'In 3 days',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        label: 'Next week',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    return (
      <div className="space-y-3">
        {futureTimes.map((time, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{time.label}:</span>
            <RelativeTime date={time.date} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Live updating relative time.
 */
export const LiveUpdating: Story = {
  render: () => {
    const [startTime] = useState(new Date());

    return (
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium text-sm">
            Live Timer (updates every second)
          </h4>
          <p className="mb-2 text-muted-foreground text-sm">
            Started at: {startTime.toLocaleTimeString()}
          </p>
          <RelativeTime
            date={startTime}
            updateInterval={1000}
            className="font-mono text-lg"
          />
        </div>
      </div>
    );
  },
};

/**
 * In context examples.
 */
export const InContext: Story = {
  render: () => {
    const posts = [
      {
        id: 1,
        title: 'New Product Launch',
        author: 'John Doe',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        title: 'Weekly Update',
        author: 'Jane Smith',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        title: 'Bug Fixes',
        author: 'Mike Johnson',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    return (
      <div className="w-full max-w-md space-y-4">
        <h3 className="font-semibold text-lg">Recent Posts</h3>
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <h4 className="font-medium">{post.title}</h4>
            <div className="mt-2 flex items-center justify-between text-muted-foreground text-sm">
              <span>by {post.author}</span>
              <RelativeTime date={post.date} variant="muted" size="sm" />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Timezone display component.
 */
export const TimezoneDisplay: Story = {
  render: () => {
    const timezones = [
      { label: 'New York', timezone: 'America/New_York' },
      { label: 'London', timezone: 'Europe/London' },
      { label: 'Tokyo', timezone: 'Asia/Tokyo' },
      { label: 'Sydney', timezone: 'Australia/Sydney' },
    ];

    return (
      <div className="w-full max-w-md">
        <h3 className="mb-4 font-semibold text-lg">World Clock</h3>
        <TimeZoneDisplay timezones={timezones} />
      </div>
    );
  },
};

/**
 * Controlled timezone display.
 */
export const ControlledTimezone: Story = {
  render: () => {
    const [controlledTime, setControlledTime] = useState(new Date());

    const timezones = [
      { label: 'Los Angeles', timezone: 'America/Los_Angeles' },
      { label: 'Chicago', timezone: 'America/Chicago' },
      { label: 'New York', timezone: 'America/New_York' },
    ];

    const addHour = () => {
      setControlledTime(new Date(controlledTime.getTime() + 60 * 60 * 1000));
    };

    const subtractHour = () => {
      setControlledTime(new Date(controlledTime.getTime() - 60 * 60 * 1000));
    };

    const resetTime = () => {
      setControlledTime(new Date());
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Button onClick={subtractHour} variant="outline" size="sm">
            -1 Hour
          </Button>
          <Button onClick={addHour} variant="outline" size="sm">
            +1 Hour
          </Button>
          <Button onClick={resetTime} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        <TimeZoneDisplay
          timezones={timezones}
          time={controlledTime}
          format="12h"
        />
      </div>
    );
  },
};

/**
 * Different time formats for timezone display.
 */
export const TimezoneFormats: Story = {
  render: () => {
    const timezones = [
      { label: 'Berlin', timezone: 'Europe/Berlin' },
      { label: 'Mumbai', timezone: 'Asia/Kolkata' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-2 font-medium text-sm">24-hour format</h4>
          <TimeZoneDisplay timezones={timezones} format="24h" />
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">12-hour format</h4>
          <TimeZoneDisplay timezones={timezones} format="12h" />
        </div>
      </div>
    );
  },
};

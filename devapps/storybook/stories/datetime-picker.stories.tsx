/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { zhTW } from 'date-fns/locale';
import { useState } from 'react';

import { DateTimePicker } from '@repo/design-system/ui';

const meta: Meta<typeof DateTimePicker> = {
  title: 'UI/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DateTimePicker value={date} onChange={setDate} className="w-[280px]" />
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker value={date} onChange={setDate} className="w-[280px]" />
    );
  },
};

export const Hour12Format: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        hourCycle={12}
        className="w-[280px]"
      />
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        displayFormat={{
          hour24: 'yyyy/MM/dd HH:mm:ss',
          hour12: 'yyyy/MM/dd hh:mm:ss a',
        }}
        className="w-[280px]"
      />
    );
  },
};

export const CustomDefaultPopupValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    // Set default popup value to April 10, 2025 at 13:14:00
    const defaultPopupValue = new Date(2025, 3, 10, 13, 14, 0);

    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        defaultPopupValue={defaultPopupValue}
        className="w-[280px]"
      />
    );
  },
};

export const MinuteGranularity: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        granularity="minute"
        className="w-[280px]"
      />
    );
  },
};

export const HourGranularity: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        granularity="hour"
        className="w-[280px]"
      />
    );
  },
};

export const DayGranularity: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        granularity="day"
        className="w-[280px]"
      />
    );
  },
};

export const CustomYearRange: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        yearRange={10} // This year +/- 10 years
        className="w-[280px]"
      />
    );
  },
};

export const ChineseLocale: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        locale={zhTW}
        className="w-[280px]"
      />
    );
  },
};

export const WeekStartsOnMonday: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        weekStartsOn={1} // 0 = Sunday, 1 = Monday
        className="w-[280px]"
      />
    );
  },
};

export const ShowWeekNumber: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        showWeekNumber
        className="w-[280px]"
      />
    );
  },
};

export const HideOutsideDays: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        showOutsideDays={false}
        className="w-[280px]"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        disabled
        className="w-[280px]"
      />
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DateTimePicker
        value={date}
        onChange={setDate}
        placeholder="Select date and time"
        className="w-[280px]"
      />
    );
  },
};

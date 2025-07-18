/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui/button';
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@repo/design-system/ui/mini-calendar';
import type { Meta, StoryObj } from '@storybook/react';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof MiniCalendar> = {
  title: 'ui/MiniCalendar',
  component: MiniCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MiniCalendar>;

/**
 * Basic usage of the MiniCalendar component with default settings.
 */
export const Basic: Story = {
  render: () => (
    <MiniCalendar>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>
        {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  ),
};

/**
 * Controlled example where the selected date and start date are managed externally.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [startDate, setStartDate] = useState<Date>(new Date());

    return (
      <div className="flex flex-col gap-4">
        <MiniCalendar
          value={selectedDate}
          onValueChange={setSelectedDate}
          startDate={startDate}
          onStartDateChange={(date) => date && setStartDate(date)}
        >
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays>
            {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>

        <div className="text-sm">
          {selectedDate ? (
            <p>Selected date: {format(selectedDate, 'PPP')}</p>
          ) : (
            <p>No date selected</p>
          )}
          <p>Start date: {format(startDate, 'PPP')}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedDate(undefined)}
            size="sm"
          >
            Clear selection
          </Button>
          <Button
            variant="outline"
            onClick={() => setStartDate(new Date())}
            size="sm"
          >
            Reset start date
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Custom layout example with different arrangement of components.
 */
export const CustomLayout: Story = {
  render: () => (
    <MiniCalendar className="flex-col items-start p-4">
      <div className="flex w-full items-center justify-between pb-2">
        <h3 className="font-medium text-sm">Select a date</h3>
        <div className="flex gap-1">
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarNavigation direction="next" />
        </div>
      </div>
      <MiniCalendarDays className="w-full justify-between">
        {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
      </MiniCalendarDays>
    </MiniCalendar>
  ),
};

/**
 * Example with custom days rendering and more days displayed.
 */
export const CustomDays: Story = {
  render: () => (
    <MiniCalendar days={7} className="p-4">
      <MiniCalendarNavigation direction="prev" className="rounded-full" asChild>
        <Button variant="outline" size="icon">
          <CalendarIcon className="size-4" />
        </Button>
      </MiniCalendarNavigation>
      <MiniCalendarDays>
        {(date) => {
          const isWeekend = [0, 6].includes(date.getDay());
          const isInFuture = date > new Date();
          let className = '';
          if (isWeekend) {
            className = 'bg-muted/50';
          } else if (isInFuture) {
            className = 'border border-primary/30 border-dashed';
          }

          return (
            <MiniCalendarDay
              key={date.toString()}
              date={date}
              className={className}
              disabled={addDays(new Date(), 3) < date}
            />
          );
        }}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  ),
};

/**
 * Example showing different number of days.
 */
export const DifferentDaysCount: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 font-medium text-sm">3 Days</h3>
        <MiniCalendar days={3}>
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays>
            {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">7 Days (Week)</h3>
        <MiniCalendar days={7}>
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays>
            {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">10 Days</h3>
        <MiniCalendar days={10}>
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays className="overflow-x-auto pb-2">
            {(date) => <MiniCalendarDay key={date.toString()} date={date} />}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
      </div>
    </div>
  ),
};

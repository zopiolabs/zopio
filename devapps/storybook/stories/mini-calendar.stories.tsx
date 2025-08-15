/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import {
  MiniCalendar,
  MiniCalendarContent,
  MiniCalendarDays,
  MiniCalendarHeader,
  MiniCalendarNavigation,
  addDays,
  isSameDay,
  isToday,
  useMiniCalendar,
} from '@repo/design-system/ui/mini-calendar';

/**
 * A composable mini calendar component for picking dates close to today.
 */
const meta: Meta<typeof MiniCalendar> = {
  title: 'ui/Mini Calendar',
  component: MiniCalendar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the calendar',
    },
    numberOfDays: {
      control: { type: 'number', min: 3, max: 14, step: 1 },
      description: 'Number of days to display',
    },
    value: {
      control: { type: 'date' },
      description: 'Selected date (controlled)',
    },
    defaultValue: {
      control: { type: 'date' },
      description: 'Default selected date',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic mini calendar with default settings.
 */
export const Default: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
      <div className="w-fit">
        <MiniCalendar onValueChange={setSelectedDate}>
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>

        {selectedDate && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            Selected: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <MiniCalendar size="sm">
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <MiniCalendar size="md">
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <MiniCalendar size="lg">
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>
    </div>
  ),
};

/**
 * Different number of days.
 */
export const NumberOfDays: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">3 Days</h4>
        <MiniCalendar numberOfDays={3}>
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">5 Days (Default)</h4>
        <MiniCalendar numberOfDays={5}>
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">7 Days</h4>
        <MiniCalendar numberOfDays={7}>
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>
      </div>
    </div>
  ),
};

/**
 * Controlled calendar with external state.
 */
export const Controlled: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());

    const handleToday = () => {
      const today = new Date();
      setSelectedDate(today);
      setStartDate(today);
    };

    const handleTomorrow = () => {
      const tomorrow = addDays(new Date(), 1);
      setSelectedDate(tomorrow);
      setStartDate(tomorrow);
    };

    return (
      <div className="space-y-4">
        <MiniCalendar
          value={selectedDate}
          onValueChange={setSelectedDate}
          startDate={startDate}
          onStartDateChange={setStartDate}
        >
          <MiniCalendarNavigation />
          <MiniCalendarDays />
        </MiniCalendar>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleTomorrow}>
            Tomorrow
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(addDays(new Date(), 7))}
          >
            Next Week
          </Button>
        </div>

        <div className="rounded bg-muted p-3 text-sm">
          <div>
            <strong>Selected:</strong> {selectedDate.toLocaleDateString()}
          </div>
          <div>
            <strong>Start Date:</strong> {startDate.toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Custom layout with header and content.
 */
export const CustomLayout: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
      <div className="w-fit">
        <MiniCalendar onValueChange={setSelectedDate}>
          <MiniCalendarHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Quick Date Picker</span>
            </div>
            <MiniCalendarNavigation />
          </MiniCalendarHeader>

          <MiniCalendarContent>
            <MiniCalendarDays />
          </MiniCalendarContent>
        </MiniCalendar>

        {selectedDate && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            Selected:{' '}
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Custom day components.
 */
export const CustomDays: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    return (
      <div className="w-fit">
        <MiniCalendar onValueChange={setSelectedDate}>
          <MiniCalendarNavigation />
          <MiniCalendarDays>
            {/* Custom implementation of days */}
            <CustomDaysList />
          </MiniCalendarDays>
        </MiniCalendar>

        {selectedDate && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            Selected: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};

// Custom days list component for the CustomDays story
const CustomDaysList = () => {
  const { startDate, numberOfDays } = useMiniCalendar();

  const days: Date[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = addDays(startDate, i);
    days.push(date);
  }

  return (
    <>
      {days.map((date, index) => (
        <CustomDay key={`${date.toISOString()}-${index}`} date={date} />
      ))}
    </>
  );
};

// Custom day component with additional styling
const CustomDay = ({ date }: { date: Date }) => {
  const { selectedDate, onDateSelect } = useMiniCalendar();

  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isTodayDate = isToday(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const getDayClassName = () => {
    if (isSelected) {
      return 'bg-primary text-primary-foreground';
    }
    if (isTodayDate) {
      return 'bg-accent text-accent-foreground ring-2 ring-primary';
    }
    if (isWeekend) {
      return 'text-muted-foreground hover:bg-muted';
    }
    return 'hover:bg-accent hover:text-accent-foreground';
  };

  return (
    <button
      type="button"
      className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-md transition-colors ${getDayClassName()}`}
      onClick={() => onDateSelect?.(date)}
      aria-label={`Select ${date.toLocaleDateString()}`}
      aria-pressed={isSelected}
    >
      <div className="font-medium text-sm">{date.getDate()}</div>
      <div className="text-xs opacity-70">
        {date.toLocaleDateString('en-US', { weekday: 'short' })}
      </div>
      {isWeekend && (
        <div className="mt-0.5 h-1 w-1 rounded-full bg-current opacity-50" />
      )}
    </button>
  );
};

/**
 * Meeting scheduler example.
 */
export const MeetingScheduler: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>('');

    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    const handleSchedule = () => {
      if (selectedDate && selectedTime) {
        alert(
          `Meeting scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`
        );
      }
    };

    return (
      <div className="space-y-4">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Schedule Meeting</h3>
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Select Date</Label>
          <MiniCalendar numberOfDays={7} onValueChange={setSelectedDate}>
            <MiniCalendarNavigation />
            <MiniCalendarDays />
          </MiniCalendar>
        </div>

        {selectedDate && (
          <div>
            <Label className="mb-2 block font-medium text-sm">
              Select Time
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleSchedule}
          disabled={!selectedDate || !selectedTime}
          className="w-full"
        >
          Schedule Meeting
        </Button>

        {selectedDate && (
          <div className="rounded bg-muted p-3 text-sm">
            <div>
              <strong>Date:</strong> {selectedDate.toLocaleDateString()}
            </div>
            <div>
              <strong>Time:</strong> {selectedTime || 'Not selected'}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Event booking with location.
 */
export const EventBooking: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [location, setLocation] = useState<string>('');

    const locations = [
      'Conference Room A',
      'Conference Room B',
      'Meeting Room 1',
      'Virtual Meeting',
    ];

    return (
      <div className="space-y-4">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Book Event</h3>
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Event Date</Label>
          <MiniCalendar
            numberOfDays={6}
            size="lg"
            onValueChange={setSelectedDate}
          >
            <MiniCalendarNavigation />
            <MiniCalendarDays />
          </MiniCalendar>
        </div>

        {selectedDate && (
          <div>
            <Label className="mb-2 block font-medium text-sm">Location</Label>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => (
                <Button
                  key={loc}
                  variant={location === loc ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocation(loc)}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button disabled={!selectedDate || !location} className="w-full">
          Book Event
        </Button>

        {selectedDate && (
          <div className="rounded bg-muted p-3 text-sm">
            <div>
              <strong>Date:</strong>{' '}
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>
              <strong>Location:</strong> {location || 'Not selected'}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Using the mini calendar context hook.
 */
const CalendarInfo = () => {
  const { selectedDate, startDate, numberOfDays, size } = useMiniCalendar();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Selected:</span>
          <div>{selectedDate ? selectedDate.toLocaleDateString() : 'None'}</div>
        </div>
        <div>
          <span className="font-medium">Start Date:</span>
          <div>{startDate.toLocaleDateString()}</div>
        </div>
        <div>
          <span className="font-medium">Days:</span>
          <div>{numberOfDays}</div>
        </div>
        <div>
          <span className="font-medium">Size:</span>
          <div className="capitalize">{size}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <div className="w-fit">
      <MiniCalendar numberOfDays={7}>
        <MiniCalendarNavigation />
        <MiniCalendarDays />
        <CalendarInfo />
      </MiniCalendar>
    </div>
  ),
};

/**
 * Quick date selection.
 */
export const QuickSelection: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [startDate, setStartDate] = useState<Date>(new Date());

    const quickDates = [
      { label: 'Today', date: new Date() },
      { label: 'Tomorrow', date: addDays(new Date(), 1) },
      { label: 'Next Week', date: addDays(new Date(), 7) },
      { label: 'Next Month', date: addDays(new Date(), 30) },
    ];

    const handleQuickSelect = (date: Date) => {
      setSelectedDate(date);
      setStartDate(date);
    };

    return (
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">
            Quick Selection
          </Label>
          <div className="flex flex-wrap gap-2">
            {quickDates.map(({ label, date }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(date)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">
            Or Pick a Date
          </Label>
          <MiniCalendar
            value={selectedDate}
            onValueChange={setSelectedDate}
            startDate={startDate}
            onStartDateChange={setStartDate}
            numberOfDays={5}
          >
            <MiniCalendarNavigation />
            <MiniCalendarDays />
          </MiniCalendar>
        </div>

        {selectedDate && (
          <div className="rounded bg-muted p-3 text-sm">
            Selected:{' '}
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </div>
    );
  },
};

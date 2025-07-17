/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/react';
import { addDays, subDays } from 'date-fns';

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  type Feature,
  type Status,
} from '@repo/design-system/ui/calendar-view';
import { Glimpse } from '@repo/design-system/ui/glimpse';

/**
 * The calendar view displays features on a grid calendar.
 * It shows the end date of each feature and groups features by day.
 * When hovering over features, a glimpse appears with more details.
 */
const meta = {
  title: 'ui/CalendarView',
  component: CalendarProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CalendarProvider>;

export default meta;

// Define the Story type with proper annotations
type Story = StoryObj<typeof meta>;

// Sample statuses for our features
const statuses: Status[] = [
  { id: '1', name: 'To Do', color: '#F43F5E' },
  { id: '2', name: 'In Progress', color: '#3B82F6' },
  { id: '3', name: 'Done', color: '#10B981' },
  { id: '4', name: 'Blocked', color: '#F59E0B' },
];

// Sample features for our calendar
const generateFeatures = (): Feature[] => {
  const today = new Date();

  return [
    {
      id: '1',
      name: 'Design System Updates',
      startAt: subDays(today, 5),
      endAt: today,
      status: statuses[1],
      description:
        'Update the design system components to match the new brand guidelines.',
      imageUrl: 'https://picsum.photos/seed/1/300/200',
    },
    {
      id: '2',
      name: 'API Integration',
      startAt: subDays(today, 10),
      endAt: addDays(today, 2),
      status: statuses[0],
      description: 'Integrate with the new payment processing API.',
      imageUrl: 'https://picsum.photos/seed/1/300/200',
    },
    {
      id: '3',
      name: 'User Testing',
      startAt: addDays(today, 3),
      endAt: addDays(today, 5),
      status: statuses[0],
      description: 'Conduct user testing sessions with the prototype.',
      imageUrl: 'https://picsum.photos/seed/3/300/200',
    },
    {
      id: '4',
      name: 'Documentation',
      startAt: today,
      endAt: addDays(today, 3),
      status: statuses[1],
      description: 'Write documentation for the new features.',
      imageUrl: 'https://picsum.photos/seed/4/300/200',
    },
    {
      id: '5',
      name: 'Bug Fixes',
      startAt: subDays(today, 2),
      endAt: today,
      status: statuses[2],
      description: 'Fix critical bugs reported in the last release.',
      imageUrl: 'https://picsum.photos/seed/5/300/200',
    },
    {
      id: '6',
      name: 'Performance Optimization',
      startAt: addDays(today, 5),
      endAt: addDays(today, 8),
      status: statuses[0],
      description: 'Optimize application performance for mobile devices.',
      imageUrl: 'https://picsum.photos/seed/6/300/200',
    },
    {
      id: '7',
      name: 'Security Audit',
      startAt: addDays(today, 1),
      endAt: addDays(today, 4),
      status: statuses[3],
      description: 'Conduct a security audit of the application.',
      imageUrl: 'https://picsum.photos/seed/7/300/200',
    },
    {
      id: '8',
      name: 'Release v1.0',
      startAt: addDays(today, 10),
      endAt: addDays(today, 10),
      status: statuses[0],
      description: 'Release version 1.0 of the application.',
      imageUrl: 'https://picsum.photos/seed/8/300/200',
    },
    // Add more features on the same days to demonstrate the "+X more" functionality
    {
      id: '9',
      name: 'Team Meeting',
      startAt: today,
      endAt: today,
      status: statuses[2],
      description: 'Weekly team sync meeting.',
      imageUrl: 'https://picsum.photos/seed/9/300/200',
    },
    {
      id: '10',
      name: 'Client Demo',
      startAt: today,
      endAt: today,
      status: statuses[1],
      description: 'Demo the latest features to the client.',
      imageUrl: 'https://picsum.photos/seed/10/300/200',
    },
    {
      id: '11',
      name: 'Sprint Planning',
      startAt: today,
      endAt: today,
      status: statuses[2],
      description: 'Plan the next sprint.',
      imageUrl: 'https://picsum.photos/seed/11/300/200',
    },
    {
      id: '12',
      name: 'Code Review',
      startAt: addDays(today, 3),
      endAt: addDays(today, 3),
      status: statuses[1],
      description: 'Review pull requests for the new features.',
      imageUrl: 'https://picsum.photos/seed/12/300/200',
    },
  ];
};

/**
 * Default calendar view with date picker and glimpse functionality.
 * Hover over any feature to see more details.
 */
export const Default: Story = {
  args: {
    children: undefined, // This is a placeholder, actual children are provided in render function
  },
  render: () => {
    const features = generateFeatures();

    return (
      <CalendarProvider className="rounded-lg border">
        <CalendarDate>
          <div className="flex items-center gap-2">
            <CalendarMonthPicker />
            <CalendarYearPicker start={2020} end={2030} />
          </div>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }: { feature: Feature }) => (
            <Glimpse
              trigger={<CalendarItem feature={feature} />}
              title={feature.name}
              description={feature.description}
              indicatorColor={feature.status.color}
              metadata={`Due: ${feature.endAt.toLocaleDateString()}`}
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    );
  },
};

/**
 * Calendar view without the date picker, showing only the calendar grid.
 */
export const WithoutDatePicker: Story = {
  args: {
    children: undefined, // This is a placeholder, actual children are provided in render function
  },
  render: () => {
    const features = generateFeatures();

    return (
      <CalendarProvider className="rounded-lg border">
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }: { feature: Feature }) => (
            <Glimpse
              trigger={<CalendarItem feature={feature} />}
              title={feature.name}
              description={feature.description}
              indicatorColor={feature.status.color}
              metadata={`Due: ${feature.endAt.toLocaleDateString()}`}
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    );
  },
};

/**
 * Calendar with a different locale and start day.
 */
export const LocalizedCalendar: Story = {
  args: {
    locale: 'fr-FR',
    startDay: 1,
    children: undefined, // This is a placeholder, actual children are provided in render function
  },
  render: () => {
    const features = generateFeatures();

    return (
      <CalendarProvider
        locale="fr-FR"
        startDay={1}
        className="rounded-lg border"
      >
        <CalendarDate>
          <div className="flex items-center gap-2">
            <CalendarMonthPicker />
            <CalendarYearPicker start={2020} end={2030} />
          </div>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }: { feature: Feature }) => (
            <Glimpse
              trigger={<CalendarItem feature={feature} />}
              title={feature.name}
              description={feature.description}
              indicatorColor={feature.status.color}
              metadata={`Due: ${feature.endAt.toLocaleDateString('fr-FR')}`}
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    );
  },
};

/**
 * Calendar with custom styling for the glimpse component.
 */
export const CustomGlimpseStyle: Story = {
  args: {
    children: undefined, // This is a placeholder, actual children are provided in render function
  },
  render: () => {
    const features = generateFeatures();

    return (
      <CalendarProvider className="rounded-lg border">
        <CalendarDate>
          <div className="flex items-center gap-2">
            <CalendarMonthPicker />
            <CalendarYearPicker start={2020} end={2030} />
          </div>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }: { feature: Feature }) => (
            <Glimpse
              trigger={<CalendarItem feature={feature} />}
              title={feature.name}
              description={feature.description}
              indicatorColor={feature.status.color}
              metadata={`Due: ${feature.endAt.toLocaleDateString()}`}
              className="border-primary bg-primary text-primary-foreground"
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    );
  },
};

/**
 * Calendar with image previews in the glimpse component.
 */
export const GlimpseWithImages: Story = {
  args: {
    children: undefined, // This is a placeholder, actual children are provided in render function
  },
  render: () => {
    const features = generateFeatures();

    // Add sample image URLs to some features
    const featuresWithImages: Array<Feature & { imageUrl?: string }> =
      features.map((feature) => ({
        ...feature,
        imageUrl:
          feature.id === '1' || feature.id === '3' || feature.id === '5'
            ? `https://picsum.photos/seed/${feature.id}/300/200`
            : undefined,
      }));

    return (
      <CalendarProvider className="rounded-lg border">
        <CalendarDate>
          <div className="flex items-center gap-2">
            <CalendarMonthPicker />
            <CalendarYearPicker start={2020} end={2030} />
          </div>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={featuresWithImages}>
          {({ feature }: { feature: Feature }) => (
            <Glimpse
              trigger={<CalendarItem feature={feature} />}
              title={feature.name}
              description={feature.description}
              imageUrl={feature.imageUrl}
              indicatorColor={feature.status.color}
              metadata={`Due: ${feature.endAt.toLocaleDateString()}`}
            />
          )}
        </CalendarBody>
      </CalendarProvider>
    );
  },
};

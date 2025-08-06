/**
 * SPDX-License-Identifier: MIT
 */

import { Timeline, type TimelineItem } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Calendar, Code, Package, Truck } from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const orderItems: TimelineItem[] = [
  {
    date: '2025-07-15',
    title: 'Order Placed',
    description: 'Your order has been confirmed and is being processed',
    icon: <Package className="h-full w-full" />,
    href: '#order-placed',
  },
  {
    date: '2025-07-16',
    title: 'Processing',
    description: 'Your order is being prepared for shipment',
    icon: <Code className="h-full w-full" />,
    href: '#processing',
  },
  {
    date: '2025-07-18',
    title: 'Shipped',
    description: 'Your order has been shipped and is on the way',
    icon: <Truck className="h-full w-full" />,
    href: '#shipped',
  },
  {
    date: '2025-07-22',
    title: 'Delivered',
    description: 'Your order has been delivered to your address',
    icon: <Calendar className="h-full w-full" />,
    href: '#delivered',
  },
];

const blogItems: TimelineItem[] = [
  {
    date: '2025-07-01',
    title: 'New Design System Released',
    description: 'Our team has released a new version of the design system',
    href: '#design-system',
  },
  {
    date: '2025-06-15',
    title: 'Product Update',
    description: 'Major improvements to our core product offerings',
    href: '#product-update',
  },
  {
    date: '2025-05-22',
    title: 'Company Milestone',
    description: 'We reached 1 million users on our platform',
    href: '#milestone',
  },
  {
    date: '2025-04-10',
    title: 'New Office Opening',
    description: 'We opened our new headquarters in San Francisco',
    href: '#office',
  },
  {
    date: '2025-03-05',
    title: 'Funding Announcement',
    description: 'We secured Series B funding to accelerate growth',
    href: '#funding',
  },
  {
    date: '2025-02-18',
    title: 'New Partnership',
    description: 'Strategic partnership with leading industry player',
    href: '#partnership',
  },
  {
    date: '2025-01-30',
    title: 'Product Launch',
    description: 'Successfully launched our flagship product',
    href: '#launch',
  },
];

/**
 * Default timeline with icons and animation
 */
export const Default: Story = {
  args: {
    items: orderItems,
    initialCount: 3,
    showAnimation: true,
  },
};

/**
 * Timeline with custom date format
 */
export const CustomDateFormat: Story = {
  args: {
    items: orderItems,
    dateFormat: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  },
};

/**
 * Timeline with many items and "Show More" functionality
 */
export const WithShowMore: Story = {
  args: {
    items: blogItems,
    initialCount: 3,
    showMoreText: 'View More Events',
    showLessText: 'Show Less Events',
    buttonVariant: 'outline',
  },
};

/**
 * Timeline with custom styling
 */
export const CustomStyling: Story = {
  args: {
    items: orderItems,
    dotClassName: 'bg-blue-500 hover:bg-blue-600',
    lineClassName: 'border-blue-300',
    titleClassName: 'text-blue-800 dark:text-blue-300',
    descriptionClassName: 'text-blue-600 dark:text-blue-400',
    dateClassName: 'text-blue-500',
  },
};

/**
 * Timeline without animation
 */
export const NoAnimation: Story = {
  args: {
    items: orderItems.slice(0, 3),
    showAnimation: false,
  },
};

/**
 * Dark theme timeline
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    items: orderItems,
    className: 'bg-gray-950 p-8 rounded-xl',
  },
};

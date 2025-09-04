/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  type Contributor,
  ExpandableCard,
  type Task,
} from '@repo/design-system/ui/expandable-card';

/**
 * An interactive, expandable card component for displaying project status and details with smooth animations.
 */
const meta: Meta<typeof ExpandableCard> = {
  title: 'ui/ExpandableCard',
  component: ExpandableCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    progress: {
      control: 'number',
      min: 0,
      max: 100,
    },
    defaultExpanded: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    defaultExpanded: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleContributors: Contributor[] = [
  {
    name: 'Sarah',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Mike',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Alex',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Emma',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

const sampleTasks: Task[] = [
  { title: 'Update Button Components', completed: true },
  { title: 'Add Dark Mode Support', completed: true },
  { title: 'Implement Form Validation', completed: false },
  { title: 'Write Documentation', completed: false },
];

/**
 * Default expandable card with project status.
 */
export const Default: Story = {
  args: {
    title: 'UI Component Library',
    progress: 75,
    dueDate: '2024-02-15',
    contributors: sampleContributors,
    tasks: sampleTasks,
    githubStars: 128,
    openIssues: 5,
  },
};

/**
 * Card that starts expanded.
 */
export const Expanded: Story = {
  args: {
    title: 'Design System Project',
    progress: 60,
    dueDate: '2024-03-01',
    contributors: sampleContributors,
    tasks: sampleTasks,
    githubStars: 256,
    openIssues: 12,
    defaultExpanded: true,
  },
};

/**
 * High progress project near completion.
 */
export const HighProgress: Story = {
  args: {
    title: 'Mobile App Development',
    progress: 95,
    dueDate: '2024-01-30',
    contributors: sampleContributors.slice(0, 2),
    tasks: [
      { title: 'Core Features', completed: true },
      { title: 'UI Polish', completed: true },
      { title: 'Testing', completed: true },
      { title: 'App Store Submission', completed: false },
    ],
    githubStars: 89,
    openIssues: 2,
  },
};

/**
 * Low progress project in early stages.
 */
export const LowProgress: Story = {
  args: {
    title: 'New Product Research',
    progress: 25,
    dueDate: '2024-06-15',
    contributors: sampleContributors.slice(0, 3),
    tasks: [
      { title: 'Market Research', completed: true },
      { title: 'User Interviews', completed: false },
      { title: 'Prototype Development', completed: false },
      { title: 'Testing & Validation', completed: false },
    ],
    githubStars: 15,
    openIssues: 8,
  },
};

/**
 * Elevated card variant with enhanced shadow.
 */
export const Elevated: Story = {
  args: {
    title: 'Enterprise Dashboard',
    progress: 80,
    dueDate: '2024-02-28',
    contributors: sampleContributors,
    tasks: sampleTasks,
    githubStars: 342,
    openIssues: 7,
    variant: 'elevated',
  },
};

/**
 * Minimal card variant without shadow.
 */
export const Minimal: Story = {
  args: {
    title: 'Internal Tool',
    progress: 45,
    dueDate: '2024-04-10',
    contributors: sampleContributors.slice(0, 2),
    tasks: sampleTasks.slice(0, 3),
    variant: 'minimal',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    title: 'Major Platform Upgrade',
    progress: 65,
    dueDate: '2024-05-20',
    contributors: [...sampleContributors, { name: 'John' }, { name: 'Lisa' }],
    tasks: [
      ...sampleTasks,
      { title: 'Performance Optimization', completed: false },
      { title: 'Security Audit', completed: false },
    ],
    githubStars: 567,
    openIssues: 15,
    size: 'lg',
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    title: 'Quick Fix',
    progress: 90,
    dueDate: '2024-01-25',
    contributors: sampleContributors.slice(0, 1),
    tasks: sampleTasks.slice(0, 2),
    githubStars: 23,
    openIssues: 1,
    size: 'sm',
  },
};

/**
 * Card without GitHub stats.
 */
export const WithoutStats: Story = {
  args: {
    title: 'Internal Project',
    progress: 55,
    dueDate: '2024-03-15',
    contributors: sampleContributors.slice(0, 3),
    tasks: sampleTasks,
  },
};

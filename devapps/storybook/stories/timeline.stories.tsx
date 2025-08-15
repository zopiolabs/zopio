/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bug, Code, GitBranch, Rocket, Sparkles, Star } from 'lucide-react';

import { Timeline } from '@repo/design-system/ui/timeline';

/**
 * A responsive timeline component for displaying chronological events with expandable content.
 * Ideal for roadmaps, company history, or process flows with smooth animations and mobile-friendly design.
 */
const meta: Meta<typeof Timeline> = {
  title: 'ui/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal'],
    },
    initialCount: {
      control: 'number',
    },
    showMoreText: {
      control: 'text',
    },
    showLessText: {
      control: 'text',
    },
    buttonVariant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'link'],
    },
    buttonSize: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    animationDuration: {
      control: 'number',
    },
    animationDelay: {
      control: 'number',
    },
    showAnimation: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
    initialCount: 3,
    showMoreText: 'Show More',
    showLessText: 'Show Less',
    buttonVariant: 'ghost',
    buttonSize: 'sm',
    animationDuration: 0.3,
    animationDelay: 0.1,
    showAnimation: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    date: '2024-01-15',
    title: 'New Feature Release',
    description:
      'Added dark mode support with automatic theme detection and user preferences.',
    href: '/changelog/dark-mode',
    icon: <Sparkles className="h-3 w-3" />,
  },
  {
    date: '2024-01-10',
    title: 'Bug Fix',
    description:
      'Fixed mobile navigation issues and improved responsive design.',
    href: '/changelog/mobile-nav',
    icon: <Bug className="h-3 w-3" />,
  },
  {
    date: '2024-01-05',
    title: 'Performance Update',
    description:
      'Optimized bundle size and improved loading performance by 40%.',
    href: '/changelog/performance',
    icon: <Rocket className="h-3 w-3" />,
  },
  {
    date: '2024-01-01',
    title: 'Major Release',
    description:
      'Released version 2.0 with new component library and improved API.',
    href: '/changelog/v2',
    icon: <Star className="h-3 w-3" />,
  },
  {
    date: '2023-12-20',
    title: 'Code Refactor',
    description:
      'Refactored codebase for better maintainability and type safety.',
    href: '/changelog/refactor',
    icon: <Code className="h-3 w-3" />,
  },
  {
    date: '2023-12-15',
    title: 'Git Migration',
    description:
      'Migrated repository to new organization with improved CI/CD pipeline.',
    href: '/changelog/migration',
    icon: <GitBranch className="h-3 w-3" />,
  },
];

/**
 * The default timeline with icons and modern styling.
 */
export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

/**
 * Timeline with modern style featuring subtle gradients and hover effects.
 */
export const Modern: Story = {
  args: {
    items: defaultItems,
    dotClassName:
      'bg-gradient-to-b from-background to-muted ring-1 ring-border group-hover:ring-primary group-hover:bg-gradient-to-b group-hover:from-muted group-hover:to-muted/50 transition-all duration-300',
    lineClassName: 'border-l border-border',
    titleClassName:
      'font-medium text-foreground/90 group-hover:text-primary transition-colors duration-300',
    dateClassName:
      'text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300',
    descriptionClassName: 'text-muted-foreground/80',
    buttonVariant: 'outline',
    animationDuration: 0.4,
    animationDelay: 0.15,
  },
};

/**
 * Minimal timeline style without icons for a clean and simple design.
 */
export const Minimal: Story = {
  args: {
    items: defaultItems.map((item) => ({ ...item, icon: undefined })),
    variant: 'minimal',
    dotClassName: 'bg-muted ring-1 ring-border',
    lineClassName: 'border-l border-muted-foreground/20',
    titleClassName: 'font-medium text-foreground',
    dateClassName: 'text-muted-foreground text-xs',
    descriptionClassName: 'text-muted-foreground',
  },
};

/**
 * Timeline with custom initial count and button styling.
 */
export const CustomCount: Story = {
  args: {
    items: defaultItems,
    initialCount: 2,
    showMoreText: 'Load More Events',
    showLessText: 'Show Fewer',
    buttonVariant: 'outline',
    buttonSize: 'default',
  },
};

/**
 * Timeline without animations for reduced motion preferences.
 */
export const NoAnimation: Story = {
  args: {
    items: defaultItems,
    showAnimation: false,
    animationDuration: 0,
    animationDelay: 0,
  },
};

/**
 * Timeline with custom animation timing.
 */
export const CustomAnimation: Story = {
  args: {
    items: defaultItems,
    animationDuration: 0.6,
    animationDelay: 0.2,
    showAnimation: true,
  },
};

/**
 * Timeline without links for display-only content.
 */
export const WithoutLinks: Story = {
  args: {
    items: defaultItems.map((item) => ({ ...item, href: undefined })),
  },
};

/**
 * Compact timeline with small button size.
 */
export const Compact: Story = {
  args: {
    items: defaultItems,
    buttonSize: 'sm',
    buttonVariant: 'ghost',
    initialCount: 4,
  },
};

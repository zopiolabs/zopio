/**
 * SPDX-License-Identifier: MIT
 */

import {
  KanbanGantt,
  type Task,
} from '@repo/design-system/ui/kanban-gant/kanban-gantt';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof KanbanGantt> = {
  title: 'ui/KanbanGantt',
  component: KanbanGantt,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive project management component combining Kanban board functionality with Gantt chart visualization. Features drag-and-drop task management, calendar view, and detailed task editing capabilities.',
      },
    },
  },
  argTypes: {
    defaultViewMode: {
      control: { type: 'radio' },
      options: ['calendar'],
      description: 'Initial view mode for the component',
    },
    defaultSidebarOpen: {
      control: { type: 'boolean' },
      description: 'Whether the sidebar should be open by default',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanGantt>;

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    duration: '6 months',
    status: 'active',
    category: 'Frontend Development',
    description:
      'Create and implement a comprehensive design system for the product',
    startDate: new Date(2024, 3, 1),
    endDate: new Date(2024, 8, 30),
    assignee: 'Design Team',
    priority: 'high',
  },
  {
    id: '2',
    title: 'API Development',
    duration: '4 months',
    status: 'planned',
    category: 'Backend Development',
    description: 'Build RESTful APIs for the application',
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 7, 15),
    assignee: 'Backend Team',
    priority: 'high',
  },
  {
    id: '3',
    title: 'User Testing',
    duration: '2 months',
    status: 'review',
    category: 'Quality Assurance',
    description: 'Conduct comprehensive user testing and gather feedback',
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 7, 31),
    assignee: 'QA Team',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Documentation',
    duration: '3 months',
    status: 'todo',
    category: 'Documentation',
    description: 'Create technical and user documentation',
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 9, 30),
    assignee: 'Technical Writers',
    priority: 'low',
  },
];

const minimalTasks: Task[] = [
  {
    id: '1',
    title: 'Quick Task',
    duration: '1 week',
    status: 'active',
    category: 'Development',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

export const Default: Story = {
  args: {
    defaultViewMode: 'calendar',
    defaultSidebarOpen: true,
  },
};

export const ClosedSidebar: Story = {
  args: {
    defaultViewMode: 'calendar',
    defaultSidebarOpen: false,
  },
};

export const CustomTasks: Story = {
  args: {
    initialTasks: sampleTasks,
    defaultViewMode: 'calendar',
    defaultSidebarOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example with custom task data showing different project types and statuses.',
      },
    },
  },
};

export const MinimalSetup: Story = {
  args: {
    initialTasks: minimalTasks,
    defaultViewMode: 'calendar',
    defaultSidebarOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minimal setup with just one task to demonstrate the basic functionality.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    initialTasks: [],
    defaultViewMode: 'calendar',
    defaultSidebarOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing how the component looks with no tasks.',
      },
    },
  },
};

export const CompactView: Story = {
  args: {
    defaultViewMode: 'calendar',
    defaultSidebarOpen: false,
    className: 'max-w-4xl mx-auto',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact view suitable for smaller screens or embedded usage.',
      },
    },
  },
};

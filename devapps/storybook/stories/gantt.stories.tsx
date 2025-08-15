/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  Plus,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Gantt,
  GanttContent,
  GanttControls,
  GanttHeader,
  type GanttMarker,
  GanttMarkers,
  type GanttTask,
  GanttTimeline,
  getTodayMarker,
  useGantt,
} from '@repo/design-system/ui/gantt';

/**
 * A Gantt chart component for visualizing project schedules and tracking task progress with timeline management.
 */
const meta: Meta<typeof Gantt> = {
  title: 'ui/Gantt',
  component: Gantt,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    showSidebar: {
      control: { type: 'boolean' },
      description: 'Show task sidebar',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Read-only mode',
    },
    timeScale: {
      control: { type: 'select' },
      options: ['day', 'week', 'month'],
      description: 'Timeline scale',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample task data
const sampleTasks: GanttTask[] = [
  {
    id: '1',
    title: 'Project Planning',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-15'),
    progress: 100,
    color: '#10b981',
    group: 'Phase 1',
  },
  {
    id: '2',
    title: 'Design System',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-28'),
    progress: 75,
    color: '#3b82f6',
    group: 'Phase 1',
  },
  {
    id: '3',
    title: 'Frontend Development',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    progress: 45,
    color: '#f59e0b',
    group: 'Phase 2',
  },
  {
    id: '4',
    title: 'Backend Development',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-05-15'),
    progress: 30,
    color: '#ef4444',
    group: 'Phase 2',
  },
  {
    id: '5',
    title: 'Testing & QA',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-31'),
    progress: 0,
    color: '#8b5cf6',
    group: 'Phase 3',
  },
  {
    id: '6',
    title: 'Deployment',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-06-15'),
    progress: 0,
    color: '#06b6d4',
    group: 'Phase 3',
  },
];

const sampleMarkers: GanttMarker[] = [
  {
    id: 'milestone-1',
    date: new Date('2024-02-01'),
    label: 'Design Complete',
    color: '#10b981',
    type: 'milestone',
  },
  {
    id: 'milestone-2',
    date: new Date('2024-04-15'),
    label: 'MVP Ready',
    color: '#f59e0b',
    type: 'milestone',
  },
  {
    id: 'deadline',
    date: new Date('2024-06-30'),
    label: 'Launch Deadline',
    color: '#ef4444',
    type: 'deadline',
  },
  getTodayMarker(),
];

/**
 * Basic Gantt chart with default settings.
 */
export const Default: Story = {
  render: () => (
    <div className="h-96 w-full">
      <Gantt tasks={sampleTasks} markers={sampleMarkers}>
        <GanttTimeline />
        <div className="relative flex-1">
          <GanttContent />
          <GanttMarkers />
        </div>
      </Gantt>
    </div>
  ),
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <div className="h-64 w-full">
          <Gantt variant="default" tasks={sampleTasks.slice(0, 3)}>
            <GanttTimeline />
            <GanttContent />
          </Gantt>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <div className="h-64 w-full">
          <Gantt variant="ghost" tasks={sampleTasks.slice(0, 3)}>
            <GanttTimeline />
            <GanttContent />
          </Gantt>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <div className="h-64 w-full">
          <Gantt variant="outline" tasks={sampleTasks.slice(0, 3)}>
            <GanttTimeline />
            <GanttContent />
          </Gantt>
        </div>
      </div>
    </div>
  ),
};

/**
 * Different time scales.
 */
export const TimeScales: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Monthly View</h4>
        <div className="h-48 w-full">
          <Gantt tasks={sampleTasks.slice(0, 3)} timeScale="month">
            <GanttTimeline />
            <GanttContent />
          </Gantt>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Weekly View</h4>
        <div className="h-48 w-full">
          <Gantt
            tasks={sampleTasks.slice(0, 2)}
            timeScale="week"
            viewStart={new Date('2024-01-01')}
            viewEnd={new Date('2024-03-31')}
          >
            <GanttTimeline />
            <GanttContent />
          </Gantt>
        </div>
      </div>
    </div>
  ),
};

/**
 * Gantt without sidebar.
 */
export const WithoutSidebar: Story = {
  render: () => (
    <div className="h-96 w-full">
      <Gantt tasks={sampleTasks} showSidebar={false} markers={sampleMarkers}>
        <GanttTimeline />
        <div className="relative flex-1">
          <GanttContent />
          <GanttMarkers />
        </div>
      </Gantt>
    </div>
  ),
};

/**
 * Read-only Gantt chart.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="h-96 w-full">
      <Gantt tasks={sampleTasks} readonly markers={sampleMarkers}>
        <GanttHeader>
          <h3 className="font-semibold">Project Timeline (Read-Only)</h3>
          <div className="text-muted-foreground text-sm">View-only mode</div>
        </GanttHeader>
        <GanttTimeline />
        <div className="relative flex-1">
          <GanttContent />
          <GanttMarkers />
        </div>
      </Gantt>
    </div>
  ),
};

/**
 * Multiple items on one row (hotel reservations example).
 */
export const MultipleItemsPerRow: Story = {
  render: () => {
    const hotelTasks: GanttTask[] = [
      {
        id: 'room-101-1',
        title: 'Cassandra Kihn Sr. - Conference',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-05'),
        color: '#3b82f6',
        group: 'Room 101',
      },
      {
        id: 'room-101-2',
        title: 'Elvira Swaniawski - Weekend Getaway',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-17'),
        color: '#10b981',
        group: 'Room 101',
      },
      {
        id: 'room-102-1',
        title: 'Gustavo Kutch DVM - Weekend Getaway',
        startDate: new Date('2024-03-08'),
        endDate: new Date('2024-03-10'),
        color: '#f59e0b',
        group: 'Room 102',
      },
      {
        id: 'room-102-2',
        title: 'Matt Ondricka - Weekend Getaway',
        startDate: new Date('2024-03-22'),
        endDate: new Date('2024-03-25'),
        color: '#ef4444',
        group: 'Room 102',
      },
      {
        id: 'room-103-1',
        title: 'Wanda Daugherty - Business Trip',
        startDate: new Date('2024-03-12'),
        endDate: new Date('2024-03-18'),
        color: '#8b5cf6',
        group: 'Room 103',
      },
      {
        id: 'room-104-1',
        title: 'Kendra Lindgren - Conference',
        startDate: new Date('2024-03-05'),
        endDate: new Date('2024-03-12'),
        color: '#06b6d4',
        group: 'Room 104',
      },
    ];

    return (
      <div className="h-96 w-full">
        <Gantt
          tasks={hotelTasks}
          timeScale="day"
          viewStart={new Date('2024-03-01')}
          viewEnd={new Date('2024-03-31')}
        >
          <GanttHeader>
            <h3 className="font-semibold">Hotel Reservations</h3>
            <div className="text-muted-foreground text-sm">March 2024</div>
          </GanttHeader>
          <GanttTimeline />
          <GanttContent />
        </Gantt>
      </div>
    );
  },
};

/**
 * Project management Gantt with header and controls.
 */
export const ProjectManagement: Story = {
  render: () => {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    return (
      <div className="h-96 w-full">
        <Gantt
          tasks={sampleTasks}
          markers={sampleMarkers}
          onTaskSelect={setSelectedTask}
        >
          <GanttHeader>
            <div>
              <h3 className="font-semibold">Web Application Development</h3>
              <p className="text-muted-foreground text-sm">
                Q1-Q2 2024 Project Timeline
              </p>
            </div>
            <GanttControls>
              <Button className="flex items-center gap-2 rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90">
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Calendar className="h-3 w-3" />
                View
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Filter className="h-3 w-3" />
                Filter
              </Button>
            </GanttControls>
          </GanttHeader>
          <GanttTimeline />
          <div className="relative flex-1">
            <GanttContent />
            <GanttMarkers />
          </div>
        </Gantt>

        {selectedTask && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            <strong>Selected Task:</strong>{' '}
            {sampleTasks.find((t) => t.id === selectedTask)?.title}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Resource scheduling Gantt.
 */
export const ResourceScheduling: Story = {
  render: () => {
    const resourceTasks: GanttTask[] = [
      {
        id: 'dev-1-task-1',
        title: 'Frontend Components',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-15'),
        color: '#3b82f6',
        group: 'Developer 1',
      },
      {
        id: 'dev-1-task-2',
        title: 'API Integration',
        startDate: new Date('2024-02-16'),
        endDate: new Date('2024-03-01'),
        color: '#10b981',
        group: 'Developer 1',
      },
      {
        id: 'dev-2-task-1',
        title: 'Database Schema',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-10'),
        color: '#f59e0b',
        group: 'Developer 2',
      },
      {
        id: 'dev-2-task-2',
        title: 'Authentication System',
        startDate: new Date('2024-02-12'),
        endDate: new Date('2024-02-28'),
        color: '#ef4444',
        group: 'Developer 2',
      },
      {
        id: 'designer-task-1',
        title: 'UI/UX Design',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-05'),
        color: '#8b5cf6',
        group: 'Designer',
      },
      {
        id: 'designer-task-2',
        title: 'Design System',
        startDate: new Date('2024-02-06'),
        endDate: new Date('2024-02-20'),
        color: '#06b6d4',
        group: 'Designer',
      },
    ];

    return (
      <div className="h-96 w-full">
        <Gantt
          tasks={resourceTasks}
          timeScale="day"
          viewStart={new Date('2024-01-15')}
          viewEnd={new Date('2024-03-15')}
        >
          <GanttHeader>
            <h3 className="font-semibold">Resource Allocation</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-3 w-3" />
              Feb 2024
            </div>
          </GanttHeader>
          <GanttTimeline />
          <GanttContent />
        </Gantt>
      </div>
    );
  },
};

/**
 * Manufacturing schedule Gantt.
 */
export const ManufacturingSchedule: Story = {
  render: () => {
    const manufacturingTasks: GanttTask[] = [
      {
        id: 'line-a-1',
        title: 'Product A - Batch 001',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-05'),
        progress: 100,
        color: '#10b981',
        group: 'Production Line A',
      },
      {
        id: 'line-a-2',
        title: 'Product B - Batch 002',
        startDate: new Date('2024-03-06'),
        endDate: new Date('2024-03-12'),
        progress: 60,
        color: '#3b82f6',
        group: 'Production Line A',
      },
      {
        id: 'line-b-1',
        title: 'Product C - Batch 001',
        startDate: new Date('2024-03-02'),
        endDate: new Date('2024-03-08'),
        progress: 80,
        color: '#f59e0b',
        group: 'Production Line B',
      },
      {
        id: 'line-b-2',
        title: 'Product A - Batch 003',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-15'),
        progress: 20,
        color: '#ef4444',
        group: 'Production Line B',
      },
      {
        id: 'qa-1',
        title: 'Quality Check - Batch 001',
        startDate: new Date('2024-03-06'),
        endDate: new Date('2024-03-07'),
        progress: 100,
        color: '#8b5cf6',
        group: 'Quality Assurance',
      },
      {
        id: 'qa-2',
        title: 'Quality Check - Batch 002',
        startDate: new Date('2024-03-13'),
        endDate: new Date('2024-03-14'),
        progress: 0,
        color: '#06b6d4',
        group: 'Quality Assurance',
      },
    ];

    const manufacturingMarkers: GanttMarker[] = [
      {
        id: 'maintenance',
        date: new Date('2024-03-09'),
        label: 'Maintenance',
        color: '#ef4444',
        type: 'milestone',
      },
      getTodayMarker(),
    ];

    return (
      <div className="h-96 w-full">
        <Gantt
          tasks={manufacturingTasks}
          markers={manufacturingMarkers}
          timeScale="day"
          viewStart={new Date('2024-03-01')}
          viewEnd={new Date('2024-03-31')}
        >
          <GanttHeader>
            <h3 className="font-semibold">Manufacturing Schedule</h3>
            <GanttControls>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  Completed
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-blue-500" />
                  In Progress
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-gray-300" />
                  Pending
                </div>
              </div>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </GanttControls>
          </GanttHeader>
          <GanttTimeline />
          <div className="relative flex-1">
            <GanttContent />
            <GanttMarkers />
          </div>
        </Gantt>
      </div>
    );
  },
};

/**
 * Event planning Gantt.
 */
export const EventPlanning: Story = {
  render: () => {
    const eventTasks: GanttTask[] = [
      {
        id: 'venue',
        title: 'Venue Booking',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-04-05'),
        progress: 100,
        color: '#10b981',
        group: 'Logistics',
      },
      {
        id: 'catering',
        title: 'Catering Arrangements',
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-04-20'),
        progress: 75,
        color: '#3b82f6',
        group: 'Logistics',
      },
      {
        id: 'speakers',
        title: 'Speaker Confirmations',
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-15'),
        progress: 90,
        color: '#f59e0b',
        group: 'Content',
      },
      {
        id: 'materials',
        title: 'Marketing Materials',
        startDate: new Date('2024-04-12'),
        endDate: new Date('2024-04-25'),
        progress: 40,
        color: '#ef4444',
        group: 'Marketing',
      },
      {
        id: 'registration',
        title: 'Registration System',
        startDate: new Date('2024-04-08'),
        endDate: new Date('2024-04-30'),
        progress: 60,
        color: '#8b5cf6',
        group: 'Technology',
      },
    ];

    const eventMarkers: GanttMarker[] = [
      {
        id: 'event-date',
        date: new Date('2024-05-01'),
        label: 'Event Day',
        color: '#ef4444',
        type: 'deadline',
      },
      getTodayMarker(),
    ];

    return (
      <div className="h-96 w-full">
        <Gantt
          tasks={eventTasks}
          markers={eventMarkers}
          viewStart={new Date('2024-04-01')}
          viewEnd={new Date('2024-05-15')}
        >
          <GanttHeader>
            <div>
              <h3 className="font-semibold">Annual Conference 2024</h3>
              <p className="text-muted-foreground text-sm">
                Event planning timeline
              </p>
            </div>
            <GanttControls>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Settings className="h-3 w-3" />
                Settings
              </Button>
            </GanttControls>
          </GanttHeader>
          <GanttTimeline />
          <div className="relative flex-1">
            <GanttContent />
            <GanttMarkers />
          </div>
        </Gantt>
      </div>
    );
  },
};

// Custom gantt info component for stories
const GanttInfo = () => {
  const { tasks, markers, selectedTasks, timeScale, readonly } = useGantt();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="font-medium">Tasks:</span>
          <div>{tasks.length}</div>
        </div>
        <div>
          <span className="font-medium">Markers:</span>
          <div>{markers.length}</div>
        </div>
        <div>
          <span className="font-medium">Selected:</span>
          <div>{selectedTasks.size}</div>
        </div>
        <div>
          <span className="font-medium">Time Scale:</span>
          <div className="capitalize">{timeScale}</div>
        </div>
        <div>
          <span className="font-medium">Mode:</span>
          <div>{readonly ? 'Read-only' : 'Interactive'}</div>
        </div>
        <div>
          <span className="font-medium">Progress:</span>
          <div>
            {Math.round(
              tasks.reduce((sum, task) => sum + (task.progress || 0), 0) /
                tasks.length
            )}
            % avg
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the Gantt context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="h-64 w-full">
        <Gantt
          tasks={sampleTasks.slice(0, 4)}
          markers={sampleMarkers.slice(0, 2)}
        >
          <GanttTimeline />
          <GanttContent />
          <GanttInfo />
        </Gantt>
      </div>
    </div>
  ),
};

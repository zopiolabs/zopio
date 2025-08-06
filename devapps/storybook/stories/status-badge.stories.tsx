/**
 * SPDX-License-Identifier: MIT
 */

import { Card } from '@repo/design-system/ui';
import { StatusBadge } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type * as React from 'react';
import { useState } from 'react';

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

/**
 * Default status badge examples showing all status types
 */
export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-3xl p-6">
      <div className="space-y-8">
        {/* All Status Types */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Status Types</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-sm">Completed</span>
              <StatusBadge status="completed" label="Task Complete" />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-sm">In Progress</span>
              <StatusBadge status="in-progress" label="Working on it" />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-sm">Pending</span>
              <StatusBadge status="pending" label="Waiting" />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-sm">Delayed</span>
              <StatusBadge status="delayed" label="Behind Schedule" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Animation control examples for status badges
 */
export const AnimationControl: Story = {
  render: () => (
    <Card className="w-full max-w-3xl p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Animation Control</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Animated</span>
            <StatusBadge
              status="in-progress"
              label="Processing"
              animated={true}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-sm">Static</span>
            <StatusBadge
              status="in-progress"
              label="Processing"
              animated={false}
            />
          </div>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Common use cases for status badges in real-world applications with draggable features
 */
export const UseCases: Story = {
  render: () => {
    // Define task type
    interface Task {
      id: string;
      title: string;
      description: string;
      status: 'completed' | 'in-progress' | 'pending' | 'delayed';
      label: string;
    }

    // Define the task items with their statuses
    const initialTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Database Migration',
        description: 'Migrating user data to new schema',
        status: 'in-progress' as const,
        label: 'Running',
      },
      {
        id: 'task-2',
        title: 'API Integration',
        description: 'Third-party service integration',
        status: 'completed' as const,
        label: 'Live',
      },
      {
        id: 'task-3',
        title: 'Security Audit',
        description: 'Quarterly security review',
        status: 'delayed' as const,
        label: 'Overdue',
      },
      {
        id: 'task-4',
        title: 'Feature Release',
        description: 'New dashboard components',
        status: 'pending' as const,
        label: 'Scheduled',
      },
    ];

    // State for tasks and drag tracking
    const [tasks, setTasks] = useState(initialTasks);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    // Drag handlers
    const handleDragStart = (taskId: string) => {
      setDraggedTaskId(taskId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLButtonElement>): void => {
      e.preventDefault();
    };

    const handleDrop = (targetTaskId: string) => {
      if (!draggedTaskId || draggedTaskId === targetTaskId) {
        setDraggedTaskId(null);
        return;
      }

      // Reorder tasks
      const draggedTaskIndex = tasks.findIndex(
        (task: Task) => task.id === draggedTaskId
      );
      const targetTaskIndex = tasks.findIndex(
        (task: Task) => task.id === targetTaskId
      );

      const newTasks = [...tasks];
      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      newTasks.splice(targetTaskIndex, 0, draggedTask);

      setTasks(newTasks);
      setDraggedTaskId(null);
    };

    return (
      <Card className="w-full max-w-3xl p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Common Use Cases (Draggable)
          </h3>
          <p className="text-muted-foreground text-sm">
            Drag and drop to reorder tasks
          </p>
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <button
                key={task.id}
                type="button"
                className="flex w-full cursor-move items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                draggable={true}
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(task.id)}
                style={{ opacity: draggedTaskId === task.id ? 0.5 : 1 }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-muted-foreground text-sm">
                    {task.description}
                  </span>
                </div>
                <StatusBadge status={task.status} label={task.label} />
              </button>
            ))}
          </div>
        </div>
      </Card>
    );
  },
};

/**
 * Custom styling examples for status badges
 */
export const CustomStyling: Story = {
  render: () => (
    <Card className="w-full max-w-3xl p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Custom Styling</h3>
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge
            status="completed"
            label="Success"
            className="shadow-lg"
          />
          <StatusBadge
            status="in-progress"
            label="Loading"
            className="border-2 border-blue-300"
          />
          <StatusBadge
            status="delayed"
            label="Alert"
            className="ring-2 ring-red-200"
          />
        </div>
      </div>
    </Card>
  ),
};

/**
 * Dark theme examples for status badges
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="rounded-xl bg-gray-950 p-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-white">
            Status Types (Dark)
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-300 text-sm">
                Completed
              </span>
              <StatusBadge status="completed" label="Task Complete" />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-300 text-sm">
                In Progress
              </span>
              <StatusBadge
                status="in-progress"
                label="Working on it"
                animated={true}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-300 text-sm">Pending</span>
              <StatusBadge status="pending" label="Waiting" />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-300 text-sm">Delayed</span>
              <StatusBadge status="delayed" label="Behind Schedule" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

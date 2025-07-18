/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Clock, Tag } from 'lucide-react';
import { useState } from 'react';

import {
  type DragEndEvent,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@repo/design-system/ui/list';

type Task = {
  id: string;
  name: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
};

type Status = {
  id: string;
  name: string;
  color: string;
};

const statuses: Status[] = [
  { id: 'planned', name: 'Planned', color: '#6366F1' },
  { id: 'in-progress', name: 'In Progress', color: '#F59E0B' },
  { id: 'done', name: 'Done', color: '#10B981' },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Unleash end-to-end initiatives',
    status: 'planned',
    priority: 'high',
    dueDate: '2025-07-15',
  },
  {
    id: 'task-2',
    name: 'Deliver plug-and-play systems',
    status: 'planned',
    priority: 'medium',
    dueDate: '2025-07-18',
  },
  {
    id: 'task-3',
    name: 'Incentivize 24/7 mindshare',
    status: 'planned',
    priority: 'low',
    dueDate: '2025-07-20',
  },
  {
    id: 'task-4',
    name: 'Monetize ubiquitous technologies',
    status: 'planned',
    priority: 'medium',
    dueDate: '2025-07-22',
  },
  {
    id: 'task-5',
    name: 'Leverage customized schemas',
    status: 'planned',
    priority: 'high',
    dueDate: '2025-07-25',
  },
  {
    id: 'task-6',
    name: 'Unleash cutting-edge technologies',
    status: 'planned',
    priority: 'medium',
    dueDate: '2025-07-28',
  },
  {
    id: 'task-7',
    name: 'Harness distributed functionalities',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-07-14',
  },
  {
    id: 'task-8',
    name: 'Engineer enterprise solutions',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-07-16',
  },
  {
    id: 'task-9',
    name: 'Repurpose cross-platform relationships',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2025-07-18',
  },
  {
    id: 'task-10',
    name: 'Aggregate compelling e-commerce',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-07-20',
  },
  {
    id: 'task-11',
    name: 'Orchestrate turn-key experiences',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-07-22',
  },
  {
    id: 'task-12',
    name: 'Facilitate synergistic mindshare',
    status: 'done',
    priority: 'low',
    dueDate: '2025-07-05',
  },
  {
    id: 'task-13',
    name: 'Scale end-to-end supply-chains',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-07-08',
  },
  {
    id: 'task-14',
    name: 'Engineer killer ROI',
    status: 'done',
    priority: 'high',
    dueDate: '2025-07-10',
  },
  {
    id: 'task-15',
    name: 'Scale mission-critical supply-chains',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-07-12',
  },
  {
    id: 'task-16',
    name: 'Redefine interactive e-commerce',
    status: 'done',
    priority: 'low',
    dueDate: '2025-07-14',
  },
  {
    id: 'task-17',
    name: 'Orchestrate vertical solutions',
    status: 'done',
    priority: 'high',
    dueDate: '2025-07-16',
  },
  {
    id: 'task-18',
    name: 'Productize collaborative ROI',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-07-18',
  },
  {
    id: 'task-19',
    name: 'Maximize killer interfaces',
    status: 'done',
    priority: 'low',
    dueDate: '2025-07-20',
  },
  {
    id: 'task-20',
    name: 'Productize impactful relationships',
    status: 'done',
    priority: 'high',
    dueDate: '2025-07-22',
  },
];

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * List views are a great way to show a list of tasks grouped by status and ranked by priority.
 */
const meta = {
  title: 'ui/List',
  component: ListProvider,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ListProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A simple list view with draggable items grouped by status.
 */
export const Default: Story = {
  args: {
    children: null,
    onDragEnd: () => undefined,
  },
  render: () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      if (active.id !== over.id) {
        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((task) => task.id === activeId);
        const overStatus = statuses.find((status) => status.id === overId);

        if (activeTask && overStatus) {
          setTasks(
            tasks.map((task) =>
              task.id === activeId ? { ...task, status: overStatus.id } : task
            )
          );
        }
      }
    };

    return (
      <div className="h-[600px] w-full">
        <ListProvider onDragEnd={handleDragEnd} className="flex-row gap-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex w-80 flex-col rounded-md border bg-background"
            >
              <ListHeader name={status.name} color={status.color} />
              <ListGroup id={status.id} className="flex-1 overflow-y-auto">
                <ListItems>
                  {tasks
                    .filter((task) => task.status === status.id)
                    .map((task, index) => (
                      <ListItem
                        key={task.id}
                        id={task.id}
                        name={task.name}
                        index={index}
                        parent={status.id}
                      />
                    ))}
                </ListItems>
              </ListGroup>
            </div>
          ))}
        </ListProvider>
      </div>
    );
  },
};

/**
 * A list view with custom item content.
 */
export const CustomItems: Story = {
  args: {
    children: null,
    onDragEnd: () => undefined,
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      if (active.id !== over.id) {
        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((task) => task.id === activeId);
        const overStatus = statuses.find((status) => status.id === overId);

        if (activeTask && overStatus) {
          setTasks(
            tasks.map((task) =>
              task.id === activeId ? { ...task, status: overStatus.id } : task
            )
          );
        }
      }
    };

    return (
      <div className="h-[600px] w-full">
        <ListProvider onDragEnd={handleDragEnd} className="flex-row gap-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex w-80 flex-col rounded-md border bg-background"
            >
              <ListHeader>
                <div className="flex items-center justify-between bg-foreground/5 p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <p className="m-0 font-semibold text-sm">{status.name}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    {tasks.filter((task) => task.status === status.id).length}
                  </span>
                </div>
              </ListHeader>
              <ListGroup id={status.id} className="flex-1 overflow-y-auto">
                <ListItems>
                  {tasks
                    .filter((task) => task.status === status.id)
                    .map((task, index) => (
                      <ListItem
                        key={task.id}
                        id={task.id}
                        name={task.name}
                        index={index}
                        parent={status.id}
                        className="flex-col items-start"
                      >
                        <div className="flex w-full items-center justify-between">
                          <h3 className="font-medium text-sm">{task.name}</h3>
                          <span
                            className={`inline-block size-2 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          />
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="size-3" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-1">
                          <Tag className="size-3 text-muted-foreground" />
                          <span className="text-muted-foreground text-xs">
                            {task.priority}
                          </span>
                        </div>
                      </ListItem>
                    ))}
                </ListItems>
              </ListGroup>
            </div>
          ))}
        </ListProvider>
      </div>
    );
  },
};

/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Clock, FileText, MessageSquare, Tag } from 'lucide-react';
import { useState } from 'react';

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@repo/design-system/ui/kanban';

interface Task {
  id: string;
  name: string;
  column: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  comments?: number;
  [key: string]: unknown;
}

type Column = {
  id: string;
  name: string;
};

const initialColumns: Column[] = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'todo', name: 'To Do' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'done', name: 'Done' },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Enhance impactful synergies',
    column: 'backlog',
    description: 'Implement new features to enhance user experience',
    priority: 'medium',
    dueDate: '2025-07-20',
    comments: 3,
  },
  {
    id: 'task-2',
    name: 'Unleash B2C initiatives',
    column: 'backlog',
    description: 'Develop marketing strategies for B2C market',
    priority: 'high',
    dueDate: '2025-07-15',
    comments: 5,
  },
  {
    id: 'task-3',
    name: 'Deploy sticky content',
    column: 'todo',
    description: 'Create engaging content for the website',
    priority: 'low',
    dueDate: '2025-07-25',
    comments: 2,
  },
  {
    id: 'task-4',
    name: 'Embrace B2C experiences',
    column: 'todo',
    description: 'Improve user onboarding flow',
    priority: 'medium',
    dueDate: '2025-07-18',
    comments: 0,
  },
  {
    id: 'task-5',
    name: 'Revolutionize distributed paradigms',
    column: 'in-progress',
    description: 'Implement distributed architecture for better scalability',
    priority: 'high',
    dueDate: '2025-07-12',
    comments: 8,
  },
  {
    id: 'task-6',
    name: 'Enhance end-to-end smart contracts',
    column: 'in-progress',
    description: 'Develop secure smart contract implementation',
    priority: 'medium',
    dueDate: '2025-07-14',
    comments: 4,
  },
  {
    id: 'task-7',
    name: 'Optimize open-source interfaces',
    column: 'done',
    description: 'Refactor and optimize existing interfaces',
    priority: 'low',
    dueDate: '2025-07-05',
    comments: 1,
  },
  {
    id: 'task-8',
    name: 'Generate viral content',
    column: 'done',
    description: 'Create viral marketing campaign',
    priority: 'high',
    dueDate: '2025-07-08',
    comments: 6,
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
 * A kanban board is a visual tool that helps you manage and visualize your work.
 * It is a board with columns, and each column represents a status, e.g. "Backlog", "In Progress", "Done".
 */
const meta = {
  title: 'ui/Kanban',
  component: KanbanProvider,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof KanbanProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A simple kanban board with draggable cards.
 */
export const Default: Story = {
  args: {
    children: () => null,
    columns: initialColumns,
    data: initialTasks,
    onDragEnd: () => {
      // no-op
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const handleDragEnd = () => {
      // Drag ended - handle as needed
    };

    return (
      <div className="h-[600px] w-full">
        <KanbanProvider<Task, Column>
          columns={initialColumns}
          data={tasks}
          onDataChange={setTasks}
          onDragEnd={handleDragEnd}
        >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>{column.name}</KanbanHeader>
              <KanbanCards<Task> id={column.id}>
                {(task) => (
                  <KanbanCard<Task>
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    column={task.column}
                    description={''}
                    priority={'low'}
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium text-sm">{task.name}</h3>
                      <p className="text-muted-foreground text-xs">
                        {typeof task.description === 'string'
                          ? task.description
                          : ''}
                      </p>
                      <div className="flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <Tag className="size-3" />
                          <span
                            className={`inline-block size-2 rounded-full ${getPriorityColor(
                              task.priority as 'low' | 'medium' | 'high'
                            )}`}
                          />
                          <span>
                            {typeof task.priority === 'string'
                              ? task.priority
                              : ''}
                          </span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>
                              {typeof task.dueDate === 'string'
                                ? task.dueDate
                                : ''}
                            </span>
                          </div>
                        )}
                        {task.comments !== undefined && task.comments > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="size-3" />
                            <span>
                              {typeof task.comments === 'number'
                                ? task.comments
                                : 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    );
  },
};

/**
 * A simple kanban board with custom card content.
 */
export const CustomCards: Story = {
  args: {
    children: () => null,
    columns: initialColumns,
    data: initialTasks,
    onDragEnd: () => {
      // no-op
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    return (
      <div className="h-[600px] w-full">
        <KanbanProvider<Task, Column>
          columns={initialColumns}
          data={tasks}
          onDataChange={setTasks}
        >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader className="flex items-center justify-between">
                <span>{column.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                  {tasks.filter((task) => task.column === column.id).length}
                </span>
              </KanbanHeader>
              <KanbanCards<Task> id={column.id}>
                {(task) => (
                  <KanbanCard<Task>
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    column={task.column}
                    className="bg-card"
                    description={''}
                    priority={'low'}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block size-2 rounded-full ${getPriorityColor(
                            task.priority as 'low' | 'medium' | 'high'
                          )}`}
                        />
                        <span className="font-medium text-xs">{task.id}</span>
                      </div>
                      <h3 className="font-medium text-sm">{task.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>
                              {typeof task.dueDate === 'string'
                                ? task.dueDate
                                : ''}
                            </span>
                          </div>
                        )}
                        {task.comments !== undefined && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="size-3" />
                            <span>
                              {typeof task.comments === 'number'
                                ? task.comments
                                : 0}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FileText className="size-3" />
                          <span>
                            {typeof task.description === 'string'
                              ? task.description.substring(0, 20)
                              : ''}
                            ...
                          </span>
                        </div>
                      </div>
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    );
  },
};

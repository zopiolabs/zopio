/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { GanttProvider } from './GanttProvider';
import { GanttSidebar, GanttSidebarGroup, GanttSidebarItem } from './GanttSidebar';
import { GanttTimeline, GanttToday } from './GanttTimeline';
import { GanttHeader } from './GanttHeader';
import { GanttColumns } from './GanttColumns';
import { GanttFeatureList, GanttFeatureRow } from './GanttFeatureItem';
import { GanttFeature, GanttStatus } from './types';
import { TaskAddPopover } from './TaskAddPopover';
// Utility for classNames merging - this is commonly available in the project
const cn = (...classes: (string | undefined | boolean | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface EditableGanttProps {
  tasks?: GanttFeature[];
  className?: string;
  editableDailyTasks?: boolean;
  onUpdate?: (updatedTask: GanttFeature) => void;
  onTaskMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  onAddTask?: (newTask: GanttFeature) => void;
  columnDays?: number;
}

export const EditableGantt: FC<EditableGanttProps> = ({
  tasks: initialTasks = [],
  className,
  editableDailyTasks = false,
  onUpdate: externalOnUpdate,
  onTaskMove: externalOnTaskMove,
  onAddTask: externalOnAddTask,
  columnDays = 60, // Extended to 60 days by default
}) => {
  // Track task state locally for editing
  const [tasks, setTasks] = useState<GanttFeature[]>(initialTasks);
  const [addTaskState, setAddTaskState] = useState<{ open: boolean; statusId: string } | null>(null);

  // Reference to check if we need to update (prevents infinite loops)
  const prevTasksRef = useRef<string>("");
  
  // Sync with external task updates only when the data actually changes
  useEffect(() => {
    // Serialize tasks for simple comparison
    const currentTasksJson = JSON.stringify(initialTasks);
    
    // Only update if the task data has actually changed
    if (currentTasksJson !== prevTasksRef.current) {
      prevTasksRef.current = currentTasksJson;
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  // Handle task updates
  const handleTaskUpdate = useCallback((updatedTask: GanttFeature) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    
    // Call external handler if provided
    if (externalOnUpdate) {
      externalOnUpdate(updatedTask);
    }
  }, [externalOnUpdate]);

  // Handle task movement
  const handleTaskMove = useCallback((id: string, startAt: Date, endAt: Date | null) => {
    setTasks(currentTasks => {
      const updatedTasks = currentTasks.map(task => 
        task.id === id ? { ...task, startAt, endAt } : task
      );
      return updatedTasks;
    });
    
    // Call external handler if provided
    if (externalOnTaskMove) {
      externalOnTaskMove(id, startAt, endAt);
    }
  }, [externalOnTaskMove]);
  
  // Handle adding new task
  const handleAddTask = useCallback((statusId: string) => {
    setAddTaskState({ open: true, statusId });
  }, []);

  // Handle task creation from popover
  const handleCreateTask = useCallback((newTaskData: Omit<GanttFeature, 'id'>) => {
    const newTask: GanttFeature = {
      ...newTaskData,
      id: uuidv4(),
    };
    
    setTasks(currentTasks => [...currentTasks, newTask]);
    
    // Call external handler if provided
    if (externalOnAddTask) {
      externalOnAddTask(newTask);
    }
  }, [externalOnAddTask]);

  // Group tasks by status for sidebar display
  const tasksByStatus = tasks.reduce((acc, task) => {
    const statusId = task.status.id;
    if (!acc[statusId]) {
      acc[statusId] = {
        status: task.status,
        tasks: []
      };
    }
    acc[statusId].tasks.push(task);
    return acc;
  }, {} as Record<string, { status: GanttFeature['status'], tasks: GanttFeature[] }>);

  const statusGroups = Object.values(tasksByStatus);
  
  // Extract all unique statuses for the add task popover
  const allStatuses = [...new Map(tasks.map(item => [item.status.id, item.status])).values()];

  return (
    <GanttProvider 
      className={className}
      range="daily"
      editableDailyTasks={editableDailyTasks}
    >
      <GanttSidebar>
        {addTaskState && (
          <TaskAddPopover
            open={addTaskState.open}
            onOpenChange={(open) => setAddTaskState(open ? addTaskState : null)}
            statusId={addTaskState.statusId}
            statuses={allStatuses}
            onAddTask={handleCreateTask}
          >
            <button type="button" className="hidden">Add Task</button>
          </TaskAddPopover>
        )}
        
        {statusGroups.map(group => (
          <GanttSidebarGroup
            key={group.status.id}
            name={group.status.name}
            status={group.status}
            onAddTask={editableDailyTasks ? handleAddTask : undefined}
          >
            {group.tasks.map(task => (
              <GanttSidebarItem 
                key={task.id}
                feature={task}
                onUpdate={handleTaskUpdate}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      
      <GanttTimeline>
        <GanttHeader />
        <GanttColumns columns={columnDays} isColumnSecondary={(i) => i % 2 === 0} />
        <GanttToday />
        <GanttFeatureList>
          {statusGroups.map(group => (
            <GanttFeatureRow
              key={group.status.id}
              features={group.tasks}
              onMove={handleTaskMove}
              onUpdate={handleTaskUpdate}
            />
          ))}
        </GanttFeatureList>
      </GanttTimeline>
    </GanttProvider>
  );
};

// Example usage
export const createExampleTasks = (): GanttFeature[] => {
  const today = new Date();
  const statuses = [
    { id: 'todo', name: 'To Do', color: '#F97316' },
    { id: 'in-progress', name: 'In Progress', color: '#3B82F6' },
    { id: 'done', name: 'Done', color: '#22C55E' }
  ];
  
  return [
    {
      id: 'task-1',
      name: 'Research competitors',
      startAt: today,
      endAt: addDays(today, 3),
      status: statuses[0]
    },
    {
      id: 'task-2',
      name: 'Design user flows',
      startAt: addDays(today, 2),
      endAt: addDays(today, 5),
      status: statuses[1]
    },
    {
      id: 'task-3',
      name: 'Create wireframes',
      startAt: addDays(today, 4),
      endAt: addDays(today, 7),
      status: statuses[1]
    },
    {
      id: 'task-4',
      name: 'Get client approval',
      startAt: addDays(today, 7),
      endAt: addDays(today, 8),
      status: statuses[0]
    },
    {
      id: 'task-5',
      name: 'Setup project repo',
      startAt: addDays(today, -2),
      endAt: addDays(today, -1),
      status: statuses[2]
    }
  ];
};

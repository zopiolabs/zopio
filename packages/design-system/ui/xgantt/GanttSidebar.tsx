/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC, ReactNode, useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@repo/design-system/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { formatDistance, addDays, isSameDay } from 'date-fns';
import { Input } from '@repo/design-system/ui/input';
import { GanttContext } from './context';
import { GanttFeature } from './types';
import { TaskPopover } from './TaskPopover';

export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
  onUpdate?: (updatedFeature: GanttFeature) => void;
};

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
  onUpdate,
}) => {
  const gantt = useContext(GanttContext);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [taskName, setTaskName] = useState(feature.name);
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;
  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
      
      // Open popover if in editable mode
      if (gantt.editableDailyTasks && onUpdate) {
        setPopoverOpen(true);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
      
      // Open popover if in editable mode
      if (gantt.editableDailyTasks && onUpdate) {
        setPopoverOpen(true);
      }
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTaskName(newName);
    
    // Propagate the change to the parent component
    if (onUpdate) {
      onUpdate({
        ...feature,
        name: newName
      });
    }
  };
  
  const handlePopoverUpdate = (updatedFeature: GanttFeature) => {
    if (onUpdate) {
      onUpdate(updatedFeature);
      setTaskName(updatedFeature.name);
    }
  };

  // Render a TaskPopover if editableDailyTasks is true and onUpdate is provided
  if (gantt.editableDailyTasks && onUpdate) {
    return (
      <TaskPopover 
        feature={feature}
        onUpdate={handlePopoverUpdate}
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <div
          className={cn(
            'relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary',
            className
          )}
          key={feature.id}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          style={{
            height: 'var(--gantt-row-height)',
          }}
          tabIndex={0}
        >
          <div
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: feature.status.color,
            }}
          />
          <Input 
            className="flex-1 h-6 text-xs font-medium p-1 bg-transparent hover:bg-secondary-foreground/10"
            value={taskName}
            onChange={handleNameChange}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <p className="text-muted-foreground">{duration}</p>
        </div>
      </TaskPopover>
    );
  }
  
  // Standard non-editable view
  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary',
        className
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        height: 'var(--gantt-row-height)',
      }}
      tabIndex={0}
    >
      <div
        className="pointer-events-none h-2 w-2 shrink-0 rounded-full"
        style={{
          backgroundColor: feature.status.color,
        }}
      />
      <p className="pointer-events-none flex-1 truncate text-left font-medium">
        {feature.name}
      </p>
      <p className="pointer-events-none text-muted-foreground">{duration}</p>
    </div>
  );
};

export type GanttSidebarHeaderProps = {
  children?: ReactNode;
  className?: string;
};

export const GanttSidebarHeader: FC<GanttSidebarHeaderProps> = ({ children, className }) => (
  <div
    className={cn(
      "sticky top-0 z-10 flex shrink-0 border-border/50 border-b bg-backdrop/90 backdrop-blur-sm",
      className
    )}
    style={{ height: 'var(--gantt-header-height)' }}
  >
    {children || (
      <div className="flex items-end justify-between gap-2.5 p-2.5 font-medium text-muted-foreground text-xs w-full">
        <p className="flex-1 truncate text-left">Issues</p>
        <p className="shrink-0">Duration</p>
      </div>
    )}
  </div>
);

export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
  onAddTask?: (statusId: string) => void;
  status?: GanttFeature['status'];
};

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({
  children,
  name,
  className,
  onAddTask,
  status,
}) => {
  const gantt = useContext(GanttContext);
  const showAddButton = gantt.editableDailyTasks && onAddTask && status;
  
  return (
  <div className={className}>
    <div 
      className="flex items-center justify-between"
      style={{ height: 'var(--gantt-row-height)' }}
    >
      <p className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs">
        {name}
      </p>
      {showAddButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mr-2"
          onClick={() => onAddTask?.(status!.id)}
          title="Add new task"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
  );
};

export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
};

export const GanttSidebar: FC<GanttSidebarProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'sticky left-0 z-30 h-max min-h-full overflow-clip border-border/50 border-r bg-background/90 backdrop-blur-md',
      className
    )}
    data-roadmap-ui="gantt-sidebar"
  >
    <GanttSidebarHeader />
    <div className="space-y-4">{children}</div>
  </div>
);

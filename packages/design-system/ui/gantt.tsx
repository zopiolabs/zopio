/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  Plus,
  Grip,
  MoreHorizontal
} from "lucide-react";
import { cn } from "../lib/utils";

const ganttVariants = cva(
  "w-full bg-background border rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent bg-transparent",
        outline: "border-2 border-dashed",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface GanttTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  color?: string;
  group?: string;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

interface GanttMarker {
  id: string;
  date: Date;
  label: string;
  color?: string;
  type?: 'milestone' | 'deadline' | 'today';
}

interface GanttContextValue {
  tasks: GanttTask[];
  markers: GanttMarker[];
  selectedTasks: Set<string>;
  draggedTask: string | null;
  viewStart: Date;
  viewEnd: Date;
  timeScale: 'day' | 'week' | 'month';
  showSidebar: boolean;
  readonly: boolean;
  onTaskUpdate?: (task: GanttTask) => void;
  onTaskSelect?: (taskId: string) => void;
  onMarkerAdd?: (date: Date) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
}

const GanttContext = React.createContext<GanttContextValue | null>(null);

interface GanttProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ganttVariants> {
  tasks: GanttTask[];
  markers?: GanttMarker[];
  showSidebar?: boolean;
  readonly?: boolean;
  timeScale?: 'day' | 'week' | 'month';
  viewStart?: Date;
  viewEnd?: Date;
  onTaskUpdate?: (task: GanttTask) => void;
  onTaskSelect?: (taskId: string) => void;
  onMarkerAdd?: (date: Date) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
}

const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
  (
    {
      className,
      variant,
      size,
      tasks,
      markers = [],
      showSidebar = true,
      readonly = false,
      timeScale = 'month',
      viewStart,
      viewEnd,
      onTaskUpdate,
      onTaskSelect,
      onMarkerAdd,
      onDateRangeChange,
      children,
      ...props
    },
    ref
  ) => {
    const [selectedTasks, setSelectedTasks] = React.useState(new Set<string>());
    const [draggedTask, setDraggedTask] = React.useState<string | null>(null);

    // Calculate default view range if not provided
    const defaultViewStart = React.useMemo(() => {
      if (viewStart) return viewStart;
      if (tasks.length === 0) return new Date();
      
      const minDate = new Date(Math.min(...tasks.map(t => t.startDate.getTime())));
      minDate.setMonth(minDate.getMonth() - 1);
      return minDate;
    }, [tasks, viewStart]);

    const defaultViewEnd = React.useMemo(() => {
      if (viewEnd) return viewEnd;
      if (tasks.length === 0) {
        const end = new Date();
        end.setFullYear(end.getFullYear() + 1);
        return end;
      }
      
      const maxDate = new Date(Math.max(...tasks.map(t => t.endDate.getTime())));
      maxDate.setMonth(maxDate.getMonth() + 1);
      return maxDate;
    }, [tasks, viewEnd]);

    const contextValue = React.useMemo(
      () => ({
        tasks,
        markers,
        selectedTasks,
        draggedTask,
        viewStart: defaultViewStart,
        viewEnd: defaultViewEnd,
        timeScale,
        showSidebar,
        readonly,
        onTaskUpdate,
        onTaskSelect,
        onMarkerAdd,
        onDateRangeChange,
      }),
      [
        tasks,
        markers,
        selectedTasks,
        draggedTask,
        defaultViewStart,
        defaultViewEnd,
        timeScale,
        showSidebar,
        readonly,
        onTaskUpdate,
        onTaskSelect,
        onMarkerAdd,
        onDateRangeChange,
      ]
    );

    return (
      <GanttContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(ganttVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </div>
      </GanttContext.Provider>
    );
  }
);

Gantt.displayName = "Gantt";

// Gantt Header
interface GanttHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const GanttHeader = React.forwardRef<HTMLDivElement, GanttHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4 border-b bg-muted/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GanttHeader.displayName = "GanttHeader";

// Gantt Timeline
interface GanttTimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

const GanttTimeline = React.forwardRef<HTMLDivElement, GanttTimelineProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(GanttContext);

    if (!context) {
      throw new Error("GanttTimeline must be used within a Gantt");
    }

    const { viewStart, viewEnd, timeScale, showSidebar } = context;

    const generateTimeColumns = () => {
      const columns = [];
      const current = new Date(viewStart);

      while (current <= viewEnd) {
        const label = timeScale === 'day' 
          ? current.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
          : timeScale === 'week'
          ? `Week ${Math.ceil(current.getDate() / 7)}`
          : current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        columns.push({
          date: new Date(current),
          label,
        });

        if (timeScale === 'day') {
          current.setDate(current.getDate() + 1);
        } else if (timeScale === 'week') {
          current.setDate(current.getDate() + 7);
        } else {
          current.setMonth(current.getMonth() + 1);
        }
      }

      return columns;
    };

    const timeColumns = generateTimeColumns();

    return (
      <div
        ref={ref}
        className={cn("flex border-b bg-muted/20", className)}
        {...props}
      >
        {showSidebar && (
          <div className="w-64 flex-shrink-0 border-r p-2 font-medium">
            Tasks
          </div>
        )}
        <div className="flex-1 flex">
          {timeColumns.map((column, index) => (
            <div
              key={index}
              className="flex-1 min-w-24 p-2 text-center text-sm font-medium border-r last:border-r-0"
            >
              {column.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

GanttTimeline.displayName = "GanttTimeline";

// Gantt Content
interface GanttContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const GanttContent = React.forwardRef<HTMLDivElement, GanttContentProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(GanttContext);

    if (!context) {
      throw new Error("GanttContent must be used within a Gantt");
    }

    const { tasks, showSidebar } = context;

    // Group tasks by group property
    const groupedTasks = React.useMemo(() => {
      const groups: Record<string, GanttTask[]> = {};
      
      tasks.forEach(task => {
        const groupKey = task.group || 'default';
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(task);
      });

      return groups;
    }, [tasks]);

    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto", className)}
        {...props}
      >
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName}>
            {groupName !== 'default' && (
              <div className="flex bg-muted/10 border-b">
                {showSidebar && (
                  <div className="w-64 flex-shrink-0 border-r p-3 font-semibold text-sm">
                    {groupName}
                  </div>
                )}
                <div className="flex-1" />
              </div>
            )}
            {groupTasks.map(task => (
              <GanttTaskRow key={task.id} task={task} />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

GanttContent.displayName = "GanttContent";

// Gantt Task Row
interface GanttTaskRowProps extends React.HTMLAttributes<HTMLDivElement> {
  task: GanttTask;
}

const GanttTaskRow = React.forwardRef<HTMLDivElement, GanttTaskRowProps>(
  ({ className, task, ...props }, ref) => {
    const context = React.useContext(GanttContext);

    if (!context) {
      throw new Error("GanttTaskRow must be used within a Gantt");
    }

    const {
      viewStart,
      viewEnd,
      selectedTasks,
      readonly,
      showSidebar,
      onTaskUpdate,
      onTaskSelect,
    } = context;

    const isSelected = selectedTasks.has(task.id);

    const handleTaskClick = () => {
      onTaskSelect?.(task.id);
    };

    // Calculate task bar position and width
    const totalDays = Math.ceil((viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskStartDays = Math.ceil((task.startDate.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskDurationDays = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));

    const leftPercent = Math.max(0, (taskStartDays / totalDays) * 100);
    const widthPercent = Math.min(100 - leftPercent, (taskDurationDays / totalDays) * 100);

    const formatDuration = (start: Date, end: Date) => {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (days < 30) return `${days} days`;
      if (days < 365) return `${Math.round(days / 30)} months`;
      return `${Math.round(days / 365)} years`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex border-b hover:bg-muted/20 transition-colors",
          isSelected && "bg-primary/5",
          className
        )}
        {...props}
      >
        {showSidebar && (
          <div className="w-64 flex-shrink-0 border-r p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{task.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDuration(task.startDate, task.endDate)}
                </div>
              </div>
              {!readonly && (
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 relative p-2 group">
          {/* Task Bar */}
          <div
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-6 rounded cursor-pointer transition-all",
              readonly ? "cursor-default" : "hover:shadow-sm",
              isSelected && "ring-2 ring-primary"
            )}
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
              backgroundColor: task.color || "#3b82f6",
            }}
            onClick={handleTaskClick}
          >
            {/* Progress Bar */}
            {task.progress !== undefined && (
              <div
                className="h-full bg-black/20 rounded-l"
                style={{ width: `${task.progress}%` }}
              />
            )}
            
            {/* Task Title (if no sidebar) */}
            {!showSidebar && (
              <div className="px-2 py-1 text-xs font-medium text-white truncate">
                {task.title}
              </div>
            )}

            {/* Resize Handles */}
            {!readonly && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/50" />
                <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/50" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

GanttTaskRow.displayName = "GanttTaskRow";

// Gantt Markers
interface GanttMarkersProps extends React.HTMLAttributes<HTMLDivElement> {}

const GanttMarkers = React.forwardRef<HTMLDivElement, GanttMarkersProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(GanttContext);

    if (!context) {
      throw new Error("GanttMarkers must be used within a Gantt");
    }

    const { markers, viewStart, viewEnd, showSidebar } = context;

    const totalDays = Math.ceil((viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 pointer-events-none", className)}
        {...props}
      >
        {markers.map(marker => {
          const markerDays = Math.ceil((marker.date.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
          const leftPercent = (markerDays / totalDays) * 100;

          if (leftPercent < 0 || leftPercent > 100) return null;

          return (
            <div
              key={marker.id}
              className="absolute top-0 bottom-0 pointer-events-auto"
              style={{ 
                left: showSidebar ? `calc(16rem + ${leftPercent}%)` : `${leftPercent}%`,
              }}
            >
              <div
                className="w-0.5 h-full"
                style={{ backgroundColor: marker.color || "#ef4444" }}
              />
              <div
                className="absolute top-2 left-1 px-1 py-0.5 text-xs rounded shadow-sm whitespace-nowrap"
                style={{
                  backgroundColor: marker.color || "#ef4444",
                  color: "white",
                }}
              >
                {marker.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

GanttMarkers.displayName = "GanttMarkers";

// Gantt Controls
interface GanttControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const GanttControls = React.forwardRef<HTMLDivElement, GanttControlsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GanttControls.displayName = "GanttControls";

// Hook for accessing gantt context
const useGantt = () => {
  const context = React.useContext(GanttContext);
  if (!context) {
    throw new Error("useGantt must be used within a Gantt component");
  }
  return context;
};

// Utility functions
const calculateTaskDuration = (startDate: Date, endDate: Date): number => {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString();
  const end = endDate.toLocaleDateString();
  return `${start} - ${end}`;
};

const isTaskOverlapping = (task1: GanttTask, task2: GanttTask): boolean => {
  return task1.startDate <= task2.endDate && task2.startDate <= task1.endDate;
};

const getTodayMarker = (): GanttMarker => ({
  id: 'today',
  date: new Date(),
  label: 'Today',
  color: '#10b981',
  type: 'today',
});

export {
  Gantt,
  GanttHeader,
  GanttTimeline,
  GanttContent,
  GanttTaskRow,
  GanttMarkers,
  GanttControls,
  useGantt,
  calculateTaskDuration,
  formatDateRange,
  isTaskOverlapping,
  getTodayMarker,
  ganttVariants,
};

export type {
  GanttProps,
  GanttHeaderProps,
  GanttTimelineProps,
  GanttContentProps,
  GanttTaskRowProps,
  GanttMarkersProps,
  GanttControlsProps,
  GanttTask,
  GanttMarker,
  GanttContextValue,
};

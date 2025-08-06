/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import {
  DndContext,
  MouseSensor,
  useDraggable,
  useSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useMouse, useThrottle } from '@uidotdev/usehooks';
import { addDays, format } from 'date-fns';
import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@repo/design-system/lib/utils';
import { Card } from '@repo/design-system/ui/card';
import { Input } from '@repo/design-system/ui/input';
import { TaskPopover } from './TaskPopover';
import { GanttContext, useGanttDragging, useGanttScrollX } from './context';
import { GanttFeature } from './types';
import { getDateByMousePosition, getDifferenceIn, getInnerDifferenceIn, getOffset, getWidth, getAddRange } from './utils';

export type GanttFeatureDragHelperProps = {
  featureId: GanttFeature['id'];
  direction: 'left' | 'right';
  date: Date | null;
};

export const GanttFeatureDragHelper: FC<GanttFeatureDragHelperProps> = ({
  direction,
  featureId,
  date,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `feature-drag-helper-${featureId}`,
  });
  const isPressed = Boolean(attributes['aria-pressed']);
  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);
  return (
    <div
      className={cn(
        'group -translate-y-1/2 !cursor-col-resize absolute top-1/2 z-[3] h-full w-6 rounded-md outline-none',
        direction === 'left' ? '-left-2.5' : '-right-2.5'
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          '-translate-y-1/2 absolute top-1/2 h-[80%] w-1 rounded-sm bg-muted-foreground opacity-0 transition-all',
          direction === 'left' ? 'left-2.5' : 'right-2.5',
          direction === 'left' ? 'group-hover:left-0' : 'group-hover:right-0',
          isPressed && (direction === 'left' ? 'left-0' : 'right-0'),
          'group-hover:opacity-100',
          isPressed && 'opacity-100'
        )}
      />
      {date && (
        <div
          className={cn(
            '-translate-x-1/2 absolute top-10 hidden whitespace-nowrap rounded-lg border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg group-hover:block',
            isPressed && 'block'
          )}
        >
          {format(date, 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );
};

export type GanttFeatureItemCardProps = Pick<GanttFeature, 'id'> & {
  children?: ReactNode;
};

export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps & { onClick?: (e: React.MouseEvent) => void }> = ({
  id,
  children,
  onClick,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const isPressed = Boolean(attributes['aria-pressed']);
  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);
  return (
    <Card className="h-full w-full rounded-md bg-background p-2 text-xs shadow-sm">
      <div
        className={cn(
          'flex h-full w-full items-center justify-between gap-2 text-left',
          isPressed && 'cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  );
};

export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void;
  onUpdate?: (updatedFeature: GanttFeature) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  onUpdate,
  children,
  className,
  ...feature
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );
  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);
  const [taskName, setTaskName] = useState<string>(feature.name);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  
  // Reference for storing feature data during drag operations
  const featureRef = useRef<{
    id: string;
    startAt: Date;
    endAt: Date | null;
  }>({ id: feature.id, startAt, endAt });
  // Memoize expensive calculations
  const width = useMemo(
    () => getWidth(startAt, endAt, gantt),
    [startAt, endAt, gantt]
  );
  const offset = useMemo(
    () => getOffset(startAt, timelineStartDate, gantt),
    [startAt, timelineStartDate, gantt]
  );
  const addRange = useMemo(() => getAddRange(gantt.range), [gantt.range]);
  const [mousePosition] = useMouse<HTMLDivElement>();
  const [previousMouseX, setPreviousMouseX] = useState(0);
  const [previousStartAt, setPreviousStartAt] = useState(startAt);
  const [previousEndAt, setPreviousEndAt] = useState(endAt);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  // Already replaced in previous chunk

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTaskName(newName);

    if (onUpdate) {
      onUpdate({
        ...feature,
        name: newName,
        startAt,
        endAt
      });
    }
  };

  const handlePopoverUpdate = (updatedFeature: GanttFeature) => {
    if (onUpdate) {
      setStartAt(updatedFeature.startAt);
      setEndAt(updatedFeature.endAt);
      setTaskName(updatedFeature.name);

      onUpdate(updatedFeature);

      if ((updatedFeature.startAt !== feature.startAt || updatedFeature.endAt !== feature.endAt) && onMove) {
        onMove(updatedFeature.id, updatedFeature.startAt, updatedFeature.endAt);
      }
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (gantt.editableDailyTasks && onUpdate) {
      setPopoverOpen(true);
      e.stopPropagation();
    }
  };

  const handleItemDragStart = useCallback(() => {
    // Track initial position and dates
    setPreviousMouseX(mousePosition.x);
    setPreviousStartAt(startAt);
    setPreviousEndAt(endAt);
    
    // Store in ref for future operations
    featureRef.current = {
      id: feature.id,
      startAt,
      endAt,
    };
  }, [feature.id, mousePosition.x, startAt, endAt]);

  const handleItemDragMove = useCallback(() => {
    const currentDate = getDateByMousePosition(gantt, mousePosition.x);
    const originalDate = getDateByMousePosition(gantt, previousMouseX);

    if (!(currentDate && originalDate)) {
      return;
    }
    
    const delta =
      gantt.range === 'daily'
        ? getDifferenceIn(gantt.range)(currentDate, originalDate)
        : getInnerDifferenceIn(gantt.range)(currentDate, originalDate);
    const newStartDate = addDays(previousStartAt, delta);
    const newEndDate = previousEndAt ? addDays(previousEndAt, delta) : null;
    setStartAt(newStartDate);
    setEndAt(newEndDate);
  }, [gantt, mousePosition.x, previousMouseX, previousStartAt, previousEndAt]);
  const onDragEnd = useCallback(
    () => onMove?.(feature.id, startAt, endAt),
    [onMove, feature.id, startAt, endAt]
  );
  const handleLeftDragMove = useCallback(() => {
    const date = getDateByMousePosition(gantt, mousePosition.x);
    if (!date) return;
    setStartAt(date);
  }, [gantt, mousePosition.x]);

  const handleRightDragMove = useCallback(() => {
    const date = getDateByMousePosition(gantt, mousePosition.x);
    if (!date) return;
    setEndAt(date);
  }, [gantt, mousePosition.x]);
  
  // Notify about task updates when dates are changed
  useEffect(() => {
    if (onUpdate && (startAt !== feature.startAt || endAt !== feature.endAt)) {
      onUpdate({
        ...feature,
        name: taskName,
        startAt,
        endAt
      });
    }
  }, [startAt, endAt, feature, taskName, onUpdate]);

  return (
    <div
      className={cn('relative flex w-max min-w-full py-0.5', className)}
      style={{ height: 'var(--gantt-row-height)' }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: 'calc(var(--gantt-row-height) - 4px)',
          width: Math.round(width),
          left: Math.round(offset),
        }}
      >
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleLeftDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={startAt}
              direction="left"
              featureId={feature.id}
            />
          </DndContext>
        )}
        {gantt.editableDailyTasks && onUpdate ? (
          <TaskPopover
            feature={{
              ...feature,
              name: taskName,
              startAt,
              endAt
            }}
            onUpdate={handlePopoverUpdate}
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
          >
            <DndContext
              modifiers={[restrictToHorizontalAxis]}
              onDragEnd={onDragEnd}
              onDragMove={handleItemDragMove}
              onDragStart={handleItemDragStart}
              sensors={[mouseSensor]}
            >
              <GanttFeatureItemCard id={feature.id} onClick={handleItemClick}>
                <div 
                  className="flex-1 h-full flex items-center" 
                  style={{
                    backgroundColor: feature.status.color ? `${feature.status.color}20` : undefined,
                    borderLeft: `3px solid ${feature.status.color}`
                  }}
                >
                  <Input 
                    className="flex-1 h-full text-xs font-medium p-1 bg-transparent border-none hover:bg-secondary-foreground/10"
                    value={taskName}
                    onChange={handleNameChange}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </GanttFeatureItemCard>
            </DndContext>
          </TaskPopover>
        ) : (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleItemDragMove}
            onDragStart={handleItemDragStart}
            sensors={[mouseSensor]}
          >
            <GanttFeatureItemCard id={feature.id}>
              <div 
                className="flex-1 h-full flex items-center" 
                style={{
                  backgroundColor: feature.status.color ? `${feature.status.color}20` : undefined,
                  borderLeft: `3px solid ${feature.status.color}`
                }}
              >
                {children ?? (
                  <p className="flex-1 truncate text-xs px-2">{feature.name}</p>
                )}
              </div>
            </GanttFeatureItemCard>
          </DndContext>
        )}
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleRightDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={endAt ?? addRange(startAt, 2)}
              direction="right"
              featureId={feature.id}
            />
          </DndContext>
        )}
      </div>
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({
  children,
  className,
}) => (
  <div className={className} style={{ paddingTop: 'var(--gantt-row-height)' }}>
    {children}
  </div>
);

export type GanttFeatureRowProps = {
  features: GanttFeature[];
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  onUpdate?: (updatedFeature: GanttFeature) => void;
  children?: (feature: GanttFeature) => ReactNode;
  className?: string;
};

export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({
  features,
  onMove,
  onUpdate,
  children,
  className,
}) => {
  // Sort features by start date to handle potential overlaps
  const sortedFeatures = [...features].sort((a, b) =>
    a.startAt.getTime() - b.startAt.getTime()
  );
  // Calculate sub-row positions for overlapping features using a proper algorithm
  const featureWithPositions = [];
  const subRowEndTimes: Date[] = []; // Track when each sub-row becomes free

  for (const feature of sortedFeatures) {
    let subRow = 0;

    // Find the first sub-row that's free (doesn't overlap)
    while (subRow < subRowEndTimes.length && subRowEndTimes[subRow] > feature.startAt) {
      subRow++;
    }

    // Update the end time for this sub-row
    const safeEndAt = feature.endAt || new Date(); // Default to current date if null
    if (subRow === subRowEndTimes.length) {
      subRowEndTimes.push(safeEndAt);
    } else {
      subRowEndTimes[subRow] = safeEndAt;
    }

    featureWithPositions.push({ ...feature, subRow });
  }
  const maxSubRows = Math.max(1, subRowEndTimes.length);
  const subRowHeight = 36; // Base row height
  return (
    <div
      className={cn('relative', className)}
      style={{
        height: `${maxSubRows * subRowHeight}px`,
        minHeight: 'var(--gantt-row-height)'
      }}
    >
      {featureWithPositions.map((feature) => (
        <div
          key={feature.id}
          className="absolute w-full"
          style={{
            top: `${feature.subRow * subRowHeight}px`,
            height: `${subRowHeight}px`
          }}
        >
          <GanttFeatureItem
            {...feature}
            onMove={onMove}
            onUpdate={onUpdate}
          >
            {children ? children(feature) : (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItem>
        </div>
      ))}
    </div>
  );
};

export type GanttFeatureListProps = {
  className?: string;
  children: ReactNode;
};

export const GanttFeatureList: FC<GanttFeatureListProps> = ({
  className,
  children,
}) => (
  <div
    className={cn('absolute top-0 left-0 h-full w-max space-y-4', className)}
    style={{ marginTop: 'var(--gantt-header-height)' }}
  >
    {children}
  </div>
);

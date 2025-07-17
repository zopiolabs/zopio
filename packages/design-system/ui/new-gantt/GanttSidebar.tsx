/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { useContext } from 'react';
import { formatDistance } from 'date-fns';
import { addDays, isSameDay } from 'date-fns';
import { cn } from '@repo/design-system/lib/utils';

import { GanttContext } from './context';
import {
  GanttSidebarProps,
  GanttSidebarGroupProps,
  GanttSidebarItemProps
} from './types';

export const GanttSidebarItem: React.FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const gantt = useContext(GanttContext);

  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;

  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary',
        className
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // biome-ignore lint/a11y/useSemanticElements: "This is a clickable item"
      role="button"
      style={{
        height: 'var(--gantt-row-height)',
      }}
      tabIndex={0}
    >
      {/* <Checkbox onCheckedChange={handleCheck} className="shrink-0" /> */}
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

export interface GanttSidebarHeaderProps {
  children?: React.ReactNode;
}

export const GanttSidebarHeader: React.FC<GanttSidebarHeaderProps> = ({ children }) => (
  <div
    className="sticky top-0 z-10 flex shrink-0 items-end justify-between gap-2.5 border-border/50 border-b bg-backdrop/90 p-2.5 font-medium text-muted-foreground text-xs backdrop-blur-sm"
    style={{ height: 'var(--gantt-header-height)' }}
  >
    {children || (
      <>
        {/* <Checkbox className="shrink-0" /> */}
        <p className="flex-1 truncate text-left">Issues</p>
        <p className="shrink-0">Duration</p>
      </>
    )}
  </div>
);

export const GanttSidebarGroup: React.FC<GanttSidebarGroupProps> = ({
  children,
  name,
  className,
}) => (
  <div className={className}>
    <p
      className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs"
      style={{ height: 'var(--gantt-row-height)' }}
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

export const GanttSidebar: React.FC<GanttSidebarProps> = ({
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

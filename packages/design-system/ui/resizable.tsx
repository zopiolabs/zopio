/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';

import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@repo/design-system/lib/utils';

type Direction = 'horizontal' | 'vertical';

interface ResizablePanelGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  direction: Direction;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = ({
  className,
  direction,
  ...props
}) => {
  return React.createElement(ResizablePrimitive.PanelGroup as any, {
    'data-slot': 'resizable-panel-group',
    direction,
    className: cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className
    ),
    ...props,
  });
};

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  /**
   * Default size in percentage (0 – 100) of the panel on first render.
   */
  defaultSize?: number;
  id?: string;
  /**
   * Minimum size in percentage (0 – 100) that the panel can be resized to.
   */
  minSize?: number;
  /**
   * Maximum size in percentage (0 – 100) that the panel can be resized to.
   */
  maxSize?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  className,
  defaultSize,
  id,
  minSize,
  maxSize,
  style,
  ...props
}) => {
  return React.createElement(ResizablePrimitive.Panel as any, {
    'data-slot': 'resizable-panel',
    className,
    defaultSize,
    id,
    minSize,
    maxSize,
    style,
    ...props,
  });
};

interface ResizableHandleProps {
  withHandle?: boolean;
  className?: string;
  id?: string;
  onDragging?: (isDragging: boolean) => void;
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({
  withHandle,
  className,
  ...props
}) => {
  return React.createElement(
    ResizablePrimitive.PanelResizeHandle as any,
    {
      'data-slot': 'resizable-handle',
      className: cn(
        'after:-translate-x-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2 relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        className
      ),
      ...props,
    },
    withHandle &&
      React.createElement(
        'div',
        {
          className:
            'bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border',
        },
        React.createElement(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: 'size-2.5',
          },
          React.createElement('line', {
            x1: '12',
            x2: '12',
            y1: '3',
            y2: '21',
          }),
          React.createElement('line', {
            x1: '18',
            x2: '18',
            y1: '3',
            y2: '21',
          }),
          React.createElement('line', { x1: '6', x2: '6', y1: '3', y2: '21' })
        )
      )
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

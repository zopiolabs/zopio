/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC } from 'react';
import * as GanttComponents from './xgantt/index';
import { GanttProviderProps } from './xgantt/GanttProvider';

/**
 * xGantt Component
 * 
 * A comprehensive Gantt chart component for visualizing project timelines, tasks,
 * and dependencies. This component allows for interactive scheduling, drag-and-drop
 * functionality, and customizable views.
 * 
 * Based on the Kibo UI Gantt component (https://www.kibo-ui.com/components/gantt)
 */
const XGanttComponent: FC<GanttProviderProps> = (props) => {
  return <GanttComponents.GanttProvider {...props} />;
};

// Create the xGantt namespace with all subcomponents
export const xGantt = Object.assign(XGanttComponent, GanttComponents);

export default xGantt;
export * from './xgantt/index';

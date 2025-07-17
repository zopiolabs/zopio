/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { createContext } from 'react';
import { atom, useAtom } from 'jotai';
import { GanttContextProps } from './types';

// Create atoms for global state management
export const draggingAtom = atom(false);
export const scrollXAtom = atom(0);

// Export atom hooks
export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

// Create the Gantt context with default values
const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: 'monthly',
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
});

export { GanttContext };

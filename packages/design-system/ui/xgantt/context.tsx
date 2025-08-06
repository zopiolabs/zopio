/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { atom, useAtom } from 'jotai';
import { createContext } from 'react';
import { GanttContextProps } from './types';

// Global atoms for state management
export const draggingAtom = atom(false);
export const scrollXAtom = atom(0);

// Custom hooks to access global state
export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

// Create default context values
export const GanttContext = createContext<GanttContextProps>({
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

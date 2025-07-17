/**
 * SPDX-License-Identifier: MIT
 */

'use client';

// Export types
export * from './types';

// Export context and hooks
export { GanttContext, useGanttDragging, useGanttScrollX } from './context';

// Export utility functions
export {
  getsDaysIn,
  getDifferenceIn,
  getInnerDifferenceIn,
  getStartOf,
  getEndOf,
  getAddRange,
  getDateByMousePosition,
  createInitialTimelineData,
  getOffset,
  getWidth,
  calculateInnerOffset,
} from './utils';

// Export GanttProvider
export { GanttProvider } from './GanttProvider';

// Export GanttHeader components
export { GanttHeader, GanttContentHeader } from './GanttHeader';

// Export GanttSidebar components
export {
  GanttSidebar,
  GanttSidebarHeader,
  GanttSidebarGroup,
  GanttSidebarItem,
} from './GanttSidebar';
export type { GanttSidebarHeaderProps } from './GanttSidebar';

// Export GanttTimeline components
export {
  GanttTimeline,
  GanttColumns,
  GanttColumn,
  GanttAddFeatureHelper,
  GanttCreateMarkerTrigger,
} from './GanttTimeline';

// Export GanttFeatureItem components
export {
  GanttFeatureItem,
  GanttFeatureItemCard,
  GanttFeatureDragHelper,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
} from './GanttFeatureItem';

// Export GanttMarker components
export { GanttMarker, GanttToday } from './GanttMarker';

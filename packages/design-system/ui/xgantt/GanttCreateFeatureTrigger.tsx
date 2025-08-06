/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC, useContext, useEffect, useRef } from 'react';
import { getDateByMousePosition } from './utils';
import { GanttContext } from './context';

export interface GanttCreateFeatureTriggerProps {
  /**
   * Callback triggered when a new feature should be created
   * @param date The date at the clicked position
   */
  onCreateFeature: (date: Date) => void;
}

/**
 * A component that triggers feature creation when a user double clicks on the timeline
 */
export const GanttCreateFeatureTrigger: FC<GanttCreateFeatureTriggerProps> = ({
  onCreateFeature,
}) => {
  const gantt = useContext(GanttContext);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeline = document.querySelector(
      '[class*="relative flex h-full w-max flex-none overflow-clip"]'
    ) as HTMLDivElement | null;
    
    if (timeline) {
      timelineRef.current = timeline;
      
      const handleDoubleClick = (event: MouseEvent) => {
        // Only process double clicks directly on the timeline, not on features
        if (
          (event.target as HTMLElement).closest('[data-feature-item]') ||
          (event.target as HTMLElement).closest('[class*="GanttFeatureItem"]')
        ) {
          return;
        }
        
        const rect = timeline.getBoundingClientRect();
        const x = event.clientX - rect.left;
        
        const date = getDateByMousePosition(gantt, x);
        if (date) {
          onCreateFeature(date);
        }
      };
      
      timeline.addEventListener('dblclick', handleDoubleClick);
      
      return () => {
        timeline.removeEventListener('dblclick', handleDoubleClick);
      };
    }
    
    return undefined;
  }, [gantt, onCreateFeature]);
  
  // This is a utility component that doesn't render anything visible
  return null;
};

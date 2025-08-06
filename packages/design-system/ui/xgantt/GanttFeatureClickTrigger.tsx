/**
 * SPDX-License-Identifier: MIT
 */

import React, { FC, useState, useEffect, ReactNode } from 'react';
import { GanttFeature } from './types';
import { GanttContext } from './context';
import { useContext } from 'react';

export interface GanttFeatureClickTriggerProps {
  features: GanttFeature[];
  onFeatureClick: (feature: GanttFeature) => void;
}

export const GanttFeatureClickTrigger: FC<GanttFeatureClickTriggerProps> = ({
  features,
  onFeatureClick,
}) => {
  const gantt = useContext(GanttContext);

  // Effect to add click handlers to feature elements
  useEffect(() => {
    const handleFeatureClick = (event: MouseEvent) => {
      const featureElement = (event.target as Element).closest('.gantt-feature');
      
      if (featureElement) {
        const featureId = featureElement.getAttribute('data-feature-id');
        
        if (featureId) {
          const feature = features.find(f => f.id === featureId);
          if (feature) {
            onFeatureClick(feature);
          }
        }
      }
    };

    // Add click handler to each feature element
    document.addEventListener('click', handleFeatureClick);
    
    return () => {
      document.removeEventListener('click', handleFeatureClick);
    };
  }, [features, onFeatureClick]);

  return null;
};

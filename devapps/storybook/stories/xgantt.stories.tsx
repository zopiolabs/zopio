/**
 * SPDX-License-Identifier: MIT
 */

import {
  GanttCreateFeatureTrigger,
  GanttCreateMarkerTrigger,
  type GanttFeature,
  GanttFeatureClickTrigger,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttMarker,
  type GanttMarkerProps,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type Range,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { addDays, subDays } from 'date-fns';
import { useState } from 'react';

const meta: Meta<typeof GanttProvider> = {
  title: 'ui/GanttX',
  component: GanttProvider,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof GanttProvider>;

// Generate a random color
const getRandomColor = () => {
  const colors = [
    '#10b981',
    '#f59e0b',
    '#3b82f6',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Create sample features
const createSampleFeatures = (): GanttFeature[] => {
  const today = new Date();
  return [
    {
      id: '1',
      name: 'Research and Planning',
      startAt: subDays(today, 14),
      endAt: subDays(today, 7),
      status: {
        name: 'Completed',
        color: '#10b981',
        id: '',
      },
    },
    {
      id: '2',
      name: 'Design System Development',
      startAt: subDays(today, 10),
      endAt: subDays(today, 2),
      status: {
        name: 'Completed',
        color: '#10b981',
        id: '',
      },
    },
    {
      id: '3',
      name: 'Frontend Implementation',
      startAt: subDays(today, 5),
      endAt: addDays(today, 7),
      status: {
        name: 'In Progress',
        color: '#f59e0b',
        id: '',
      },
    },
    {
      id: '4',
      name: 'Backend API Integration',
      startAt: today,
      endAt: addDays(today, 10),
      status: {
        name: 'In Progress',
        color: '#f59e0b',
        id: '',
      },
    },
    {
      id: '5',
      name: 'Testing & QA',
      startAt: addDays(today, 7),
      endAt: addDays(today, 14),
      status: {
        name: 'Planned',
        color: '#3b82f6',
        id: '',
      },
    },
    {
      id: '6',
      name: 'Deployment',
      startAt: addDays(today, 14),
      endAt: addDays(today, 16),
      status: {
        name: 'Planned',
        color: '#3b82f6',
        id: '',
      },
    },
    {
      id: '7',
      name: 'Documentation',
      startAt: addDays(today, 5),
      endAt: addDays(today, 12),
      status: {
        name: 'Planned',
        color: '#3b82f6',
        id: '',
      },
    },
    {
      id: '8',
      name: 'User Training',
      startAt: addDays(today, 16),
      endAt: addDays(today, 21),
      status: {
        name: 'Not Started',
        color: '#94a3b8',
        id: '',
      },
    },
    {
      id: '9',
      name: 'Feedback Collection',
      startAt: addDays(today, 21),
      endAt: addDays(today, 28),
      status: {
        name: 'Not Started',
        color: '#94a3b8',
        id: '',
      },
    },
  ];
};

// Create sample markers
const createSampleMarkers = (): GanttMarkerProps[] => {
  const today = new Date();
  return [
    {
      id: 'marker-1',
      label: 'Project Start',
      date: subDays(today, 14),
    },
    {
      id: 'marker-2',
      label: 'Milestone 1',
      date: subDays(today, 2),
    },
    {
      id: 'marker-3',
      label: 'Milestone 2',
      date: addDays(today, 14),
    },
    {
      id: 'marker-4',
      label: 'Project Deadline',
      date: addDays(today, 28),
    },
  ];
};

export const Default: Story = {
  render: () => {
    // Use useState to make features and markers editable
    const [features, setFeatures] = useState<GanttFeature[]>(
      createSampleFeatures()
    );
    const [markers, setMarkers] = useState<GanttMarkerProps[]>(
      createSampleMarkers()
    );
    const [range, setRange] = useState<Range>('monthly');
    const [zoom, setZoom] = useState<number>(100);
    const [_selectedFeature, setSelectedFeature] =
      useState<GanttFeature | null>(null);

    // Handle feature updates
    const handleFeatureMove = (
      id: string,
      startAt: Date,
      endAt: Date | null
    ) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    };

    // Handle marker removal
    const handleMarkerRemove = (id: string) => {
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    };

    // Handle adding new features
    const handleAddFeature = (date: Date) => {
      const newId = String(features.length + 1);
      setFeatures((prev) => [
        ...prev,
        {
          id: `new-${newId}`,
          name: `New Task ${newId}`,
          startAt: date,
          endAt: addDays(date, 5),
          status: {
            id: `status-${newId}`,
            name: 'New',
            color: getRandomColor(),
          },
        },
      ]);
    };

    // Handle adding new markers
    const handleAddMarker = (date: Date) => {
      const newId = String(markers.length + 1);
      setMarkers((prev) => [
        ...prev,
        {
          id: `new-marker-${newId}`,
          label: `New Marker ${newId}`,
          date,
        },
      ]);
    };

    // Handle selecting a feature to edit
    const _handleFeatureSelect = (feature: GanttFeature) => {
      setSelectedFeature(feature);
    };

    // Handle updating a feature from the edit modal
    const _handleFeatureUpdate = (updatedFeature: GanttFeature) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === updatedFeature.id ? updatedFeature : feature
        )
      );
      setSelectedFeature(null); // Close modal after saving
    };

    // Close the edit modal
    const _handleCloseModal = () => {
      setSelectedFeature(null);
    };

    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center justify-between border-b bg-background p-4">
          <h2 className="font-bold text-xl">Project Timeline</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="range" className="font-medium text-sm">
                View:
              </label>
              <select
                id="range"
                className="rounded border px-2 py-1 text-sm"
                value={range}
                onChange={(e) => setRange(e.target.value as Range)}
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="zoom" className="font-medium text-sm">
                Zoom:
              </label>
              <input
                id="zoom"
                type="range"
                min="50"
                max="200"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm">{zoom}%</span>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <GanttSidebar>
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              <GanttFeatureRow features={features} onMove={handleFeatureMove} />
            </GanttFeatureList>
            <GanttToday />
            {markers.map((marker) => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleMarkerRemove}
              />
            ))}
            <GanttCreateMarkerTrigger onCreateMarker={handleAddMarker} />
            <GanttCreateFeatureTrigger onCreateFeature={handleAddFeature} />
            <GanttFeatureClickTrigger
              features={features}
              onFeatureClick={_handleFeatureSelect}
            />
          </GanttTimeline>
        </div>
      </div>
    );
  },
};

export const DailyView: Story = {
  render: () => {
    // Use useState to make features and markers editable
    const [features, setFeatures] = useState<GanttFeature[]>(
      createSampleFeatures()
    );
    const [markers, setMarkers] = useState<GanttMarkerProps[]>(
      createSampleMarkers()
    );

    // Handle feature updates
    const handleFeatureMove = (
      id: string,
      startAt: Date,
      endAt: Date | null
    ) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    };

    // Handle marker removal
    const handleMarkerRemove = (id: string) => {
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    };

    // Handle adding new features
    const handleAddFeature = (date: Date) => {
      const newFeature: GanttFeature = {
        id: `new-${Date.now()}`,
        name: 'New Task',
        startAt: date,
        endAt: addDays(date, 1),
        status: {
          name: 'New',
          color: getRandomColor(),
          id: '',
        },
      };
      setFeatures((prev) => [...prev, newFeature]);
    };

    // Handle feature selection
    const _handleFeatureSelect = (_feature: GanttFeature) => {
      // Add your feature selection logic here
      // For example: setSelectedFeature(_feature);
    };

    // Handle adding new markers
    const handleAddMarker = (date: Date) => {
      const newMarker: GanttMarkerProps = {
        id: `marker-${Date.now()}`,
        label: 'New Marker',
        date,
      };
      setMarkers((prev) => [...prev, newMarker]);
    };

    return (
      <div className="h-screen">
        <GanttProvider range="daily" zoom={100}>
          <GanttSidebar>
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              <GanttFeatureRow features={features} onMove={handleFeatureMove} />
              <GanttCreateFeatureTrigger onCreateFeature={handleAddFeature} />
              <GanttFeatureClickTrigger
                features={features}
                onFeatureClick={_handleFeatureSelect}
              />
            </GanttFeatureList>
            <GanttToday />
            {markers.map((marker) => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleMarkerRemove}
              />
            ))}
            <GanttCreateMarkerTrigger onCreateMarker={handleAddMarker} />
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

export const QuarterlyView: Story = {
  render: () => {
    // Use useState to make features and markers editable
    const [features, setFeatures] = useState<GanttFeature[]>(
      createSampleFeatures()
    );
    const [markers, setMarkers] = useState<GanttMarkerProps[]>(
      createSampleMarkers()
    );
    const [_selectedFeature, setSelectedFeature] =
      useState<GanttFeature | null>(null);
    // Handle feature updates
    const handleFeatureMove = (
      id: string,
      startAt: Date,
      endAt: Date | null
    ) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    };

    // Handle marker removal
    const handleMarkerRemove = (id: string) => {
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    };

    // Handle selecting a feature to edit
    const _handleFeatureSelect = (feature: GanttFeature) => {
      setSelectedFeature(feature);
    };

    // Handle updating a feature from the edit modal
    const _handleFeatureUpdate = (updatedFeature: GanttFeature) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === updatedFeature.id ? updatedFeature : feature
        )
      );
      setSelectedFeature(null); // Close modal after saving
    };

    // Close the edit modal
    const _handleCloseModal = () => {
      setSelectedFeature(null);
    };

    // Handle adding new features
    const handleAddFeature = (date: Date) => {
      const newFeature: GanttFeature = {
        id: `new-${Date.now()}`,
        name: 'New Task',
        startAt: date,
        endAt: addDays(date, 30), // For quarterly view, add a month
        status: {
          name: 'New',
          color: getRandomColor(),
          id: '',
        },
      };
      setFeatures((prev) => [...prev, newFeature]);
    };

    // Handle adding new markers
    const handleAddMarker = (date: Date) => {
      const newMarker: GanttMarkerProps = {
        id: `marker-${Date.now()}`,
        label: 'New Marker',
        date,
      };
      setMarkers((prev) => [...prev, newMarker]);
    };

    return (
      <div className="h-screen">
        <GanttProvider range="quarterly" zoom={100}>
          <GanttSidebar>
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              <GanttFeatureRow features={features} onMove={handleFeatureMove} />
              <GanttCreateFeatureTrigger onCreateFeature={handleAddFeature} />
            </GanttFeatureList>
            <GanttToday />
            {markers.map((marker) => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleMarkerRemove}
              />
            ))}
            <GanttCreateMarkerTrigger onCreateMarker={handleAddMarker} />
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    // Use useState to make features and markers editable
    const [allFeatures, setAllFeatures] = useState<GanttFeature[]>(
      createSampleFeatures()
    );
    const [markers, setMarkers] = useState<GanttMarkerProps[]>(
      createSampleMarkers()
    );
    const [_selectedFeature, setSelectedFeature] =
      useState<GanttFeature | null>(null);

    // Group features into categories
    const designFeatures = allFeatures.filter(
      (f) => f.id === '1' || f.id === '2' || f.id.startsWith('design-')
    );
    const developmentFeatures = allFeatures.filter(
      (f) =>
        f.id === '3' || f.id === '4' || f.id === '5' || f.id.startsWith('dev-')
    );
    const deploymentFeatures = allFeatures.filter(
      (f) =>
        (Number(f.id) > 5 || f.id.startsWith('deploy-')) &&
        !f.id.startsWith('design-') &&
        !f.id.startsWith('dev-')
    );

    // Handle feature updates
    const handleFeatureMove = (
      id: string,
      startAt: Date,
      endAt: Date | null
    ) => {
      setAllFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    };

    // Handle selecting a feature to edit
    const _handleFeatureSelect = (feature: GanttFeature) => {
      setSelectedFeature(feature);
    };

    // Handle updating a feature from the edit modal
    const _handleFeatureUpdate = (updatedFeature: GanttFeature) => {
      setAllFeatures((prev) =>
        prev.map((feature) =>
          feature.id === updatedFeature.id ? updatedFeature : feature
        )
      );
      setSelectedFeature(null); // Close modal after saving
    };

    // Close the edit modal
    const _handleCloseModal = () => {
      setSelectedFeature(null);
    };

    // Handle marker removal
    const handleMarkerRemove = (id: string) => {
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    };

    // Handle adding new features
    const handleAddFeature = (date: Date) => {
      // In a real application, you would determine which group to add to based on
      // the position where the user clicked. Here we'll always use development.
      // Define a type for our group types to make TypeScript happy
      type GroupType = 'design' | 'development' | 'deployment';

      // In a real app, this would be determined by where the user clicked
      const groupType: GroupType = 'development';

      // Set the prefix based on the group type
      const prefix = {
        design: 'design-',
        development: 'dev-',
        deployment: 'deploy-',
      }[groupType];

      const newFeature: GanttFeature = {
        id: `${prefix}${Date.now()}`,
        name: `New ${groupType.charAt(0).toUpperCase() + groupType.slice(1)} Task`,
        startAt: date,
        endAt: addDays(date, 7),
        status: {
          name: 'New',
          color: getRandomColor(),
          id: '',
        },
      };
      setAllFeatures((prev) => [...prev, newFeature]);
    };

    // Handle adding new markers
    const handleAddMarker = (date: Date) => {
      const newMarker: GanttMarkerProps = {
        id: `marker-${Date.now()}`,
        label: 'New Marker',
        date,
      };
      setMarkers((prev) => [...prev, newMarker]);
    };

    return (
      <div className="h-screen">
        <GanttProvider range="monthly" zoom={100}>
          <GanttSidebar>
            <GanttSidebarGroup name="Design">
              {designFeatures.map((feature) => (
                <GanttSidebarItem key={feature.id} feature={feature} />
              ))}
            </GanttSidebarGroup>
            <GanttSidebarGroup name="Development">
              {developmentFeatures.map((feature) => (
                <GanttSidebarItem key={feature.id} feature={feature} />
              ))}
            </GanttSidebarGroup>
            <GanttSidebarGroup name="Deployment">
              {deploymentFeatures.map((feature) => (
                <GanttSidebarItem key={feature.id} feature={feature} />
              ))}
            </GanttSidebarGroup>
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              <GanttFeatureListGroup>
                <GanttFeatureRow
                  features={designFeatures}
                  onMove={handleFeatureMove}
                />
              </GanttFeatureListGroup>
              <GanttFeatureListGroup>
                <GanttFeatureRow
                  features={developmentFeatures}
                  onMove={handleFeatureMove}
                />
              </GanttFeatureListGroup>
              <GanttFeatureListGroup>
                <GanttFeatureRow
                  features={deploymentFeatures}
                  onMove={handleFeatureMove}
                />
              </GanttFeatureListGroup>
            </GanttFeatureList>
            <GanttToday />
            {markers.map((marker) => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleMarkerRemove}
              />
            ))}
            <GanttCreateMarkerTrigger onCreateMarker={handleAddMarker} />
            <GanttCreateFeatureTrigger onCreateFeature={handleAddFeature} />
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { addDays, addMonths, format } from 'date-fns';
import { useState } from 'react';
import { action } from 'storybook/actions';

import {
  GanttColumns,
  GanttContentHeader,
  GanttCreateMarkerTrigger,
  type GanttFeature,
  GanttFeatureItem,
  GanttFeatureItemCard,
  GanttFeatureList,
  GanttFeatureRow,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarHeader,
  GanttSidebarItem,
  type GanttStatus,
  GanttTimeline,
  GanttToday,
} from '@repo/design-system/ui/new-gantt';

/**
 * A Gantt chart component for visualizing project timelines, tasks, and dependencies.
 */
const meta: Meta<typeof GanttProvider> = {
  title: 'ui/NewGantt',
  component: GanttProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GanttProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample data for the Gantt chart
const today = new Date();
const statuses: GanttStatus[] = [
  { id: 'planned', name: 'Planned', color: '#3b82f6' },
  { id: 'in-progress', name: 'In Progress', color: '#eab308' },
  { id: 'completed', name: 'Completed', color: '#22c55e' },
  { id: 'delayed', name: 'Delayed', color: '#ef4444' },
];

const features: GanttFeature[] = [
  {
    id: '1',
    name: 'Research Phase',
    startAt: addDays(today, -30),
    endAt: addDays(today, -10),
    status: statuses[2], // Completed
  },
  {
    id: '2',
    name: 'Design Phase',
    startAt: addDays(today, -15),
    endAt: addDays(today, 5),
    status: statuses[1], // In Progress
  },
  {
    id: '3',
    name: 'Development Phase',
    startAt: addDays(today, -5),
    endAt: addDays(today, 20),
    status: statuses[1], // In Progress
  },
  {
    id: '4',
    name: 'Testing Phase',
    startAt: addDays(today, 15),
    endAt: addDays(today, 30),
    status: statuses[0], // Planned
  },
  {
    id: '5',
    name: 'Deployment',
    startAt: addDays(today, 25),
    endAt: addDays(today, 35),
    status: statuses[0], // Planned
  },
];

const markers = [
  {
    id: 'milestone-1',
    date: addDays(today, 5),
    label: 'Design Review',
  },
  {
    id: 'milestone-2',
    date: addDays(today, 20),
    label: 'Beta Release',
  },
];

// Basic Gantt Chart
export const Default: Story = {
  render: () => {
    const [currentFeatures, setCurrentFeatures] =
      useState<GanttFeature[]>(features);

    const handleMove = (id: string, startAt: Date, endAt: Date | null) => {
      if (!endAt) {
        return;
      }

      setCurrentFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    };

    const handleAddItem = (date: Date) => {
      const newFeature: GanttFeature = {
        id: `new-${Math.random().toString(36).substr(2, 9)}`,
        name: 'New Task',
        startAt: date,
        endAt: addDays(date, 7),
        status: statuses[0],
      };

      setCurrentFeatures((prev) => [...prev, newFeature]);
    };

    return (
      <div className="h-[600px] w-full">
        <GanttProvider range="monthly" onAddItem={handleAddItem}>
          <GanttHeader>
            <GanttSidebarHeader>
              <div className="flex h-full items-center px-4 font-medium">
                Project Timeline
              </div>
            </GanttSidebarHeader>
            <GanttContentHeader
              title="Timeline"
              columns={12}
              renderHeaderItem={(index) => (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="text-muted-foreground text-xs">
                    {format(addMonths(today, index - 6), 'MMM')}
                  </div>
                  <div className="font-medium">
                    {format(addMonths(today, index - 6), 'yyyy')}
                  </div>
                </div>
              )}
            />
          </GanttHeader>

          <GanttSidebar>
            <GanttSidebarGroup name="Tasks">
              {currentFeatures.map((feature) => (
                <GanttSidebarItem key={feature.id} feature={feature} />
              ))}
            </GanttSidebarGroup>
          </GanttSidebar>

          <GanttTimeline>
            <GanttColumns
              columns={365}
              isColumnSecondary={(index) => index % 2 === 0}
            />
            <GanttToday />

            {markers.map((marker) => (
              <GanttMarker
                key={marker.id}
                id={marker.id}
                date={marker.date}
                label={marker.label}
              />
            ))}

            <GanttFeatureList>
              <GanttFeatureRow features={currentFeatures} onMove={handleMove}>
                {(feature) => (
                  <GanttFeatureItem
                    key={feature.id}
                    {...feature}
                    onMove={handleMove}
                    className="rounded-md border"
                    style={{ backgroundColor: feature.status.color }}
                  >
                    <GanttFeatureItemCard id={feature.id}>
                      <div className="p-2 font-medium text-white text-xs">
                        {feature.name}
                      </div>
                    </GanttFeatureItemCard>
                  </GanttFeatureItem>
                )}
              </GanttFeatureRow>
            </GanttFeatureList>

            <GanttCreateMarkerTrigger
              onCreateMarker={(date) => {
                action('create-marker')(date);
              }}
            />
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

// Different range views
export const DailyView: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <GanttProvider range="daily">
        <GanttHeader>
          <GanttSidebarHeader>
            <div className="flex h-full items-center px-4 font-medium">
              Daily View
            </div>
          </GanttSidebarHeader>
          <GanttContentHeader
            title="Daily Timeline"
            columns={30}
            renderHeaderItem={(index) => (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-muted-foreground text-xs">
                  {format(addDays(today, index - 15), 'EEE')}
                </div>
                <div className="font-medium">
                  {format(addDays(today, index - 15), 'dd')}
                </div>
              </div>
            )}
          />
        </GanttHeader>

        <GanttSidebar>
          <GanttSidebarGroup name="Tasks">
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>

        <GanttTimeline>
          <GanttColumns
            columns={60}
            isColumnSecondary={(index) => index % 2 === 0}
          />
          <GanttToday />

          <GanttFeatureList>
            <GanttFeatureRow features={features}>
              {(feature) => (
                <GanttFeatureItem
                  key={feature.id}
                  {...feature}
                  className="rounded-md border"
                  style={{ backgroundColor: feature.status.color }}
                >
                  <GanttFeatureItemCard id={feature.id}>
                    <div className="p-2 font-medium text-white text-xs">
                      {feature.name}
                    </div>
                  </GanttFeatureItemCard>
                </GanttFeatureItem>
              )}
            </GanttFeatureRow>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    </div>
  ),
};

// Quarterly view
export const QuarterlyView: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <GanttProvider range="quarterly">
        <GanttHeader>
          <GanttSidebarHeader>
            <div className="flex h-full items-center px-4 font-medium">
              Quarterly View
            </div>
          </GanttSidebarHeader>
          <GanttContentHeader
            title="Quarterly Timeline"
            columns={8}
            renderHeaderItem={(index) => {
              const quarterDate = addMonths(today, (index - 4) * 3);
              const quarterNum = Math.floor(quarterDate.getMonth() / 3) + 1;
              return (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="text-muted-foreground text-xs">
                    Q{quarterNum}
                  </div>
                  <div className="font-medium">
                    {format(quarterDate, 'yyyy')}
                  </div>
                </div>
              );
            }}
          />
        </GanttHeader>

        <GanttSidebar>
          <GanttSidebarGroup name="Tasks">
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>

        <GanttTimeline>
          <GanttColumns
            columns={16}
            isColumnSecondary={(index) => index % 2 === 0}
          />
          <GanttToday />

          <GanttFeatureList>
            <GanttFeatureRow features={features}>
              {(feature) => (
                <GanttFeatureItem
                  key={feature.id}
                  {...feature}
                  className="rounded-md border"
                  style={{ backgroundColor: feature.status.color }}
                >
                  <GanttFeatureItemCard id={feature.id}>
                    <div className="p-2 font-medium text-white text-xs">
                      {feature.name}
                    </div>
                  </GanttFeatureItemCard>
                </GanttFeatureItem>
              )}
            </GanttFeatureRow>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    </div>
  ),
};

// Grouped features
export const GroupedFeatures: Story = {
  render: () => {
    // Group features by status
    const groupedFeatures = statuses.map((status) => ({
      status,
      features: features.filter((feature) => feature.status.id === status.id),
    }));

    return (
      <div className="h-[600px] w-full">
        <GanttProvider range="monthly">
          <GanttHeader>
            <GanttSidebarHeader>
              <div className="flex h-full items-center px-4 font-medium">
                Grouped by Status
              </div>
            </GanttSidebarHeader>
            <GanttContentHeader
              title="Timeline"
              columns={12}
              renderHeaderItem={(index) => (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="text-muted-foreground text-xs">
                    {format(addMonths(today, index - 6), 'MMM')}
                  </div>
                  <div className="font-medium">
                    {format(addMonths(today, index - 6), 'yyyy')}
                  </div>
                </div>
              )}
            />
          </GanttHeader>

          <GanttSidebar>
            {groupedFeatures.map((group) => (
              <GanttSidebarGroup key={group.status.id} name={group.status.name}>
                {group.features.map((feature) => (
                  <GanttSidebarItem key={feature.id} feature={feature} />
                ))}
              </GanttSidebarGroup>
            ))}
          </GanttSidebar>

          <GanttTimeline>
            <GanttColumns
              columns={365}
              isColumnSecondary={(index) => index % 2 === 0}
            />
            <GanttToday />

            <GanttFeatureList>
              {groupedFeatures.map((group) => (
                <GanttFeatureRow
                  key={group.status.id}
                  features={group.features}
                >
                  {(feature) => (
                    <GanttFeatureItem
                      key={feature.id}
                      {...feature}
                      className="rounded-md border"
                      style={{ backgroundColor: feature.status.color }}
                    >
                      <GanttFeatureItemCard id={feature.id}>
                        <div className="p-2 font-medium text-white text-xs">
                          {feature.name}
                        </div>
                      </GanttFeatureItemCard>
                    </GanttFeatureItem>
                  )}
                </GanttFeatureRow>
              ))}
            </GanttFeatureList>
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

// Custom zoom level
export const CustomZoom: Story = {
  render: () => {
    const [zoom, setZoom] = useState(100);

    return (
      <div className="h-[600px] w-full">
        <div className="bg-muted p-4">
          <label className="font-medium text-sm">
            Zoom: {zoom}%
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <GanttProvider range="monthly" zoom={zoom}>
          <GanttHeader>
            <GanttSidebarHeader>
              <div className="flex h-full items-center px-4 font-medium">
                Custom Zoom
              </div>
            </GanttSidebarHeader>
            <GanttContentHeader
              title="Timeline"
              columns={12}
              renderHeaderItem={(index) => (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="text-muted-foreground text-xs">
                    {format(addMonths(today, index - 6), 'MMM')}
                  </div>
                  <div className="font-medium">
                    {format(addMonths(today, index - 6), 'yyyy')}
                  </div>
                </div>
              )}
            />
          </GanttHeader>

          <GanttSidebar>
            <GanttSidebarGroup name="Tasks">
              {features.map((feature) => (
                <GanttSidebarItem key={feature.id} feature={feature} />
              ))}
            </GanttSidebarGroup>
          </GanttSidebar>

          <GanttTimeline>
            <GanttColumns
              columns={365}
              isColumnSecondary={(index) => index % 2 === 0}
            />
            <GanttToday />

            <GanttFeatureList>
              <GanttFeatureRow features={features}>
                {(feature) => (
                  <GanttFeatureItem
                    key={feature.id}
                    {...feature}
                    className="rounded-md border"
                    style={{ backgroundColor: feature.status.color }}
                  >
                    <GanttFeatureItemCard id={feature.id}>
                      <div className="p-2 font-medium text-white text-xs">
                        {feature.name}
                      </div>
                    </GanttFeatureItemCard>
                  </GanttFeatureItem>
                )}
              </GanttFeatureRow>
            </GanttFeatureList>
          </GanttTimeline>
        </GanttProvider>
      </div>
    );
  },
};

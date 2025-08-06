# xGantt Component

A comprehensive Gantt chart UI component for project management and timeline visualization.

## Features

- Three timeline views: daily, monthly, and quarterly
- Draggable features with resizable start and end dates
- Custom markers for important milestones
- Group features into categories
- Dynamic timeline that extends when scrolling to edges
- Customizable zoom levels
- "Today" indicator
- Support for adding new features and markers

## Usage

```tsx
import { xGantt } from '@/packages/design-system/ui/xgantt';

export function MyGanttChart() {
  const features = [
    {
      id: '1',
      name: 'Feature 1',
      startAt: new Date('2025-08-01'),
      endAt: new Date('2025-08-10'),
      status: { name: 'In Progress', color: '#f59e0b' }
    },
    // ...more features
  ];
  
  const markers = [
    {
      id: 'milestone-1',
      label: 'Release',
      date: new Date('2025-08-15')
    },
    // ...more markers
  ];

  const handleFeatureMove = (id, startAt, endAt) => {
    // Update feature dates
  };
  
  const handleAddFeature = (date) => {
    // Add a new feature starting at the given date
  };

  return (
    <xGantt 
      range="monthly" 
      zoom={100}
      onAddItem={handleAddFeature}
    >
      <xGantt.GanttSidebar>
        {features.map((feature) => (
          <xGantt.GanttSidebarItem
            key={feature.id}
            feature={feature}
          />
        ))}
      </xGantt.GanttSidebar>
      <xGantt.GanttTimeline>
        <xGantt.GanttHeader />
        <xGantt.GanttFeatureList>
          <xGantt.GanttFeatureRow
            features={features}
            onMove={handleFeatureMove}
          />
        </xGantt.GanttFeatureList>
        <xGantt.GanttToday />
        {markers.map((marker) => (
          <xGantt.GanttMarker
            key={marker.id}
            {...marker}
          />
        ))}
      </xGantt.GanttTimeline>
    </xGantt>
  );
}
```

## API Reference

### GanttProvider

The main container component for the Gantt chart.

```tsx
<xGantt
  range="monthly"
  zoom={100}
  onAddItem={(date) => {}}
>
  {/* Gantt chart content */}
</xGantt>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `range` | `'daily' \| 'monthly' \| 'quarterly'` | `'monthly'` | The time scale of the chart |
| `zoom` | `number` | `100` | Zoom level percentage (50-200) |
| `onAddItem` | `(date: Date) => void` | `undefined` | Callback when a new feature is requested |
| `className` | `string` | `undefined` | Additional CSS class |

### GanttSidebar

Left sidebar displaying feature names and durations.

```tsx
<xGantt.GanttSidebar>
  {/* Sidebar content */}
</xGantt.GanttSidebar>
```

### GanttSidebarItem

Individual feature item in the sidebar.

```tsx
<xGantt.GanttSidebarItem
  feature={feature}
  onSelectItem={(id) => {}}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `feature` | `GanttFeature` | Feature data |
| `onSelectItem` | `(id: string) => void` | Callback when item is selected |
| `className` | `string` | Additional CSS class |

### GanttSidebarGroup

Group of features in the sidebar.

```tsx
<xGantt.GanttSidebarGroup name="Development">
  {/* Sidebar items */}
</xGantt.GanttSidebarGroup>
```

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Group name |
| `className` | `string` | Additional CSS class |

### GanttTimeline

Container for the timeline view.

```tsx
<xGantt.GanttTimeline>
  {/* Timeline content */}
</xGantt.GanttTimeline>
```

### GanttHeader

Displays the timeline headers (days, months, quarters).

```tsx
<xGantt.GanttHeader />
```

### GanttFeatureList

Container for feature items in the timeline.

```tsx
<xGantt.GanttFeatureList>
  {/* Feature rows */}
</xGantt.GanttFeatureList>
```

### GanttFeatureRow

Displays a row of features in the timeline.

```tsx
<xGantt.GanttFeatureRow
  features={features}
  onMove={(id, startAt, endAt) => {}}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `features` | `GanttFeature[]` | Array of features to display |
| `onMove` | `(id: string, startAt: Date, endAt: Date \| null) => void` | Callback when feature is moved |
| `children` | `(feature: GanttFeature) => ReactNode` | Custom renderer for feature |
| `className` | `string` | Additional CSS class |

### GanttFeatureListGroup

Group of features in the timeline.

```tsx
<xGantt.GanttFeatureListGroup>
  {/* Feature rows */}
</xGantt.GanttFeatureListGroup>
```

### GanttMarker

Vertical marker for important dates.

```tsx
<xGantt.GanttMarker
  id="marker-1"
  label="Milestone"
  date={new Date()}
  onRemove={(id) => {}}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique ID |
| `label` | `string` | Marker label |
| `date` | `Date` | Marker date |
| `onRemove` | `(id: string) => void` | Callback when removal is requested |
| `className` | `string` | Additional CSS class |

### GanttToday

Special marker for the current date.

```tsx
<xGantt.GanttToday />
```

### GanttCreateMarkerTrigger

UI element to create new markers.

```tsx
<xGantt.GanttCreateMarkerTrigger onCreateMarker={(date) => {}} />
```

| Prop | Type | Description |
|------|------|-------------|
| `onCreateMarker` | `(date: Date) => void` | Callback when a marker is requested |
| `className` | `string` | Additional CSS class |

## Types

### GanttFeature

```typescript
type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date | null;
  status: {
    name: string;
    color: string;
  };
};
```

### Range

```typescript
type Range = 'daily' | 'monthly' | 'quarterly';
```

### GanttMarkerProps

```typescript
type GanttMarkerProps = {
  id: string;
  label: string;
  date: Date;
};
```

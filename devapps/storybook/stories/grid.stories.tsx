/**
 * SPDX-License-Identifier: MIT
 */

import { Grid } from '@repo/design-system/ui/grid';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Grid> = {
  title: 'UI/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

/**
 * Basic grid with equal columns.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl rounded-lg bg-background p-4">
      <Grid container spacing={2}>
        <Grid size={6}>
          <div className="h-16 rounded-md bg-primary/20 p-4 text-center">
            size=6
          </div>
        </Grid>
        <Grid size={6}>
          <div className="h-16 rounded-md bg-primary/20 p-4 text-center">
            size=6
          </div>
        </Grid>
        <Grid size={4}>
          <div className="h-16 rounded-md bg-primary/20 p-4 text-center">
            size=4
          </div>
        </Grid>
        <Grid size={4}>
          <div className="h-16 rounded-md bg-primary/20 p-4 text-center">
            size=4
          </div>
        </Grid>
        <Grid size={4}>
          <div className="h-16 rounded-md bg-primary/20 p-4 text-center">
            size=4
          </div>
        </Grid>
      </Grid>
    </div>
  ),
};

/**
 * Grid with different spacing options.
 */
export const Spacing: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-8 rounded-lg bg-background p-4">
      <div>
        <h3 className="mb-2 font-medium">Spacing: 1</h3>
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={3}>
              <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                Item {item}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Spacing: 4</h3>
        <Grid container spacing={4}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={3}>
              <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                Item {item}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Row Spacing: 4, Column Spacing: 2</h3>
        <Grid container rowSpacing={4} columnSpacing={2}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid key={item} size={3}>
              <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                Item {item}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  ),
};

/**
 * Responsive grid that changes layout based on screen size.
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-3xl rounded-lg bg-background p-4">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <div className="h-16 rounded-md bg-primary/20 p-2 text-center text-sm">
            xs=12 sm=6 md=4 lg=3
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <div className="h-16 rounded-md bg-primary/20 p-2 text-center text-sm">
            xs=12 sm=6 md=4 lg=3
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <div className="h-16 rounded-md bg-primary/20 p-2 text-center text-sm">
            xs=12 sm=6 md=4 lg=3
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <div className="h-16 rounded-md bg-primary/20 p-2 text-center text-sm">
            xs=12 sm=6 md=4 lg=3
          </div>
        </Grid>
      </Grid>
    </div>
  ),
};

/**
 * Grid with different alignment options.
 */
export const Alignment: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-8 rounded-lg bg-background p-4">
      <div>
        <h3 className="mb-2 font-medium">Justify Content: start</h3>
        <Grid
          container
          spacing={2}
          justifyContent="start"
          className="bg-muted/30 p-2"
        >
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              1
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              2
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              3
            </div>
          </Grid>
        </Grid>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Justify Content: center</h3>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          className="bg-muted/30 p-2"
        >
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              1
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              2
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              3
            </div>
          </Grid>
        </Grid>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Justify Content: between</h3>
        <Grid
          container
          spacing={2}
          justifyContent="between"
          className="bg-muted/30 p-2"
        >
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              1
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              2
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              3
            </div>
          </Grid>
        </Grid>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Align Items: center</h3>
        <Grid
          container
          spacing={2}
          alignItems="center"
          className="h-24 bg-muted/30 p-2"
        >
          <Grid size={4}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              Height: 12
            </div>
          </Grid>
          <Grid size={4}>
            <div className="h-16 rounded-md bg-primary/20 p-2 text-center text-sm">
              Height: 16
            </div>
          </Grid>
          <Grid size={4}>
            <div className="h-8 rounded-md bg-primary/20 p-2 text-center text-sm">
              Height: 8
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  ),
};

/**
 * Nested grids for complex layouts.
 */
export const NestedGrids: Story = {
  render: () => (
    <div className="w-full max-w-3xl rounded-lg bg-background p-4">
      <Grid container spacing={2}>
        <Grid size={6}>
          <div className="rounded-md bg-muted p-2">
            <h3 className="mb-2 font-medium text-sm">Nested Grid</h3>
            <Grid container spacing={1}>
              <Grid size={6}>
                <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                  Nested 1
                </div>
              </Grid>
              <Grid size={6}>
                <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                  Nested 2
                </div>
              </Grid>
              <Grid size={12}>
                <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
                  Nested 3
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid size={6}>
          <div className="h-full rounded-md bg-muted p-2">
            <h3 className="mb-2 font-medium text-sm">Main Content</h3>
            <div className="h-[calc(100%-2rem)] rounded-md bg-primary/20 p-2 text-center">
              Content Area
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  ),
};

/**
 * Auto-layout grid where items automatically fill the available space.
 */
export const AutoLayout: Story = {
  render: () => (
    <div className="w-full max-w-3xl rounded-lg bg-background p-4">
      <div className="space-y-4">
        <h3 className="font-medium">Equal Width</h3>
        <Grid container spacing={2}>
          <Grid size="auto">
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              Auto
            </div>
          </Grid>
          <Grid size="auto">
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              Auto
            </div>
          </Grid>
          <Grid size="auto">
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              Auto
            </div>
          </Grid>
        </Grid>

        <h3 className="font-medium">Mixed Sizing</h3>
        <Grid container spacing={2}>
          <Grid size={4}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              size=4
            </div>
          </Grid>
          <Grid size="auto">
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              Auto (fills space)
            </div>
          </Grid>
          <Grid size={2}>
            <div className="h-12 rounded-md bg-primary/20 p-2 text-center text-sm">
              size=2
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  ),
};

/**
 * Complete example showing a complex layout with the Grid component.
 */
export const CompleteExample: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-lg bg-background p-6">
      <Grid container spacing={{ xs: 2, md: 3 }} className="mb-6">
        <Grid size={12}>
          <div className="rounded-md bg-muted p-4">
            <h2 className="font-semibold text-xl">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to your application dashboard
            </p>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} className="mb-6">
        {['Users', 'Revenue', 'Traffic', 'Conversion'].map((item, index) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 3 }}>
            <div className="h-24 rounded-md bg-muted p-4">
              <h3 className="font-medium">{item}</h3>
              <div className="mt-2 font-bold text-2xl">
                {index === 0 && '1,294'}
                {index === 1 && '$34,743'}
                {index === 2 && '45.2K'}
                {index === 3 && '24.3%'}
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <div className="h-64 rounded-md bg-muted p-4">
            <h3 className="mb-4 font-medium">Analytics Overview</h3>
            <div className="flex h-[calc(100%-2rem)] items-end justify-around">
              {[35, 65, 45, 80, 55, 70, 60].map((height, index) => (
                <div
                  key={index}
                  className="w-8 rounded-t-md bg-primary/40"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <div className="h-64 rounded-md bg-muted p-4">
            <h3 className="mb-4 font-medium">Recent Activity</h3>
            <div className="space-y-3">
              {[
                'User signup',
                'New order',
                'Payment received',
                'Item shipped',
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  ),
};

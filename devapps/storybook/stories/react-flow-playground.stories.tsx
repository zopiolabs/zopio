/**
 * SPDX-License-Identifier: MIT
 */

import { ReactFlowPlayground } from '@repo/design-system/ui/xyflow';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { BackgroundVariant } from 'reactflow';

const meta: Meta<typeof ReactFlowPlayground> = {
  title: 'ui/ReactFlowPlayground',
  component: ReactFlowPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive React Flow playground with sidebar configuration, node editing, and fullscreen capabilities.',
      },
    },
  },
  argTypes: {
    showHeader: {
      control: 'boolean',
      description: 'Show/hide the header with title and action buttons',
    },
    showControls: {
      control: 'boolean',
      description: 'Show/hide the ReactFlow controls (zoom, fullscreen)',
    },
    showBackground: {
      control: 'boolean',
      description: 'Show/hide the background pattern',
    },
    backgroundVariant: {
      control: 'select',
      options: [
        BackgroundVariant.Dots,
        BackgroundVariant.Lines,
        BackgroundVariant.Cross,
      ],
      description: 'Background pattern variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReactFlowPlayground>;

export const Default: Story = {
  args: {
    showHeader: true,
    showControls: true,
    showBackground: true,
    backgroundVariant: BackgroundVariant.Dots,
  },
};

export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    showControls: true,
    showBackground: true,
    backgroundVariant: BackgroundVariant.Dots,
  },
};

export const MinimalView: Story = {
  args: {
    showHeader: false,
    showControls: false,
    showBackground: false,
  },
};

export const LinesBackground: Story = {
  args: {
    showHeader: true,
    showControls: true,
    showBackground: true,
    backgroundVariant: BackgroundVariant.Lines,
  },
};

export const CrossBackground: Story = {
  args: {
    showHeader: true,
    showControls: true,
    showBackground: true,
    backgroundVariant: BackgroundVariant.Cross,
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'border-4 border-pink-500 rounded-lg',
    showHeader: true,
    showControls: true,
    showBackground: true,
    backgroundVariant: BackgroundVariant.Dots,
  },
};

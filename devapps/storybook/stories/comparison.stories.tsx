/**
 * SPDX-License-Identifier: MIT
 */

import {
  Comparison,
  ComparisonHandle,
  ComparisonItem,
} from '@repo/design-system/ui/comparison';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

/**
 * The Comparison component provides a slider-based interface for comparing two items in an overlay.
 *
 * ## Features
 * - Compare two items side by side with a draggable slider
 * - Support for both hover and drag modes
 * - Smooth animations
 * - Touch and mouse event support
 * - Customizable slider appearance
 * - Responsive design that works with any content
 *
 * ## Accessibility
 * - ARIA attributes for screen readers
 * - Keyboard navigable slider
 * - Proper focus management
 */
const meta = {
  title: 'UI/Comparison',
  component: Comparison,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Comparison>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default comparison component with drag mode.
 * This example demonstrates comparing two images with a draggable slider.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Comparison className="h-[400px] rounded-lg border">
        <ComparisonItem
          className="flex items-center justify-center bg-blue-100"
          position="left"
        >
          <div className="font-bold text-2xl text-blue-800">Before</div>
        </ComparisonItem>
        <ComparisonItem
          className="flex items-center justify-center bg-green-100"
          position="right"
        >
          <div className="font-bold text-2xl text-green-800">After</div>
        </ComparisonItem>
        <ComparisonHandle />
      </Comparison>
    </div>
  ),
};

/**
 * Comparison component in hover mode.
 * This example shows how the slider responds to mouse hover position instead of drag.
 */
export const HoverMode: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Comparison className="h-[400px] rounded-lg border" mode="hover">
        <ComparisonItem
          className="flex items-center justify-center bg-purple-100"
          position="left"
        >
          <div className="font-bold text-2xl text-purple-800">Version A</div>
        </ComparisonItem>
        <ComparisonItem
          className="flex items-center justify-center bg-amber-100"
          position="right"
        >
          <div className="font-bold text-2xl text-amber-800">Version B</div>
        </ComparisonItem>
        <ComparisonHandle />
      </Comparison>
    </div>
  ),
};

/**
 * Comparison component with event handlers.
 * This example demonstrates how to use the onDragStart and onDragEnd event handlers.
 */
export const WithEventHandlers: Story = {
  render: () => {
    const [dragState, setDragState] = useState('Idle');

    return (
      <div className="w-full max-w-3xl space-y-4">
        <div className="text-center font-medium">
          Current State: {dragState}
        </div>
        <Comparison
          className="h-[400px] rounded-lg border"
          onDragStart={() => setDragState('Dragging')}
          onDragEnd={() => setDragState('Released')}
        >
          <ComparisonItem
            className="flex items-center justify-center bg-slate-100"
            position="left"
          >
            <div className="font-bold text-2xl text-slate-800">Original</div>
          </ComparisonItem>
          <ComparisonItem
            className="flex items-center justify-center bg-rose-100"
            position="right"
          >
            <div className="font-bold text-2xl text-rose-800">Modified</div>
          </ComparisonItem>
          <ComparisonHandle />
        </Comparison>
      </div>
    );
  },
};

/**
 * Comparison component with custom handle.
 * This example shows how to customize the appearance of the slider handle.
 */
export const CustomHandle: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Comparison className="h-[400px] rounded-lg border">
        <ComparisonItem
          className="flex items-center justify-center bg-gray-100"
          position="left"
        >
          <div className="font-bold text-2xl text-gray-800">Light Theme</div>
        </ComparisonItem>
        <ComparisonItem
          className="flex items-center justify-center bg-gray-800"
          position="right"
        >
          <div className="font-bold text-2xl text-gray-100">Dark Theme</div>
        </ComparisonItem>
        <ComparisonHandle className="w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500">
          <div className="-translate-x-1/2 absolute rounded-full bg-white p-2 shadow-lg">
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          </div>
        </ComparisonHandle>
      </Comparison>
    </div>
  ),
};

/**
 * Responsive comparison component.
 * This example demonstrates how the component adapts to different screen sizes.
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Comparison className="h-[300px] rounded-lg border md:h-[400px] lg:h-[500px]">
        <ComparisonItem
          className="flex items-center justify-center bg-teal-100"
          position="left"
        >
          <div className="font-bold text-2xl text-teal-800">Mobile View</div>
        </ComparisonItem>
        <ComparisonItem
          className="flex items-center justify-center bg-indigo-100"
          position="right"
        >
          <div className="font-bold text-2xl text-indigo-800">Desktop View</div>
        </ComparisonItem>
        <ComparisonHandle />
      </Comparison>
    </div>
  ),
};

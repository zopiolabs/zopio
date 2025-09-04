/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Comparison,
  ComparisonAfter,
  ComparisonBefore,
  useComparison,
} from '@repo/design-system/ui/comparison';

/**
 * A slider-based component for comparing two items in an overlay.
 */
const meta: Meta<typeof Comparison> = {
  title: 'ui/Comparison',
  component: Comparison,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the comparison container',
    },
    mode: {
      control: { type: 'select' },
      options: ['drag', 'hover'],
      description: 'Interaction mode for the slider',
    },
    defaultPosition: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Default position of the slider (0-100)',
    },
    position: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Controlled position of the slider (0-100)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable interaction with the slider',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default comparison with drag mode.
 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Comparison>
        <ComparisonAfter>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 font-semibold text-white">
            After
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 font-semibold text-white">
            Before
          </div>
        </ComparisonBefore>
      </Comparison>
    </div>
  ),
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <div className="w-80">
          <Comparison size="sm">
            <ComparisonAfter>
              <div className="flex h-full w-full items-center justify-center bg-red-400 font-semibold text-white">
                After
              </div>
            </ComparisonAfter>
            <ComparisonBefore>
              <div className="flex h-full w-full items-center justify-center bg-blue-400 font-semibold text-white">
                Before
              </div>
            </ComparisonBefore>
          </Comparison>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <div className="w-80">
          <Comparison size="md">
            <ComparisonAfter>
              <div className="flex h-full w-full items-center justify-center bg-green-400 font-semibold text-white">
                After
              </div>
            </ComparisonAfter>
            <ComparisonBefore>
              <div className="flex h-full w-full items-center justify-center bg-purple-400 font-semibold text-white">
                Before
              </div>
            </ComparisonBefore>
          </Comparison>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <div className="w-80">
          <Comparison size="lg">
            <ComparisonAfter>
              <div className="flex h-full w-full items-center justify-center bg-yellow-400 font-semibold text-white">
                After
              </div>
            </ComparisonAfter>
            <ComparisonBefore>
              <div className="flex h-full w-full items-center justify-center bg-pink-400 font-semibold text-white">
                Before
              </div>
            </ComparisonBefore>
          </Comparison>
        </div>
      </div>
    </div>
  ),
};

/**
 * Hover mode interaction.
 */
export const HoverMode: Story = {
  render: () => (
    <div className="w-96">
      <p className="mb-4 text-muted-foreground text-sm">
        Move your mouse over the image to reveal the comparison
      </p>
      <Comparison mode="hover">
        <ComparisonAfter>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 font-semibold text-white">
            Original
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 font-semibold text-white">
            Enhanced
          </div>
        </ComparisonBefore>
      </Comparison>
    </div>
  ),
};

/**
 * Controlled comparison with external controls.
 */
export const Controlled: Story = {
  render: () => {
    const [position, setPosition] = useState(50);

    return (
      <div className="w-96 space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">Position:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-muted-foreground text-sm">
            {position}%
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPosition(0)}>
            0%
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPosition(25)}>
            25%
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPosition(50)}>
            50%
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPosition(75)}>
            75%
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPosition(100)}>
            100%
          </Button>
        </div>

        <Comparison position={position} onPositionChange={setPosition}>
          <ComparisonAfter>
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-slate-400 to-slate-600 font-semibold text-white">
              Grayscale
            </div>
          </ComparisonAfter>
          <ComparisonBefore>
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-rose-400 to-pink-500 font-semibold text-white">
              Colorful
            </div>
          </ComparisonBefore>
        </Comparison>
      </div>
    );
  },
};

/**
 * With event handlers.
 */
export const WithEventHandlers: Story = {
  render: () => {
    const [_position, setPosition] = useState(50);
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (event: string) => {
      setEvents((prev) => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: ${event}`,
      ]);
    };

    return (
      <div className="w-96 space-y-4">
        <Comparison
          defaultPosition={50}
          onPositionChange={(pos) => {
            setPosition(pos);
            addEvent(`Position changed to ${Math.round(pos)}%`);
          }}
        >
          <ComparisonAfter>
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 font-semibold text-white">
              Version 2.0
            </div>
          </ComparisonAfter>
          <ComparisonBefore>
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 font-semibold text-white">
              Version 1.0
            </div>
          </ComparisonBefore>
        </Comparison>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Events:</h4>
          <div className="h-20 overflow-y-auto rounded bg-muted p-2 font-mono text-xs">
            {events.length === 0 ? (
              <span className="text-muted-foreground">No events yet...</span>
            ) : (
              events.map((event, index) => <div key={index}>{event}</div>)
            )}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <p className="mb-4 text-muted-foreground text-sm">
        This comparison is disabled and cannot be interacted with
      </p>
      <Comparison disabled defaultPosition={30}>
        <ComparisonAfter>
          <div className="flex h-full w-full items-center justify-center bg-gray-400 font-semibold text-white">
            Disabled
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full items-center justify-center bg-gray-600 font-semibold text-white">
            State
          </div>
        </ComparisonBefore>
      </Comparison>
    </div>
  ),
};

/**
 * Image comparison example.
 */
export const ImageComparison: Story = {
  render: () => (
    <div className="w-96">
      <h4 className="mb-2 font-medium text-sm">Before vs After</h4>
      <Comparison>
        <ComparisonAfter>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
            <div className="text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-500" />
              <span className="text-gray-700 text-sm">Original Photo</span>
            </div>
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
            <div className="text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="text-blue-700 text-sm">Enhanced Photo</span>
            </div>
          </div>
        </ComparisonBefore>
      </Comparison>
    </div>
  ),
};

/**
 * Product comparison.
 */
export const ProductComparison: Story = {
  render: () => (
    <div className="w-96">
      <h4 className="mb-2 font-medium text-sm">Product Versions</h4>
      <Comparison defaultPosition={70}>
        <ComparisonAfter>
          <div className="flex h-full w-full flex-col justify-center bg-gradient-to-br from-red-100 to-red-200 p-6">
            <h3 className="mb-2 font-semibold text-red-800">Basic Plan</h3>
            <ul className="space-y-1 text-red-700 text-sm">
              <li>• 5 Projects</li>
              <li>• 10GB Storage</li>
              <li>• Email Support</li>
              <li>• Basic Analytics</li>
            </ul>
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full flex-col justify-center bg-gradient-to-br from-green-100 to-green-200 p-6">
            <h3 className="mb-2 font-semibold text-green-800">Pro Plan</h3>
            <ul className="space-y-1 text-green-700 text-sm">
              <li>• Unlimited Projects</li>
              <li>• 100GB Storage</li>
              <li>• Priority Support</li>
              <li>• Advanced Analytics</li>
              <li>• Team Collaboration</li>
            </ul>
          </div>
        </ComparisonBefore>
      </Comparison>
    </div>
  ),
};

/**
 * Using the comparison context hook.
 */
const ComparisonInfo = () => {
  const { position, isDragging, mode } = useComparison();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="font-medium">Position:</span>
          <div>{Math.round(position)}%</div>
        </div>
        <div>
          <span className="font-medium">Dragging:</span>
          <div>{isDragging ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Mode:</span>
          <div className="capitalize">{mode}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <div className="w-96">
      <Comparison>
        <ComparisonAfter>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-white">
            Context Demo
          </div>
        </ComparisonAfter>
        <ComparisonBefore>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-violet-400 to-purple-500 font-semibold text-white">
            Live Updates
          </div>
        </ComparisonBefore>
        <ComparisonInfo />
      </Comparison>
    </div>
  ),
};

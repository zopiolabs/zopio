/**
 * SPDX-License-Identifier: MIT
 */

import { Label } from '@repo/design-system/ui/label';
import { Rating } from '@repo/design-system/ui/rating';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heart, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

/**
 * A star rating component with keyboard navigation and hover effects.
 */
const meta: Meta<typeof Rating> = {
  title: 'ui/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Current rating value',
    },
    max: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum number of stars',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the rating component',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Make the rating read-only',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the rating component',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default rating component.
 */
export const Default: Story = {
  args: {
    defaultValue: 3,
    max: 5,
  },
};

/**
 * Different sizes of rating components.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Rating size="sm" defaultValue={4} />
      <Rating size="md" defaultValue={4} />
      <Rating size="lg" defaultValue={4} />
      <Rating size="xl" defaultValue={4} />
    </div>
  ),
};

/**
 * Read-only rating display.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Rating value={5} readOnly />
      <Rating value={4.5} readOnly />
      <Rating value={3} readOnly />
      <Rating value={1.5} readOnly />
    </div>
  ),
};

/**
 * Disabled rating component.
 */
export const Disabled: Story = {
  args: {
    defaultValue: 3,
    disabled: true,
  },
};

/**
 * Custom number of stars.
 */
export const CustomMax: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">3 stars:</span>
        <Rating max={3} defaultValue={2} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">10 stars:</span>
        <Rating max={10} defaultValue={7} />
      </div>
    </div>
  ),
};

/**
 * Custom icons.
 */
export const CustomIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Hearts:</span>
        <Rating icon={Heart} defaultValue={4} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Thumbs up:</span>
        <Rating icon={ThumbsUp} defaultValue={3} />
      </div>
    </div>
  ),
};

/**
 * Controlled rating component.
 */
export const Controlled: Story = {
  render: () => {
    const [rating, setRating] = useState(3);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rating: {rating}/5</span>
        </div>
        <Rating value={rating} onValueChange={setRating} />
        <button
          type="button"
          onClick={() => setRating(0)}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          Reset
        </button>
      </div>
    );
  },
};

/**
 * Rating in a form context.
 */
export const InForm: Story = {
  render: () => (
    <form className="space-y-4 rounded-lg border p-6">
      <h3 className="font-semibold text-lg">Product Review</h3>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Overall Rating</Label>
        <Rating name="overall" defaultValue={4} />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Quality</Label>
        <Rating name="quality" defaultValue={5} />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">Value for Money</Label>
        <Rating name="value" defaultValue={3} />
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  ),
};

/**
 * Rating with labels and descriptions.
 */
export const WithLabels: Story = {
  render: () => {
    const [rating, setRating] = useState(0);

    const labels = {
      1: 'Terrible',
      2: 'Poor',
      3: 'Average',
      4: 'Good',
      5: 'Excellent',
    };

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg">How was your experience?</h3>
          <p className="text-muted-foreground text-sm">
            {rating > 0
              ? labels[rating as keyof typeof labels]
              : 'Select a rating'}
          </p>
        </div>

        <div className="flex justify-center">
          <Rating value={rating} onValueChange={setRating} size="lg" />
        </div>
      </div>
    );
  },
};

/**
 * Product rating cards example.
 */
export const ProductCards: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <h4 className="font-semibold">Wireless Headphones</h4>
        <div className="mt-2 flex items-center gap-2">
          <Rating value={4} readOnly size="sm" />
          <span className="text-muted-foreground text-sm">(127 reviews)</span>
        </div>
        <p className="mt-2 font-bold text-2xl">$99.99</p>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="font-semibold">Smart Watch</h4>
        <div className="mt-2 flex items-center gap-2">
          <Rating value={5} readOnly size="sm" />
          <span className="text-muted-foreground text-sm">(89 reviews)</span>
        </div>
        <p className="mt-2 font-bold text-2xl">$299.99</p>
      </div>
    </div>
  ),
};

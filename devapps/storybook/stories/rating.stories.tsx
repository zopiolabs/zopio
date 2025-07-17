import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import { Rating, RatingButton } from '@repo/design-system/ui/rating';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { HeartIcon, StarIcon, ThumbsUpIcon } from 'lucide-react';
/**
 * SPDX-License-Identifier: MIT
 */
import type * as React from 'react';
import { useState } from 'react';

/**
 * A star rating component with keyboard navigation and hover effects.
 * Supports customizable number of stars, size, and icons.
 */
const meta = {
  title: 'ui/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Default value for uncontrolled component',
    },
    value: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Current value for controlled component',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the rating is read-only',
    },
  },
  args: {
    defaultValue: 3,
    readOnly: false,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic rating component with default settings.
 */
export const Default: Story = {
  render: (args) => (
    <Rating {...args}>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  ),
};

/**
 * Rating component with custom colors.
 */
export const CustomColors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label>Default</Label>
        <Rating {...args}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Yellow</Label>
        <Rating {...args}>
          <RatingButton className="text-yellow-500" />
          <RatingButton className="text-yellow-500" />
          <RatingButton className="text-yellow-500" />
          <RatingButton className="text-yellow-500" />
          <RatingButton className="text-yellow-500" />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Red</Label>
        <Rating {...args}>
          <RatingButton className="text-red-500" />
          <RatingButton className="text-red-500" />
          <RatingButton className="text-red-500" />
          <RatingButton className="text-red-500" />
          <RatingButton className="text-red-500" />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Blue</Label>
        <Rating {...args}>
          <RatingButton className="text-blue-500" />
          <RatingButton className="text-blue-500" />
          <RatingButton className="text-blue-500" />
          <RatingButton className="text-blue-500" />
          <RatingButton className="text-blue-500" />
        </Rating>
      </div>
    </div>
  ),
};

/**
 * Rating component with different sizes.
 */
export const CustomSize: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label>Small</Label>
        <Rating {...args}>
          <RatingButton size={16} />
          <RatingButton size={16} />
          <RatingButton size={16} />
          <RatingButton size={16} />
          <RatingButton size={16} />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Medium</Label>
        <Rating {...args}>
          <RatingButton size={24} />
          <RatingButton size={24} />
          <RatingButton size={24} />
          <RatingButton size={24} />
          <RatingButton size={24} />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Large</Label>
        <Rating {...args}>
          <RatingButton size={32} />
          <RatingButton size={32} />
          <RatingButton size={32} />
          <RatingButton size={32} />
          <RatingButton size={32} />
        </Rating>
      </div>
    </div>
  ),
};

/**
 * Rating component with custom icons.
 */
export const CustomIcon: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label>Stars</Label>
        <Rating {...args}>
          <RatingButton icon={<StarIcon />} />
          <RatingButton icon={<StarIcon />} />
          <RatingButton icon={<StarIcon />} />
          <RatingButton icon={<StarIcon />} />
          <RatingButton icon={<StarIcon />} />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Hearts</Label>
        <Rating {...args}>
          <RatingButton icon={<HeartIcon />} className="text-red-500" />
          <RatingButton icon={<HeartIcon />} className="text-red-500" />
          <RatingButton icon={<HeartIcon />} className="text-red-500" />
          <RatingButton icon={<HeartIcon />} className="text-red-500" />
          <RatingButton icon={<HeartIcon />} className="text-red-500" />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>Thumbs Up</Label>
        <Rating {...args}>
          <RatingButton icon={<ThumbsUpIcon />} className="text-blue-500" />
          <RatingButton icon={<ThumbsUpIcon />} className="text-blue-500" />
          <RatingButton icon={<ThumbsUpIcon />} className="text-blue-500" />
          <RatingButton icon={<ThumbsUpIcon />} className="text-blue-500" />
          <RatingButton icon={<ThumbsUpIcon />} className="text-blue-500" />
        </Rating>
      </div>
    </div>
  ),
};

/**
 * Controlled rating component.
 */
export const Controlled: Story = {
  render: () => {
    // This is a client component that needs useState
    const ControlledExample = () => {
      const [value, setValue] = useState(3);

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label>Rating: {value}</Label>
            <Rating value={value} onValueChange={setValue}>
              <RatingButton />
              <RatingButton />
              <RatingButton />
              <RatingButton />
              <RatingButton />
            </Rating>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                onClick={() => setValue(rating)}
                className={`rounded-md px-3 py-1 ${
                  value === rating
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {rating}
              </Button>
            ))}
          </div>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

/**
 * Read-only rating component.
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label>1 Star</Label>
        <Rating {...args} defaultValue={1}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>2 Stars</Label>
        <Rating {...args} defaultValue={2}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>3 Stars</Label>
        <Rating {...args} defaultValue={3}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>4 Stars</Label>
        <Rating {...args} defaultValue={4}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <Label>5 Stars</Label>
        <Rating {...args} defaultValue={5}>
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
          <RatingButton />
        </Rating>
      </div>
    </div>
  ),
};

/**
 * Form integration example.
 */
export const FormIntegration: Story = {
  render: () => {
    const FormExample = () => {
      const [rating, setRating] = useState(0);
      const [submitted, setSubmitted] = useState(false);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, you would submit the form data here
      };

      return (
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rate your experience</Label>
              <Rating
                value={rating}
                onValueChange={setRating}
                className="block"
              >
                <RatingButton />
                <RatingButton />
                <RatingButton />
                <RatingButton />
                <RatingButton />
              </Rating>
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Submit Rating
            </button>
            {submitted && (
              <div className="mt-4 rounded-md bg-green-100 p-4 text-green-800">
                Thank you for your {rating}-star rating!
              </div>
            )}
          </form>
        </div>
      );
    };

    return <FormExample />;
  },
};

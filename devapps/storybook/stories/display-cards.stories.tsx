/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Shield, Star, Zap } from 'lucide-react';

import {
  type DisplayCard,
  DisplayCards,
} from '@repo/design-system/ui/display-cards';

/**
 * A visually appealing stacked card layout with hover animations and grayscale effects.
 */
const meta: Meta<typeof DisplayCards> = {
  title: 'ui/DisplayCards',
  component: DisplayCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'stacked', 'grid'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    cardVariant: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
    },
    cardHover: {
      control: 'select',
      options: ['none', 'lift', 'scale', 'glow'],
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    cardVariant: 'default',
    cardHover: 'lift',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleCards: DisplayCard[] = [
  {
    id: '1',
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    title: 'Featured Project',
    description:
      'A comprehensive design system with components and guidelines for modern applications.',
    date: '2024-01-15',
  },
  {
    id: '2',
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    title: 'Performance Optimized',
    description:
      'Lightning-fast components built with performance and accessibility in mind.',
    date: '2024-01-10',
  },
  {
    id: '3',
    icon: <Shield className="h-5 w-5 text-green-500" />,
    title: 'Enterprise Ready',
    description:
      'Battle-tested components used by thousands of developers worldwide.',
    date: '2024-01-05',
  },
];

const cardsWithImages: DisplayCard[] = [
  {
    id: '1',
    title: 'Mountain Landscape',
    description:
      'Beautiful mountain scenery with pristine lakes and snow-capped peaks.',
    date: '2024-01-15',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Ocean Sunset',
    description:
      'Stunning sunset over the ocean with vibrant colors reflecting on the water.',
    date: '2024-01-10',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Forest Path',
    description:
      'A serene forest path leading through tall trees and dappled sunlight.',
    date: '2024-01-05',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  },
];

/**
 * Default display cards with icons.
 */
export const Default: Story = {
  args: {
    cards: sampleCards,
  },
};

/**
 * Cards with images and grayscale hover effects.
 */
export const WithImages: Story = {
  args: {
    cards: cardsWithImages,
  },
};

/**
 * Compact card variant for denser layouts.
 */
export const Compact: Story = {
  args: {
    cards: sampleCards,
    cardVariant: 'compact',
  },
};

/**
 * Minimal card style with reduced padding.
 */
export const Minimal: Story = {
  args: {
    cards: sampleCards,
    cardVariant: 'minimal',
  },
};

/**
 * Stacked layout for mobile-first design.
 */
export const Stacked: Story = {
  args: {
    cards: sampleCards,
    variant: 'stacked',
  },
};

/**
 * Grid layout with more columns.
 */
export const Grid: Story = {
  args: {
    cards: [...sampleCards, ...sampleCards],
    variant: 'grid',
  },
};

/**
 * Scale hover effect.
 */
export const ScaleHover: Story = {
  args: {
    cards: sampleCards,
    cardHover: 'scale',
  },
};

/**
 * Glow hover effect.
 */
export const GlowHover: Story = {
  args: {
    cards: sampleCards,
    cardHover: 'glow',
  },
};

/**
 * No hover effects.
 */
export const NoHover: Story = {
  args: {
    cards: sampleCards,
    cardHover: 'none',
  },
};

/**
 * Large spacing between cards.
 */
export const LargeSpacing: Story = {
  args: {
    cards: sampleCards,
    size: 'lg',
  },
};

/**
 * Small spacing for compact layouts.
 */
export const SmallSpacing: Story = {
  args: {
    cards: sampleCards,
    size: 'sm',
  },
};

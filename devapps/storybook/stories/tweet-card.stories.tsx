/**
 * SPDX-License-Identifier: MIT
 */

import { TweetCard } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * The TweetCard component displays Twitter/X posts with user information, content, media, and engagement metrics.
 * It supports both standard and compact layouts, with options to hide media and choose between Twitter and X branding.
 */
const meta: Meta<typeof TweetCard> = {
  title: 'ui/TweetCard',
  component: TweetCard,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'The Twitter/X tweet ID to display',
    },
    compact: {
      control: 'boolean',
      description: 'Display the card in a compact layout',
    },
    hideMedia: {
      control: 'boolean',
      description: 'Hide media attachments (photos/videos)',
    },
    iconVariant: {
      control: { type: 'radio' },
      options: ['twitter', 'x'],
      description: 'Choose between Twitter or X branding',
    },
  },
  args: {
    id: '1631001919165440002',
    compact: false,
    hideMedia: false,
    iconVariant: 'twitter',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default display of a tweet with full content and media.
 */
export const Default: Story = {
  args: {
    id: '1631001919165440002',
  },
};

/**
 * A compact version of the tweet card, useful for embedding in smaller spaces.
 */
export const Compact: Story = {
  args: {
    id: '1631001919165440002',
    compact: true,
  },
};

/**
 * Tweet card with media content hidden.
 */
export const NoMedia: Story = {
  args: {
    id: '1631001919165440002',
    hideMedia: true,
  },
};

/**
 * Tweet card with X branding instead of Twitter.
 */
export const XBranding: Story = {
  args: {
    id: '1631001919165440002',
    iconVariant: 'x',
  },
};

/**
 * Example of a tweet with video content.
 */
export const WithVideo: Story = {
  args: {
    id: '1722701136106197462',
  },
};

/**
 * Example of a tweet with multiple images.
 */
export const WithMultipleImages: Story = {
  args: {
    id: '1518624521003556865',
  },
};

/**
 * Example showing how the component handles loading states.
 */
export const Loading: Story = {
  args: {
    // Using an invalid ID to force loading state
    id: 'loading-example',
  },
};

/**
 * Example showing how the component handles error states.
 */
export const ErrorState: Story = {
  args: {
    // Using an invalid ID to force error state
    id: 'invalid-id-12345',
  },
};

/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { TweetCard, type TweetData } from '@repo/design-system/ui/tweet-card';

/**
 * A versatile Tweet card component for displaying Twitter/X posts with support for videos, photos, and interactive elements.
 */
const meta: Meta<typeof TweetCard> = {
  title: 'ui/TweetCard',
  component: TweetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'full'],
    },
    showMetrics: {
      control: 'boolean',
    },
    showMedia: {
      control: 'boolean',
    },
    showActions: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    showMetrics: true,
    showMedia: true,
    showActions: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleTweet: TweetData = {
  id: '1234567890',
  author: {
    name: 'John Doe',
    username: 'johndoe',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
  content:
    'Just shipped a new feature! 🚀 The new timeline component is now live with smooth animations and better accessibility. Check it out and let me know what you think!',
  timestamp: '2024-01-15T10:30:00Z',
  metrics: {
    likes: 1234,
    retweets: 89,
    replies: 45,
  },
};

const longContentTweet: TweetData = {
  id: '1234567891',
  author: {
    name: 'Sarah Wilson',
    username: 'sarahwilson',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    verified: false,
  },
  content:
    'Working on a new design system has been an incredible journey. The amount of thought that goes into each component, from accessibility to performance, is mind-blowing. Every pixel matters, every interaction counts. Building for scale while maintaining simplicity is the real challenge.',
  timestamp: '2024-01-14T15:45:00Z',
  metrics: {
    likes: 567,
    retweets: 23,
    replies: 12,
  },
};

const tweetWithImage: TweetData = {
  id: '1234567892',
  author: {
    name: 'Alex Chen',
    username: 'alexchen',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
  content: 'Beautiful sunset from my office window today 🌅',
  timestamp: '2024-01-13T18:20:00Z',
  metrics: {
    likes: 2456,
    retweets: 234,
    replies: 89,
  },
  media: [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Beautiful sunset over mountains',
    },
  ],
};

const viralTweet: TweetData = {
  id: '1234567893',
  author: {
    name: 'Tech Insider',
    username: 'techinsider',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    verified: true,
  },
  content:
    'BREAKING: New AI breakthrough changes everything we know about machine learning 🤖⚡',
  timestamp: '2024-01-12T09:15:00Z',
  metrics: {
    likes: 45600,
    retweets: 12300,
    replies: 2890,
  },
};

/**
 * The default tweet card with all features enabled.
 */
export const Default: Story = {
  args: {
    tweet: sampleTweet,
  },
};

/**
 * Compact variant for space-efficient display.
 */
export const Compact: Story = {
  args: {
    tweet: sampleTweet,
    variant: 'compact',
  },
};

/**
 * Tweet with long content to demonstrate text wrapping.
 */
export const LongContent: Story = {
  args: {
    tweet: longContentTweet,
  },
};

/**
 * Tweet with image media attachment.
 */
export const WithImage: Story = {
  args: {
    tweet: tweetWithImage,
  },
};

/**
 * Tweet without metrics displayed.
 */
export const NoMetrics: Story = {
  args: {
    tweet: sampleTweet,
    showMetrics: false,
  },
};

/**
 * Tweet without action buttons.
 */
export const NoActions: Story = {
  args: {
    tweet: sampleTweet,
    showActions: false,
  },
};

/**
 * Tweet with hidden media.
 */
export const HiddenMedia: Story = {
  args: {
    tweet: tweetWithImage,
    showMedia: false,
  },
};

/**
 * Viral tweet with high engagement numbers.
 */
export const Viral: Story = {
  args: {
    tweet: viralTweet,
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    tweet: sampleTweet,
    size: 'sm',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    tweet: sampleTweet,
    size: 'lg',
  },
};

/**
 * Full width variant.
 */
export const FullWidth: Story = {
  args: {
    tweet: sampleTweet,
    size: 'full',
  },
  parameters: {
    layout: 'padded',
  },
};

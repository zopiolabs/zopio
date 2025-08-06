/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui';
import { NumberFlow } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';

const meta: Meta<typeof NumberFlow> = {
  title: 'UI/NumberFlow',
  component: NumberFlow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberFlow>;

/**
 * Basic usage of NumberFlow component with default settings
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    useEffect(() => {
      // Update value every 3 seconds to demonstrate animation
      const interval = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 500));
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="font-bold text-2xl">
        <NumberFlow
          value={value}
          transformTiming={{ duration: 800, easing: 'ease-out' }}
        />
      </div>
    );
  },
};

/**
 * Currency format with USD
 */
export const Currency: Story = {
  render: () => {
    const [value, setValue] = useState(1234.56);

    useEffect(() => {
      // Update value every 3 seconds to demonstrate animation
      const interval = setInterval(() => {
        setValue((prev) => prev + Math.random() * 100);
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="font-bold text-2xl">
        <NumberFlow
          value={value}
          format={{
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }}
          transformTiming={{ duration: 500, easing: 'ease-out' }}
        />
      </div>
    );
  },
};

/**
 * Compact notation for large numbers
 */
export const CompactNotation: Story = {
  render: () => {
    const [value, setValue] = useState(1234567);

    useEffect(() => {
      // Update value every 3 seconds to demonstrate animation
      const interval = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 100000));
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="font-bold text-2xl">
        <NumberFlow
          value={value}
          format={{
            notation: 'compact',
            compactDisplay: 'short',
            roundingMode: 'trunc',
          }}
          willChange={true}
          continuous={true}
          transformTiming={{ duration: 600, easing: 'ease-in-out' }}
        />
      </div>
    );
  },
};

/**
 * Percentage format
 */
export const Percentage: Story = {
  render: () => {
    const [value, setValue] = useState(0.8567);

    useEffect(() => {
      // Update value every 3 seconds to demonstrate animation
      const interval = setInterval(() => {
        setValue((prev) => Math.min(1, prev + Math.random() * 0.05));
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="font-bold text-2xl">
        <NumberFlow
          value={value}
          format={{
            style: 'percent',
            minimumFractionDigits: 1,
          }}
          transformTiming={{ duration: 500, easing: 'ease-out' }}
        />
      </div>
    );
  },
};

/**
 * Interactive example with controls
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    const increase = () => {
      setValue((prev) => prev + Math.floor(Math.random() * 500));
    };

    const decrease = () => {
      setValue((prev) => Math.max(0, prev - Math.floor(Math.random() * 500)));
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="font-bold text-2xl">
          <NumberFlow
            value={value}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }}
            transformTiming={{ duration: 500, easing: 'ease-out' }}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={decrease} variant="outline">
            Decrease
          </Button>
          <Button onClick={increase} variant="default">
            Increase
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Auto-updating counter
 */
export const AutoUpdating: Story = {
  render: () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="font-bold text-3xl">
        <NumberFlow
          value={count}
          continuous={true}
          transformTiming={{ duration: 300, easing: 'ease-in-out' }}
        />
      </div>
    );
  },
};

/**
 * Social card with animated stats
 */
export const SocialCard: Story = {
  render: () => {
    const [likes, setLikes] = useState(1024);
    const [followers, setFollowers] = useState(45678);
    const [isLiked, setIsLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleLike = () => {
      if (isLiked) {
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    };

    const toggleFollow = () => {
      if (isFollowing) {
        setFollowers((prev) => prev - 1);
      } else {
        setFollowers((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    };

    return (
      <div className="w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <div>
            <h3 className="font-semibold">@prismui</h3>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              UI Component Library
            </p>
          </div>
        </div>

        <div className="mb-4 flex justify-between">
          <div className="text-center">
            <div className="font-bold text-lg">
              <NumberFlow
                value={likes}
                format={{ notation: 'compact', compactDisplay: 'short' }}
                transformTiming={{ duration: 400, easing: 'ease-out' }}
              />
            </div>
            <div className="text-gray-500 text-xs dark:text-gray-400">
              Likes
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">
              <NumberFlow
                value={followers}
                format={{ notation: 'compact', compactDisplay: 'short' }}
                transformTiming={{ duration: 400, easing: 'ease-out' }}
              />
            </div>
            <div className="text-gray-500 text-xs dark:text-gray-400">
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">
              <NumberFlow value={210} />
            </div>
            <div className="text-gray-500 text-xs dark:text-gray-400">
              Posts
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleLike}
            variant={isLiked ? 'default' : 'outline'}
            className="flex-1"
          >
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          <Button
            onClick={toggleFollow}
            variant={isFollowing ? 'default' : 'outline'}
            className="flex-1"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Dark theme example
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => {
    const [value, setValue] = useState(9876);

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 100 - 50));
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="rounded-xl bg-gray-900 p-6">
        <h3 className="mb-2 text-gray-400 text-sm">Current Value</h3>
        <div className="font-bold text-3xl text-white">
          <NumberFlow
            value={value}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }}
            transformTiming={{ duration: 800, easing: 'ease-out' }}
            continuous={true}
          />
        </div>
      </div>
    );
  },
};

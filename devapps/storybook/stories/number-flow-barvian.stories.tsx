/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui';
import {
  NumberFlowBarvian,
  NumberFlowBarvianGroup,
  continuous,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useEffect, useState } from 'react';

const meta: Meta<typeof NumberFlowBarvian> = {
  title: 'UI/NumberFlowBarvian',
  component: NumberFlowBarvian,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberFlowBarvian>;

/**
 * Basic usage of NumberFlowBarvian component with default settings
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    // Click anywhere to update value
    const handleClick = React.useCallback(() => {
      setValue((prev) => prev + Math.floor(Math.random() * 500));
    }, []);

    useEffect(() => {
      // Add click event listener to document
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="font-bold text-2xl">
        <NumberFlowBarvian
          value={value}
          transformTiming={{ duration: 800, easing: 'ease-out' }}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
      </div>
    );
  },
};

/**
 * Continuous animation that shows in-between values during transitions
 */
export const ContinuousAnimation: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    const handleClick = React.useCallback(() => {
      setValue((prev) => prev + Math.floor(Math.random() * 500));
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="font-bold text-2xl">
        <NumberFlowBarvian
          value={value}
          plugins={[continuous]}
          transformTiming={{ duration: 800, easing: 'ease-out' }}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
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

    const handleClick = React.useCallback(() => {
      setValue((prev) => prev + Math.random() * 100);
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="font-bold text-2xl">
        <NumberFlowBarvian
          value={value}
          format={{
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }}
          transformTiming={{ duration: 500, easing: 'ease-out' }}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
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

    const handleClick = React.useCallback(() => {
      setValue((prev) => prev + Math.floor(Math.random() * 100000));
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="font-bold text-2xl">
        <NumberFlowBarvian
          value={value}
          format={{
            notation: 'compact',
            compactDisplay: 'short',
            // Note: roundingMode is not supported in current TypeScript Intl.NumberFormatOptions
            // Using maximumFractionDigits to achieve similar truncation effect
            maximumFractionDigits: 0,
          }}
          willChange={true}
          plugins={[continuous]}
          transformTiming={{ duration: 600, easing: 'ease-in-out' }}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
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

    const handleClick = React.useCallback(() => {
      setValue((prev) => Math.min(1, prev + Math.random() * 0.05));
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="font-bold text-2xl">
        <NumberFlowBarvian
          value={value}
          format={{
            style: 'percent',
            minimumFractionDigits: 2,
          }}
          transformTiming={{ duration: 700, easing: 'ease-in-out' }}
        />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
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
          <NumberFlowBarvian
            value={value}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }}
            plugins={[continuous]}
            transformTiming={{ duration: 500, easing: 'ease-out' }}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={increase} variant="default">
            Increase
          </Button>
          <Button onClick={decrease} variant="outline">
            Decrease
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Grouped number flows that sync their animations
 */
export const GroupedFlows: Story = {
  render: () => {
    const [price, setPrice] = useState(99.95);
    const [change, setChange] = useState(0.05);

    const updateValues = () => {
      const newPrice = Math.max(10, price + (Math.random() * 20 - 10));
      const priceChange = (newPrice - price) / price;
      setPrice(newPrice);
      setChange(priceChange);
    };

    return (
      <div className="flex flex-col items-center gap-6">
        <NumberFlowBarvianGroup>
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl">
              <NumberFlowBarvian
                value={price}
                format={{
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }}
                plugins={[continuous]}
                transformTiming={{ duration: 500, easing: 'ease-out' }}
              />
            </div>
            <div
              className={`${change >= 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
            >
              <NumberFlowBarvian
                value={change}
                format={{
                  style: 'percent',
                  minimumFractionDigits: 2,
                  signDisplay: 'always',
                }}
                plugins={[continuous]}
                transformTiming={{ duration: 500, easing: 'ease-out' }}
              />
            </div>
          </div>
        </NumberFlowBarvianGroup>
        <Button onClick={updateValues}>Update Values</Button>
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
              <NumberFlowBarvian
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
              <NumberFlowBarvian
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
              <NumberFlowBarvian value={210} />
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
          <NumberFlowBarvian
            value={value}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }}
            transformTiming={{ duration: 800, easing: 'ease-out' }}
            plugins={[continuous]}
          />
        </div>
      </div>
    );
  },
};

/**
 * Different trend directions
 */
export const TrendDirections: Story = {
  render: () => {
    const [value, setValue] = useState(5000);
    const [trend, setTrend] = useState<number>(1);

    const updateValue = () => {
      setValue((prev) => prev + (Math.random() > 0.5 ? 1000 : -1000));
    };

    const cycleTrend = () => {
      setTrend((prev) => {
        if (prev === 1) {
          return 0;
        }
        if (prev === 0) {
          return -1;
        }
        return 1;
      });
    };

    const getTrendLabel = () => {
      if (trend === 1) {
        return 'Up Only';
      }
      if (trend === -1) {
        return 'Down Only';
      }
      return 'Natural';
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="font-bold text-2xl">
          <NumberFlowBarvian
            value={value}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }}
            trend={trend}
            plugins={[continuous]}
            transformTiming={{ duration: 800, easing: 'ease-out' }}
          />
        </div>
        <div className="text-gray-500 text-sm">
          Current trend: {getTrendLabel()}
        </div>
        <div className="flex gap-2">
          <Button onClick={updateValue} variant="default">
            Change Value
          </Button>
          <Button onClick={cycleTrend} variant="outline">
            Change Trend
          </Button>
        </div>
      </div>
    );
  },
};

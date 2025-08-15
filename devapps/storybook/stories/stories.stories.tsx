/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Stories,
  StoriesControls,
  type StoryItem,
  useStories,
} from '@repo/design-system/ui/stories';

/**
 * A Stories component that displays a carousel of friends' stories in video, image or avatar format.
 */
const meta: Meta<typeof Stories> = {
  title: 'ui/Stories',
  component: Stories,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'expanded'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    aspectRatio: {
      control: { type: 'select' },
      options: ['portrait', 'square', 'landscape'],
    },
    showNavigation: {
      control: { type: 'boolean' },
    },
    autoPlay: {
      control: { type: 'boolean' },
    },
    loop: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample story data
const imageStories = [
  {
    id: '1',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1494790108755-2616c88c6d3d?w=400&h=600&fit=crop',
    author: {
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616c88c6d3d?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Beautiful sunset',
    timestamp: new Date('2024-01-15T18:30:00'),
    viewed: false,
  },
  {
    id: '2',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    author: {
      name: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Coffee time',
    timestamp: new Date('2024-01-15T09:15:00'),
    viewed: true,
  },
  {
    id: '3',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
    author: {
      name: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    title: 'City lights',
    timestamp: new Date('2024-01-14T22:45:00'),
    viewed: false,
  },
  {
    id: '4',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
    author: {
      name: 'Alex Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Mountain adventure',
    timestamp: new Date('2024-01-14T14:20:00'),
    viewed: true,
  },
  {
    id: '5',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    author: {
      name: 'Lisa Park',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Beach day',
    timestamp: new Date('2024-01-13T16:00:00'),
    viewed: false,
  },
];

const avatarStories = [
  {
    id: '1',
    type: 'avatar' as const,
    src: '',
    author: {
      name: 'John Doe',
      avatar:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
    },
    timestamp: new Date('2024-01-15T12:30:00'),
    viewed: false,
  },
  {
    id: '2',
    type: 'avatar' as const,
    src: '',
    author: {
      name: 'Jane Smith',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616c88c6d3d?w=100&h=100&fit=crop&crop=face',
    },
    timestamp: new Date('2024-01-15T10:15:00'),
    viewed: true,
  },
  {
    id: '3',
    type: 'avatar' as const,
    src: '',
    author: {
      name: 'Bob Johnson',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    timestamp: new Date('2024-01-14T18:45:00'),
    viewed: false,
  },
  {
    id: '4',
    type: 'avatar' as const,
    src: '',
    author: {
      name: 'Alice Brown',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    timestamp: new Date('2024-01-14T08:30:00'),
    viewed: true,
  },
];

const videoStories = [
  {
    id: '1',
    type: 'video' as const,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    author: {
      name: 'Video Creator',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Sample video',
    duration: 30,
    timestamp: new Date('2024-01-15T14:20:00'),
    viewed: false,
  },
  {
    id: '2',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    author: {
      name: 'Nature Lover',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    },
    title: 'Forest walk',
    timestamp: new Date('2024-01-15T11:10:00'),
    viewed: true,
  },
];

export const Default: Story = {
  args: {
    stories: imageStories,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <Stories variant="default" stories={imageStories.slice(0, 3)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Compact</h4>
        <Stories variant="compact" stories={imageStories.slice(0, 3)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Expanded</h4>
        <Stories variant="expanded" stories={imageStories.slice(0, 3)} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <Stories size="sm" stories={imageStories.slice(0, 4)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <Stories size="md" stories={imageStories.slice(0, 4)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <Stories size="lg" stories={imageStories.slice(0, 4)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Extra Large</h4>
        <Stories size="xl" stories={imageStories.slice(0, 4)} />
      </div>
    </div>
  ),
};

export const AspectRatios: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Portrait (9:16)</h4>
        <Stories aspectRatio="portrait" stories={imageStories.slice(0, 3)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Square (1:1)</h4>
        <Stories aspectRatio="square" stories={imageStories.slice(0, 3)} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Landscape (16:9)</h4>
        <Stories aspectRatio="landscape" stories={imageStories.slice(0, 3)} />
      </div>
    </div>
  ),
};

export const StoryImages: Story = {
  args: {
    stories: imageStories,
  },
};

export const StoryAvatars: Story = {
  args: {
    stories: avatarStories,
    aspectRatio: 'square',
  },
};

export const MixedContent: Story = {
  args: {
    stories: videoStories,
  },
};

export const WithoutNavigation: Story = {
  args: {
    stories: imageStories,
    showNavigation: false,
  },
};

export const AutoPlay: Story = {
  args: {
    stories: videoStories,
    autoPlay: true,
  },
};

export const NoLoop: Story = {
  args: {
    stories: imageStories.slice(0, 3),
    loop: false,
  },
};

export const SingleStory: Story = {
  args: {
    stories: [imageStories[0]],
  },
};

export const EmptyStories: Story = {
  args: {
    stories: [],
  },
};

export const Interactive: Story = {
  render: () => {
    const [stories, setStories] = useState(imageStories);
    const [clickedStory, setClickedStory] = useState<string | null>(null);

    const handleStoryClick = (story: StoryItem, _index: number) => {
      setClickedStory(story.id);
    };

    const handleStoryView = (story: StoryItem, _index: number) => {
      setStories((prev) =>
        prev.map((s) => (s.id === story.id ? { ...s, viewed: true } : s))
      );
    };

    const markAllAsViewed = () => {
      setStories((prev) => prev.map((s) => ({ ...s, viewed: true })));
    };

    const resetViewed = () => {
      setStories((prev) => prev.map((s) => ({ ...s, viewed: false })));
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={markAllAsViewed}
            className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
          >
            Mark All Viewed
          </Button>
          <Button
            onClick={resetViewed}
            className="rounded bg-secondary px-3 py-1 text-secondary-foreground text-sm hover:bg-secondary/90"
          >
            Reset Viewed
          </Button>
        </div>

        {clickedStory && (
          <div className="rounded bg-muted p-3 text-sm">
            Last clicked story:{' '}
            {stories.find((s) => s.id === clickedStory)?.author.name}
          </div>
        )}

        <Stories
          stories={stories}
          onStoryClick={handleStoryClick}
          onStoryView={handleStoryView}
        />
      </div>
    );
  },
};

const StoriesInfo = () => {
  const { currentIndex, isPlaying, isMuted, stories } = useStories();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Current Index:</span>
          <div>{currentIndex}</div>
        </div>
        <div>
          <span className="font-medium">Current Story:</span>
          <div>{stories[currentIndex]?.author.name || 'None'}</div>
        </div>
        <div>
          <span className="font-medium">Playing:</span>
          <div>{isPlaying ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Muted:</span>
          <div>{isMuted ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <Stories stories={videoStories} autoPlay>
      <StoriesInfo />
    </Stories>
  ),
};

export const WithControls: Story = {
  render: () => (
    <div className="space-y-4">
      <Stories stories={videoStories} showNavigation={false}>
        <div className="-translate-x-1/2 absolute bottom-4 left-1/2">
          <StoriesControls />
        </div>
      </Stories>
    </div>
  ),
};

export const LargeCollection: Story = {
  args: {
    stories: [
      ...imageStories,
      ...avatarStories.map((story) => ({ ...story, id: `avatar-${story.id}` })),
      ...videoStories.map((story) => ({ ...story, id: `video-${story.id}` })),
    ],
    size: 'md',
  },
};

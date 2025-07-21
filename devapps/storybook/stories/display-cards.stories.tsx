/**
 * SPDX-License-Identifier: MIT
 */

import {
  DisplayCard,
  DisplayCards,
} from '@repo/design-system/ui/display-cards';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  AudioLines,
  Bell,
  Calendar,
  Code,
  FileText,
  Headphones,
  Image,
  Mail,
  Music,
  Video,
} from 'lucide-react';

const meta: Meta<typeof DisplayCards> = {
  title: 'UI/DisplayCards',
  component: DisplayCards,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DisplayCards>;

/**
 * Default display cards with stacked layout and hover effects
 */
export const Default: Story = {
  render: () => <DisplayCards />,
};

/**
 * Single display card with default styling
 */
export const SingleCard: Story = {
  render: () => <DisplayCard />,
};

/**
 * Custom display card with different icon and colors
 */
export const CustomCard: Story = {
  render: () => (
    <DisplayCard
      icon={<Bell className="size-4 text-blue-300" />}
      title="Notifications"
      description="You have 3 unread messages"
      date="Today"
      iconClassName="text-blue-500"
      titleClassName="text-blue-500"
    />
  ),
};

/**
 * Multiple display cards with custom content
 */
export const CustomCards: Story = {
  render: () => (
    <DisplayCards
      cards={[
        {
          icon: <Music className="size-4 text-purple-300" />,
          title: 'Music',
          description: 'New album releases',
          date: 'Jul 21',
          iconClassName: 'text-purple-500',
          titleClassName: 'text-purple-500',
          className:
            "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
          icon: <Video className="size-4 text-red-300" />,
          title: 'Videos',
          description: 'Trending content',
          date: 'Yesterday',
          iconClassName: 'text-red-500',
          titleClassName: 'text-red-500',
          className:
            "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
          icon: <Image className="size-4 text-green-300" />,
          title: 'Photos',
          description: 'Your recent uploads',
          date: 'Last week',
          iconClassName: 'text-green-500',
          titleClassName: 'text-green-500',
          className:
            '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
        },
      ]}
    />
  ),
};

/**
 * Dark theme display cards
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="rounded-xl">
      <DisplayCards
        cards={[
          {
            icon: <Code className="size-4 text-cyan-300" />,
            title: 'Code',
            description: 'Recent repositories',
            date: '2 days ago',
            iconClassName: 'text-cyan-500',
            titleClassName: 'text-cyan-500',
            className:
              "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
          },
          {
            icon: <FileText className="size-4 text-amber-300" />,
            title: 'Documents',
            description: 'Shared with you',
            date: 'Last week',
            iconClassName: 'text-amber-500',
            titleClassName: 'text-amber-500',
            className:
              "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
          },
          {
            icon: <Calendar className="size-4 text-indigo-300" />,
            title: 'Calendar',
            description: 'Upcoming events',
            date: 'Next month',
            iconClassName: 'text-indigo-500',
            titleClassName: 'text-indigo-500',
            className:
              '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
          },
        ]}
      />
    </div>
  ),
};

/**
 * Different layout variations
 */
export const LayoutVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 font-medium text-lg">Single Row</h3>
        <div className="flex gap-6">
          <DisplayCard
            icon={<Mail className="size-4 text-rose-300" />}
            title="Inbox"
            description="5 new messages"
            date="Just now"
            iconClassName="text-rose-500"
            titleClassName="text-rose-500"
          />
          <DisplayCard
            icon={<Headphones className="size-4 text-violet-300" />}
            title="Podcasts"
            description="New episodes available"
            date="3 hours ago"
            iconClassName="text-violet-500"
            titleClassName="text-violet-500"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium text-lg">Grid Layout</h3>
        <div className="grid grid-cols-2 gap-6">
          <DisplayCard
            icon={<AudioLines className="size-4 text-emerald-300" />}
            title="Audio"
            description="Voice recordings"
            date="Yesterday"
            iconClassName="text-emerald-500"
            titleClassName="text-emerald-500"
          />
          <DisplayCard
            icon={<Bell className="size-4 text-blue-300" />}
            title="Alerts"
            description="System notifications"
            date="Today"
            iconClassName="text-blue-500"
            titleClassName="text-blue-500"
          />
          <DisplayCard
            icon={<Music className="size-4 text-purple-300" />}
            title="Playlists"
            description="Recently played"
            date="2 days ago"
            iconClassName="text-purple-500"
            titleClassName="text-purple-500"
          />
          <DisplayCard
            icon={<Video className="size-4 text-red-300" />}
            title="Recordings"
            description="Saved videos"
            date="Last week"
            iconClassName="text-red-500"
            titleClassName="text-red-500"
          />
        </div>
      </div>
    </div>
  ),
};

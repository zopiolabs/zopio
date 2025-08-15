/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Crown,
  Gift,
  Heart,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';

import {
  Announcement,
  AnnouncementContent,
  AnnouncementTag,
  AnnouncementTitle,
} from '@repo/design-system/ui/announcement';

/**
 * A compound badge designed to display an announcement.
 */
const meta: Meta<typeof Announcement> = {
  title: 'ui/Announcement',
  component: Announcement,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'destructive',
        'outline',
        'ghost',
      ],
      description: 'Visual variant of the announcement',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the announcement',
    },
    themed: {
      control: { type: 'boolean' },
      description: 'Whether to apply themed styling to child components',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default announcement.
 */
export const Default: Story = {
  args: {
    children: (
      <AnnouncementContent>
        <AnnouncementTag>NEW</AnnouncementTag>
        <AnnouncementTitle>Feature Release</AnnouncementTitle>
      </AnnouncementContent>
    ),
  },
};

/**
 * Different variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Announcement variant="default">
        <AnnouncementContent>
          <AnnouncementTag>NEW</AnnouncementTag>
          <AnnouncementTitle>Default</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="primary">
        <AnnouncementContent>
          <AnnouncementTag>HOT</AnnouncementTag>
          <AnnouncementTitle>Primary</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="secondary">
        <AnnouncementContent>
          <AnnouncementTag>INFO</AnnouncementTag>
          <AnnouncementTitle>Secondary</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="destructive">
        <AnnouncementContent>
          <AnnouncementTag>URGENT</AnnouncementTag>
          <AnnouncementTitle>Destructive</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="outline">
        <AnnouncementContent>
          <AnnouncementTag>UPDATE</AnnouncementTag>
          <AnnouncementTitle>Outline</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="ghost">
        <AnnouncementContent>
          <AnnouncementTag>BETA</AnnouncementTag>
          <AnnouncementTitle>Ghost</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>
    </div>
  ),
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Announcement size="sm">
        <AnnouncementContent>
          <AnnouncementTag>NEW</AnnouncementTag>
          <AnnouncementTitle>Small</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement size="md">
        <AnnouncementContent>
          <AnnouncementTag>NEW</AnnouncementTag>
          <AnnouncementTitle>Medium</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement size="lg">
        <AnnouncementContent>
          <AnnouncementTag>NEW</AnnouncementTag>
          <AnnouncementTitle>Large</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>
    </div>
  ),
};

/**
 * Themed announcements.
 */
export const Themed: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Announcement variant="primary" themed>
        <AnnouncementContent>
          <AnnouncementTag>NEW</AnnouncementTag>
          <AnnouncementTitle>Primary Themed</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="secondary" themed>
        <AnnouncementContent>
          <AnnouncementTag>UPDATE</AnnouncementTag>
          <AnnouncementTitle>Secondary Themed</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="destructive" themed>
        <AnnouncementContent>
          <AnnouncementTag>URGENT</AnnouncementTag>
          <AnnouncementTitle>Destructive Themed</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>
    </div>
  ),
};

/**
 * Different tag variants.
 */
export const TagVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="default">DEFAULT</AnnouncementTag>
            <AnnouncementTitle>Default Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="primary">PRIMARY</AnnouncementTag>
            <AnnouncementTitle>Primary Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="success">SUCCESS</AnnouncementTag>
            <AnnouncementTitle>Success Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>
      </div>

      <div className="flex flex-wrap gap-4">
        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="warning">WARNING</AnnouncementTag>
            <AnnouncementTitle>Warning Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="info">INFO</AnnouncementTag>
            <AnnouncementTitle>Info Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement>
          <AnnouncementContent>
            <AnnouncementTag variant="destructive">URGENT</AnnouncementTag>
            <AnnouncementTitle>Destructive Tag</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>
      </div>
    </div>
  ),
};

/**
 * Without tags.
 */
export const WithoutTag: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Announcement variant="primary">
        <AnnouncementContent>
          <Sparkles className="h-4 w-4" />
          <AnnouncementTitle>New Feature Available</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="secondary">
        <AnnouncementContent>
          <Star className="h-4 w-4" />
          <AnnouncementTitle>Premium Upgrade</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="destructive">
        <AnnouncementContent>
          <Zap className="h-4 w-4" />
          <AnnouncementTitle>Action Required</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>
    </div>
  ),
};

/**
 * With icons and tags.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Announcement variant="primary">
        <AnnouncementContent>
          <Gift className="h-4 w-4" />
          <AnnouncementTag variant="success">NEW</AnnouncementTag>
          <AnnouncementTitle>Gift Cards Available</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="secondary">
        <AnnouncementContent>
          <Trophy className="h-4 w-4" />
          <AnnouncementTag variant="warning">LIMITED</AnnouncementTag>
          <AnnouncementTitle>Achievement Unlocked</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>

      <Announcement variant="outline">
        <AnnouncementContent>
          <Crown className="h-4 w-4" />
          <AnnouncementTag variant="primary">VIP</AnnouncementTag>
          <AnnouncementTitle>Premium Member</AnnouncementTitle>
        </AnnouncementContent>
      </Announcement>
    </div>
  ),
};

/**
 * Real-world examples.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Announcement variant="primary" themed>
          <AnnouncementContent>
            <Rocket className="h-4 w-4" />
            <AnnouncementTag>LAUNCH</AnnouncementTag>
            <AnnouncementTitle>v2.0 Now Available</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement variant="secondary">
          <AnnouncementContent>
            <AnnouncementTag variant="info">BETA</AnnouncementTag>
            <AnnouncementTitle>Try New Dashboard</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>
      </div>

      <div className="flex flex-wrap gap-4">
        <Announcement variant="destructive" size="sm">
          <AnnouncementContent>
            <AnnouncementTag variant="destructive">URGENT</AnnouncementTag>
            <AnnouncementTitle>Security Update Required</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement variant="outline">
          <AnnouncementContent>
            <Heart className="h-4 w-4 text-red-500" />
            <AnnouncementTag variant="success">SPECIAL</AnnouncementTag>
            <AnnouncementTitle>Valentine's Day Sale</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>
      </div>
    </div>
  ),
};

/**
 * Interactive announcements.
 */
export const Interactive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Announcement
          variant="primary"
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <AnnouncementContent>
            <AnnouncementTag>CLICK</AnnouncementTag>
            <AnnouncementTitle>Interactive Announcement</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>

        <Announcement
          variant="secondary"
          className="cursor-pointer transition-shadow hover:shadow-lg"
        >
          <AnnouncementContent>
            <Sparkles className="h-4 w-4" />
            <AnnouncementTitle>Hover for Effect</AnnouncementTitle>
          </AnnouncementContent>
        </Announcement>
      </div>
    </div>
  ),
};

/**
 * Product announcements.
 */
export const ProductAnnouncements: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Product Updates</h3>
        <div className="flex flex-wrap gap-3">
          <Announcement variant="primary" themed size="lg">
            <AnnouncementContent>
              <AnnouncementTag>NEW</AnnouncementTag>
              <AnnouncementTitle>AI Assistant</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>

          <Announcement variant="secondary" themed>
            <AnnouncementContent>
              <AnnouncementTag>IMPROVED</AnnouncementTag>
              <AnnouncementTitle>Search Performance</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>

          <Announcement variant="outline">
            <AnnouncementContent>
              <AnnouncementTag variant="info">BETA</AnnouncementTag>
              <AnnouncementTitle>Mobile App</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Marketing Campaigns</h3>
        <div className="flex flex-wrap gap-3">
          <Announcement variant="destructive" size="sm">
            <AnnouncementContent>
              <AnnouncementTag variant="destructive">
                ENDING SOON
              </AnnouncementTag>
              <AnnouncementTitle>50% Off Sale</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>

          <Announcement variant="ghost">
            <AnnouncementContent>
              <Gift className="h-4 w-4" />
              <AnnouncementTag variant="success">FREE</AnnouncementTag>
              <AnnouncementTitle>Shipping Worldwide</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>

          <Announcement variant="primary">
            <AnnouncementContent>
              <Crown className="h-4 w-4" />
              <AnnouncementTag variant="warning">EXCLUSIVE</AnnouncementTag>
              <AnnouncementTitle>Member Benefits</AnnouncementTitle>
            </AnnouncementContent>
          </Announcement>
        </div>
      </div>
    </div>
  ),
};

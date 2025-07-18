/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight, Bell, Info } from 'lucide-react';

import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from '@repo/design-system/ui/announcement';

/**
 * A compound badge designed to display an announcement.
 */
const meta = {
  title: 'ui/Announcement',
  component: Announcement,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Announcement>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the announcement with tag and title.
 */
export const Default: Story = {
  render: () => (
    <Announcement>
      <AnnouncementTag>New</AnnouncementTag>
      <AnnouncementTitle>
        Check out our latest features <ArrowRight className="size-3" />
      </AnnouncementTitle>
    </Announcement>
  ),
};

/**
 * Announcement with themed styling for a more distinct appearance.
 */
export const Themed: Story = {
  render: () => (
    <Announcement themed>
      <AnnouncementTag>Update</AnnouncementTag>
      <AnnouncementTitle>
        <Info className="size-3" /> System maintenance scheduled
      </AnnouncementTitle>
    </Announcement>
  ),
};

/**
 * Announcement with a different variant.
 */
export const Secondary: Story = {
  render: () => (
    <Announcement variant="secondary">
      <AnnouncementTag>Alert</AnnouncementTag>
      <AnnouncementTitle>
        <Bell className="size-3" /> Important notification
      </AnnouncementTitle>
    </Announcement>
  ),
};

/**
 * Announcement without a tag component.
 */
export const WithoutTag: Story = {
  render: () => (
    <Announcement>
      <AnnouncementTitle>
        Simple announcement without tag <ArrowRight className="size-3" />
      </AnnouncementTitle>
    </Announcement>
  ),
};

/**
 * Destructive variant for important alerts.
 */
export const Destructive: Story = {
  render: () => (
    <Announcement variant="destructive">
      <AnnouncementTag>Critical</AnnouncementTag>
      <AnnouncementTitle>
        <Bell className="size-3" /> Action required immediately
      </AnnouncementTitle>
    </Announcement>
  ),
};

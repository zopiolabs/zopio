/**
 * SPDX-License-Identifier: MIT
 */

import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from '@repo/design-system/ui/banner';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { InfoIcon } from 'lucide-react';

const meta: Meta<typeof Banner> = {
  title: 'ui/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Banner>
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>Important message</BannerTitle>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Learn more</BannerAction>
          <BannerClose />
        </div>
      </Banner>
    </div>
  ),
};

export const Inset: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Banner inset>
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>Important message</BannerTitle>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Learn more</BannerAction>
          <BannerClose />
        </div>
      </Banner>
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Banner className="bg-destructive text-destructive-foreground">
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>Something's gone horribly wrong.</BannerTitle>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Fix it</BannerAction>
          <BannerClose />
        </div>
      </Banner>

      <Banner className="bg-warning text-warning-foreground">
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>You're almost out of disk space.</BannerTitle>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Clean up</BannerAction>
          <BannerClose />
        </div>
      </Banner>

      <Banner className="bg-success text-success-foreground">
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>You've been selected for a secret mission.</BannerTitle>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Accept</BannerAction>
          <BannerClose />
        </div>
      </Banner>
    </div>
  ),
};

export const WithoutActions: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Banner>
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <BannerTitle>This is a simple notification banner.</BannerTitle>
        </div>
        <BannerClose />
      </Banner>
    </div>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Banner>
        <div className="flex items-center gap-2">
          <BannerIcon icon={InfoIcon} />
          <div>
            <BannerTitle className="font-semibold">Custom Banner</BannerTitle>
            <p className="text-primary-foreground/80 text-xs">
              This banner has custom content with additional description text.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BannerAction>Primary</BannerAction>
          <BannerAction variant="ghost">Secondary</BannerAction>
          <BannerClose />
        </div>
      </Banner>
    </div>
  ),
};

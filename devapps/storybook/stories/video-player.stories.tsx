/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui/button';
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from '@repo/design-system/ui/video-player';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type React from 'react';
import { type CSSProperties, useState } from 'react';

/**
 * A composable, shadcn/ui styled video player component that uses the media-chrome library.
 * Features include customizable controls, responsive design, keyboard accessibility, and themeable styling.
 */
const meta = {
  title: 'ui/Video Player',
  component: VideoPlayer,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    style: {
      control: 'object',
      description: 'Additional inline styles',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof VideoPlayer>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample video URLs
const sampleVideoUrl =
  'https://storage.googleapis.com/media-session/big-buck-bunny/trailer.mp4';
const sampleVideoUrl2 =
  'https://storage.googleapis.com/media-session/sintel/trailer.mp4';

/**
 * Default video player with basic controls.
 */
export const Default: Story = {
  render: (args: React.ComponentProps<typeof VideoPlayer>) => (
    <div className="w-[640px]">
      <VideoPlayer {...args}>
        <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with seek buttons for forward and backward navigation.
 */
export const WithSeekButtons: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer>
        <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
        <VideoPlayerControlBar>
          <VideoPlayerSeekBackwardButton seekOffset={10} />
          <VideoPlayerPlayButton />
          <VideoPlayerSeekForwardButton seekOffset={10} />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with custom styling.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer
        style={
          {
            '--media-primary-color': 'var(--blue-500)',
            '--media-control-hover-background': 'var(--blue-100)',
          } as CSSProperties
        }
      >
        <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with minimal controls.
 */
export const MinimalControls: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer>
        <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerMuteButton />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with autoplay (muted for browser compatibility).
 */
export const Autoplay: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer>
        <VideoPlayerContent
          src={sampleVideoUrl}
          crossOrigin="anonymous"
          autoPlay
          muted
        />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with loop enabled.
 */
export const LoopEnabled: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer>
        <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" loop />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player with custom poster image.
 */
export const WithPoster: Story = {
  render: () => (
    <div className="w-[640px]">
      <VideoPlayer>
        <VideoPlayerContent
          src={sampleVideoUrl}
          crossOrigin="anonymous"
          poster="https://storage.googleapis.com/media-session/big-buck-bunny/poster.jpg"
        />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay />
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  ),
};

/**
 * Video player in different sizes.
 */
export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 font-medium text-sm">Small (320px)</h3>
        <div className="w-[320px]">
          <VideoPlayer>
            <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerTimeRange />
              <VideoPlayerMuteButton />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Medium (480px)</h3>
        <div className="w-[480px]">
          <VideoPlayer>
            <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerTimeRange />
              <VideoPlayerTimeDisplay />
              <VideoPlayerMuteButton />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Large (640px)</h3>
        <div className="w-[640px]">
          <VideoPlayer>
            <VideoPlayerContent src={sampleVideoUrl} crossOrigin="anonymous" />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerTimeRange />
              <VideoPlayerTimeDisplay />
              <VideoPlayerMuteButton />
              <VideoPlayerVolumeRange />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>
      </div>
    </div>
  ),
};

/**
 * Video player with multiple sources.
 */
export const MultipleVideos: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentVideo, setCurrentVideo] = useState(sampleVideoUrl);

    return (
      <div className="w-[640px] space-y-4">
        <VideoPlayer>
          <VideoPlayerContent src={currentVideo} crossOrigin="anonymous" />
          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            <VideoPlayerTimeRange />
            <VideoPlayerTimeDisplay />
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
          </VideoPlayerControlBar>
        </VideoPlayer>

        <div className="flex gap-2">
          <Button
            type="button"
            className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
            onClick={() => setCurrentVideo(sampleVideoUrl)}
          >
            Video 1
          </Button>
          <Button
            type="button"
            className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
            onClick={() => setCurrentVideo(sampleVideoUrl2)}
          >
            Video 2
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Video player in a responsive container.
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-[800px]">
      <div className="aspect-video">
        <VideoPlayer className="h-full w-full">
          <VideoPlayerContent
            src={sampleVideoUrl}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            <VideoPlayerTimeRange />
            <VideoPlayerTimeDisplay />
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </div>
      <p className="mt-2 text-muted-foreground text-sm">
        This player is responsive and will adapt to its container width
      </p>
    </div>
  ),
};

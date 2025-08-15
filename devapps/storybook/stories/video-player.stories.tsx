/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Download, Heart, MessageCircle, Share } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@repo/design-system/lib/utils';
import { Button } from '@repo/design-system/ui/button';
import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreen,
  VideoPlayerPlayButton,
  VideoPlayerPlaybackRate,
  VideoPlayerProgress,
  VideoPlayerSettings,
  VideoPlayerTime,
  VideoPlayerVolume,
  formatDuration,
  useVideoPlayer,
} from '@repo/design-system/ui/video-player';

/**
 * A comprehensive video player component with custom controls, fullscreen support, and playback features.
 */
const meta: Meta<typeof VideoPlayer> = {
  title: 'ui/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the video player',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'card'],
      description: 'Visual style variant',
    },
    src: {
      control: { type: 'text' },
      description: 'Video source URL',
    },
    poster: {
      control: { type: 'text' },
      description: 'Poster image URL',
    },
    autoPlay: {
      control: { type: 'boolean' },
      description: 'Auto-play video on load',
    },
    loop: {
      control: { type: 'boolean' },
      description: 'Loop video playback',
    },
    muted: {
      control: { type: 'boolean' },
      description: 'Start video muted',
    },
    controls: {
      control: { type: 'boolean' },
      description: 'Show video controls',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample video URLs for demonstration
const sampleVideo =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const samplePoster =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';

/**
 * Basic video player with default controls.
 */
export const Default: Story = {
  render: () => (
    <VideoPlayer src={sampleVideo} poster={samplePoster}>
      <VideoPlayerControls>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <VideoPlayerPlayButton />
            <VideoPlayerTime />
          </div>
          <div className="flex items-center gap-4">
            <VideoPlayerVolume />
            <VideoPlayerFullscreen />
          </div>
        </div>
        <div className="px-4 pb-4">
          <VideoPlayerProgress />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  ),
};

/**
 * Different video player sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <VideoPlayer size="sm" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-2">
              <VideoPlayerPlayButton />
              <div className="flex items-center gap-2">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-2 pb-2">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <VideoPlayer size="md" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-3">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-3 pb-3">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <VideoPlayer size="lg" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>
    </div>
  ),
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <VideoPlayer variant="default" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Minimal</h4>
        <VideoPlayer variant="minimal" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Card</h4>
        <VideoPlayer variant="card" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>
      </div>
    </div>
  ),
};

/**
 * Video player without custom controls.
 */
export const NoCustomControls: Story = {
  render: () => (
    <VideoPlayer src={sampleVideo} poster={samplePoster} controls={false}>
      <VideoPlayerControls position="overlay">
        <VideoPlayerPlayButton />
      </VideoPlayerControls>
    </VideoPlayer>
  ),
};

/**
 * Auto-playing muted video.
 */
export const AutoPlay: Story = {
  render: () => (
    <VideoPlayer src={sampleVideo} poster={samplePoster} autoPlay muted loop>
      <VideoPlayerControls>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <VideoPlayerPlayButton />
            <VideoPlayerTime />
          </div>
          <div className="flex items-center gap-4">
            <VideoPlayerVolume />
            <VideoPlayerFullscreen />
          </div>
        </div>
        <div className="px-4 pb-4">
          <VideoPlayerProgress />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  ),
};

/**
 * Video player with advanced settings.
 */
export const WithSettings: Story = {
  render: () => (
    <VideoPlayer src={sampleVideo} poster={samplePoster}>
      <VideoPlayerControls>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <VideoPlayerPlayButton />
            <VideoPlayerTime />
          </div>
          <div className="flex items-center gap-4">
            <VideoPlayerVolume />
            <VideoPlayerSettings>
              <VideoPlayerPlaybackRate />
            </VideoPlayerSettings>
            <VideoPlayerFullscreen />
          </div>
        </div>
        <div className="px-4 pb-4">
          <VideoPlayerProgress />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  ),
};

/**
 * Educational video player with course info.
 */
export const EducationalVideo: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <div className="rounded-lg bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="mb-2 font-bold text-xl">
              Introduction to React Hooks
            </h2>
            <p className="text-muted-foreground">
              Learn the fundamentals of React Hooks in this comprehensive
              tutorial.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-1 text-primary text-sm">
              Lesson 1
            </span>
            <span className="text-muted-foreground text-sm">15:30</span>
          </div>
        </div>

        <VideoPlayer size="lg" src={sampleVideo} poster={samplePoster}>
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerSettings>
                  <VideoPlayerPlaybackRate />
                </VideoPlayerSettings>
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
              <MessageCircle className="h-4 w-4" />
              Discuss
            </Button>
            <Button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Product demo video player.
 */
export const ProductDemo: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-4">
      <div className="overflow-hidden rounded-lg bg-card">
        <VideoPlayer
          size="full"
          variant="minimal"
          src={sampleVideo}
          poster={samplePoster}
        >
          <VideoPlayerControls>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <VideoPlayerPlayButton />
                <VideoPlayerTime />
              </div>
              <div className="flex items-center gap-4">
                <VideoPlayerVolume />
                <VideoPlayerFullscreen />
              </div>
            </div>
            <div className="px-4 pb-4">
              <VideoPlayerProgress />
            </div>
          </VideoPlayerControls>
        </VideoPlayer>

        <div className="p-6">
          <h3 className="mb-2 font-semibold text-lg">
            Product Feature Overview
          </h3>
          <p className="mb-4 text-muted-foreground">
            Watch this demo to see our latest features in action and learn how
            they can improve your workflow.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                Duration: 5:42
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                Updated: March 2024
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Try Now
              </Button>
              <Button className="rounded border px-4 py-2 hover:bg-muted">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Video playlist player.
 */
export const PlaylistPlayer: Story = {
  render: () => {
    const [currentVideo, setCurrentVideo] = useState(0);

    const playlist = [
      { title: 'Introduction', duration: '2:30', src: sampleVideo },
      { title: 'Getting Started', duration: '5:15', src: sampleVideo },
      { title: 'Advanced Features', duration: '8:45', src: sampleVideo },
      { title: 'Best Practices', duration: '6:20', src: sampleVideo },
    ];

    return (
      <div className="flex w-full max-w-5xl gap-6">
        <div className="flex-1">
          <VideoPlayer
            size="lg"
            src={playlist[currentVideo].src}
            poster={samplePoster}
          >
            <VideoPlayerControls>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <VideoPlayerPlayButton />
                  <VideoPlayerTime />
                </div>
                <div className="flex items-center gap-4">
                  <VideoPlayerVolume />
                  <VideoPlayerSettings>
                    <VideoPlayerPlaybackRate />
                  </VideoPlayerSettings>
                  <VideoPlayerFullscreen />
                </div>
              </div>
              <div className="px-4 pb-4">
                <VideoPlayerProgress />
              </div>
            </VideoPlayerControls>
          </VideoPlayer>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">
              {playlist[currentVideo].title}
            </h3>
            <p className="text-muted-foreground">
              Video {currentVideo + 1} of {playlist.length}
            </p>
          </div>
        </div>

        <div className="w-80">
          <h4 className="mb-3 font-semibold">Playlist</h4>
          <div className="space-y-2">
            {playlist.map((video, index) => (
              <Button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors',
                  currentVideo === index
                    ? 'border-primary bg-primary/10'
                    : 'hover:bg-muted'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{video.title}</div>
                    <div className="text-muted-foreground text-sm">
                      {index + 1}. {video.duration}
                    </div>
                  </div>
                  {currentVideo === index && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Live stream player.
 */
export const LiveStream: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <VideoPlayer size="lg" src={sampleVideo} poster={samplePoster}>
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 font-medium text-sm text-white">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
        </div>

        <VideoPlayerControls>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <VideoPlayerPlayButton />
              <span className="text-sm text-white">Live Stream</span>
            </div>
            <div className="flex items-center gap-4">
              <VideoPlayerVolume />
              <VideoPlayerFullscreen />
            </div>
          </div>
        </VideoPlayerControls>
      </VideoPlayer>

      <div className="rounded-lg bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-2 font-semibold text-lg">Weekly Tech Talk</h3>
            <p className="mb-4 text-muted-foreground">
              Join us for our weekly discussion about the latest in web
              development and React.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span>Started 15 minutes ago</span>
              <span>•</span>
              <span>1,234 viewers</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Follow
            </Button>
            <Button className="rounded border px-4 py-2 hover:bg-muted">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Video player with custom overlay controls.
 */
export const CustomOverlay: Story = {
  render: () => (
    <VideoPlayer src={sampleVideo} poster={samplePoster}>
      <VideoPlayerControls position="overlay">
        <div className="flex flex-col items-center gap-4">
          <VideoPlayerPlayButton className="h-16 w-16" />
          <div className="text-center text-white">
            <h3 className="mb-1 font-semibold text-lg">Click to Play</h3>
            <p className="text-sm opacity-80">High-quality video content</p>
          </div>
        </div>
      </VideoPlayerControls>

      <VideoPlayerControls position="bottom">
        <div className="flex items-center justify-between p-4">
          <VideoPlayerTime />
          <div className="flex items-center gap-4">
            <VideoPlayerVolume />
            <VideoPlayerFullscreen />
          </div>
        </div>
        <div className="px-4 pb-4">
          <VideoPlayerProgress />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  ),
};

// Custom video info component for stories
const VideoPlayerInfo = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
  } = useVideoPlayer();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="font-medium">Status:</span>
          <div>{isPlaying ? 'Playing' : 'Paused'}</div>
        </div>
        <div>
          <span className="font-medium">Time:</span>
          <div>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>
        </div>
        <div>
          <span className="font-medium">Volume:</span>
          <div>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</div>
        </div>
        <div>
          <span className="font-medium">Fullscreen:</span>
          <div>{isFullscreen ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Speed:</span>
          <div>{playbackRate}x</div>
        </div>
        <div>
          <span className="font-medium">Progress:</span>
          <div>
            {duration > 0
              ? `${Math.round((currentTime / duration) * 100)}%`
              : '0%'}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the video player context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <VideoPlayer src={sampleVideo} poster={samplePoster}>
        <VideoPlayerControls>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <VideoPlayerPlayButton />
              <VideoPlayerTime />
            </div>
            <div className="flex items-center gap-4">
              <VideoPlayerVolume />
              <VideoPlayerSettings>
                <VideoPlayerPlaybackRate />
              </VideoPlayerSettings>
              <VideoPlayerFullscreen />
            </div>
          </div>
          <div className="px-4 pb-4">
            <VideoPlayerProgress />
          </div>
        </VideoPlayerControls>
        <VideoPlayerInfo />
      </VideoPlayer>
    </div>
  ),
};

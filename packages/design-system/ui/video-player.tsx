/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  Download,
  Share,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";

const videoPlayerVariants = cva(
  "relative bg-black rounded-lg overflow-hidden group",
  {
    variants: {
      size: {
        sm: "w-64 h-36",
        md: "w-96 h-54",
        lg: "w-[640px] h-[360px]",
        xl: "w-[800px] h-[450px]",
        full: "w-full h-full",
      },
      variant: {
        default: "border shadow-sm",
        minimal: "border-0 shadow-none",
        card: "border shadow-lg rounded-xl",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

interface VideoPlayerContextValue {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const VideoPlayerContext = React.createContext<VideoPlayerContextValue | null>(null);

interface VideoPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onTimeUpdate' | 'onVolumeChange'>,
    VariantProps<typeof videoPlayerVariants> {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      className,
      size,
      variant,
      src,
      poster,
      autoPlay = false,
      loop = false,
      muted = false,
      controls = true,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      children,
      ...props
    },
    ref
  ) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlayingState] = React.useState(false);

    const setIsPlaying = React.useCallback((playing: boolean) => {
      setIsPlayingState(playing);
    }, []);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolumeState] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(muted);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [showControls, setShowControls] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const [playbackRate, setPlaybackRate] = React.useState(1);

    const setVolume = React.useCallback(
      (newVolume: number) => {
        setVolumeState(newVolume);
        if (videoRef.current) {
          videoRef.current.volume = newVolume;
        }
        onVolumeChange?.(newVolume);
      },
      [onVolumeChange]
    );

    // Auto-hide controls
    const resetControlsTimeout = React.useCallback(() => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }, [isPlaying]);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedData = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        onTimeUpdate?.(video.currentTime);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        onPlay?.();
      };

      const handlePause = () => {
        setIsPlaying(false);
        onPause?.();
      };

      const handleEnded = () => {
        setIsPlaying(false);
        onEnded?.();
      };

      const handleVolumeChange = () => {
        setVolumeState(video.volume);
        setIsMuted(video.muted);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('volumechange', handleVolumeChange);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }, [onPlay, onPause, onEnded, onTimeUpdate]);

    // Fullscreen handling
    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const contextValue = React.useMemo(
      () => ({
        isPlaying,
        setIsPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        isFullscreen,
        setIsFullscreen,
        showControls,
        setShowControls,
        isLoading,
        setIsLoading,
        playbackRate,
        setPlaybackRate,
        videoRef,
        containerRef,
      }),
      [
        isPlaying,
        setIsPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        isFullscreen,
        setIsFullscreen,
        showControls,
        setShowControls,
        isLoading,
        setIsLoading,
        playbackRate,
        setPlaybackRate,
      ]
    );

    const handleMouseMove = () => {
      if (controls) {
        resetControlsTimeout();
      }
    };

    const handleMouseLeave = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying && controls) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 1000);
      }
    };

    return (
      <VideoPlayerContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(videoPlayerVariants({ size, variant, className }))}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          <div ref={containerRef} className="relative w-full h-full">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              className="w-full h-full object-cover"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            
            {children}
          </div>
        </div>
      </VideoPlayerContext.Provider>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

// Video Player Controls
interface VideoPlayerControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "bottom" | "overlay";
}

const VideoPlayerControls = React.forwardRef<HTMLDivElement, VideoPlayerControlsProps>(
  ({ className, position = "bottom", children, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerControls must be used within a VideoPlayer");
    }

    const { showControls } = context;

    const positionClasses = {
      bottom: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent",
      overlay: "absolute inset-0 bg-black/20 flex items-center justify-center",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-opacity duration-300",
          positionClasses[position],
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VideoPlayerControls.displayName = "VideoPlayerControls";

// Play/Pause Button
interface VideoPlayerPlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const VideoPlayerPlayButton = React.forwardRef<HTMLButtonElement, VideoPlayerPlayButtonProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerPlayButton must be used within a VideoPlayer");
    }

    const { isPlaying, setIsPlaying, videoRef } = context;

    const handleClick = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors",
          className
        )}
        {...props}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-white" />
        ) : (
          <Play className="h-5 w-5 text-white ml-0.5" />
        )}
      </button>
    );
  }
);

VideoPlayerPlayButton.displayName = "VideoPlayerPlayButton";

// Progress Bar
interface VideoPlayerProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoPlayerProgress = React.forwardRef<HTMLDivElement, VideoPlayerProgressProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerProgress must be used within a VideoPlayer");
    }

    const { currentTime, duration, videoRef } = context;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!videoRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      videoRef.current.currentTime = newTime;
    };

    return (
      <div
        ref={ref}
        className={cn("flex-1 h-1 bg-white/30 rounded-full cursor-pointer", className)}
        onClick={handleClick}
        {...props}
      >
        <div
          className="h-full bg-white rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }
);

VideoPlayerProgress.displayName = "VideoPlayerProgress";

// Volume Control
interface VideoPlayerVolumeProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoPlayerVolume = React.forwardRef<HTMLDivElement, VideoPlayerVolumeProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerVolume must be used within a VideoPlayer");
    }

    const { volume, setVolume, isMuted, setIsMuted, videoRef } = context;

    const handleMuteToggle = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    };

    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        <button
          onClick={handleMuteToggle}
          className="text-white hover:text-white/80 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    );
  }
);

VideoPlayerVolume.displayName = "VideoPlayerVolume";

// Fullscreen Button
interface VideoPlayerFullscreenProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const VideoPlayerFullscreen = React.forwardRef<HTMLButtonElement, VideoPlayerFullscreenProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerFullscreen must be used within a VideoPlayer");
    }

    const { isFullscreen, containerRef } = context;

    const handleFullscreen = async () => {
      if (!containerRef.current) return;

      try {
        if (isFullscreen) {
          await document.exitFullscreen();
        } else {
          await containerRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleFullscreen}
        className={cn(
          "text-white hover:text-white/80 transition-colors",
          className
        )}
        {...props}
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </button>
    );
  }
);

VideoPlayerFullscreen.displayName = "VideoPlayerFullscreen";

// Time Display
interface VideoPlayerTimeProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoPlayerTime = React.forwardRef<HTMLDivElement, VideoPlayerTimeProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerTime must be used within a VideoPlayer");
    }

    const { currentTime, duration } = context;

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div
        ref={ref}
        className={cn("text-white text-sm font-mono", className)}
        {...props}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    );
  }
);

VideoPlayerTime.displayName = "VideoPlayerTime";

// Settings Menu
interface VideoPlayerSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoPlayerSettings = React.forwardRef<HTMLDivElement, VideoPlayerSettingsProps>(
  ({ className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-white/80 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-32">
            {children}
          </div>
        )}
      </div>
    );
  }
);

VideoPlayerSettings.displayName = "VideoPlayerSettings";

// Playback Rate Control
interface VideoPlayerPlaybackRateProps extends React.HTMLAttributes<HTMLDivElement> {}

const VideoPlayerPlaybackRate = React.forwardRef<HTMLDivElement, VideoPlayerPlaybackRateProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(VideoPlayerContext);

    if (!context) {
      throw new Error("VideoPlayerPlaybackRate must be used within a VideoPlayer");
    }

    const { playbackRate, setPlaybackRate, videoRef } = context;

    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const handleRateChange = (rate: number) => {
      setPlaybackRate(rate);
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    };

    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        <div className="text-white text-xs font-medium px-2">Playback Speed</div>
        {rates.map((rate) => (
          <button
            key={rate}
            onClick={() => handleRateChange(rate)}
            className={cn(
              "block w-full text-left px-2 py-1 text-xs text-white hover:bg-white/20 rounded",
              playbackRate === rate && "bg-white/20"
            )}
          >
            {rate}x
          </button>
        ))}
      </div>
    );
  }
);

VideoPlayerPlaybackRate.displayName = "VideoPlayerPlaybackRate";

// Hook for accessing video player context
const useVideoPlayer = () => {
  const context = React.useContext(VideoPlayerContext);
  if (!context) {
    throw new Error("useVideoPlayer must be used within a VideoPlayer component");
  }
  return context;
};

// Utility functions
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

export {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerPlayButton,
  VideoPlayerProgress,
  VideoPlayerVolume,
  VideoPlayerFullscreen,
  VideoPlayerTime,
  VideoPlayerSettings,
  VideoPlayerPlaybackRate,
  useVideoPlayer,
  formatDuration,
  parseTimeToSeconds,
  videoPlayerVariants,
};

export type {
  VideoPlayerProps,
  VideoPlayerControlsProps,
  VideoPlayerPlayButtonProps,
  VideoPlayerProgressProps,
  VideoPlayerVolumeProps,
  VideoPlayerFullscreenProps,
  VideoPlayerTimeProps,
  VideoPlayerSettingsProps,
  VideoPlayerPlaybackRateProps,
  VideoPlayerContextValue,
};

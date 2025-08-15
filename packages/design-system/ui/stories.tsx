/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Stories variants
const storiesVariants = cva(
  'relative overflow-hidden',
  {
    variants: {
      variant: {
        default: '',
        compact: 'gap-2',
        expanded: 'gap-4',
      },
      size: {
        sm: 'h-32',
        md: 'h-48',
        lg: 'h-64',
        xl: 'h-80',
      },
      aspectRatio: {
        portrait: 'aspect-[9/16]',
        square: 'aspect-square',
        landscape: 'aspect-[16/9]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
      aspectRatio: 'portrait',
    },
  }
);

const storyItemVariants = cva(
  'relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'w-20',
        md: 'w-32',
        lg: 'w-40',
        xl: 'w-48',
      },
      aspectRatio: {
        portrait: 'aspect-[9/16]',
        square: 'aspect-square',
        landscape: 'aspect-[16/9]',
      },
    },
    defaultVariants: {
      size: 'lg',
      aspectRatio: 'portrait',
    },
  }
);

// Types
interface StoryItem {
  id: string;
  type: 'image' | 'video' | 'avatar';
  src: string;
  author: {
    name: string;
    avatar: string;
  };
  title?: string;
  duration?: number;
  viewed?: boolean;
  timestamp?: Date;
}

interface StoriesProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof storiesVariants> {
  stories: StoryItem[];
  onStoryClick?: (story: StoryItem, index: number) => void;
  onStoryView?: (story: StoryItem, index: number) => void;
  showNavigation?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
}

interface StoriesContextType {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  stories: StoryItem[];
}

const StoriesContext = React.createContext<StoriesContextType | undefined>(undefined);

export const useStories = () => {
  const context = React.useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a Stories component');
  }
  return context;
};

// Main Stories component
const Stories = React.forwardRef<HTMLDivElement, StoriesProps>(
  ({ 
    className, 
    variant, 
    size, 
    aspectRatio,
    stories,
    onStoryClick,
    onStoryView,
    showNavigation = true,
    autoPlay = false,
    loop = true,
    children,
    ...props 
  }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [isMuted, setIsMuted] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scrollToStory = (index: number) => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const storyWidth = container.children[0]?.clientWidth || 0;
        const gap = 16; // Default gap
        const scrollPosition = index * (storyWidth + gap);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    };

    const handleStoryClick = (story: StoryItem, index: number) => {
      setCurrentIndex(index);
      scrollToStory(index);
      onStoryClick?.(story, index);
      
      if (!story.viewed) {
        onStoryView?.(story, index);
      }
    };

    const handlePrevious = () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? stories.length - 1 : 0);
      setCurrentIndex(newIndex);
      scrollToStory(newIndex);
    };

    const handleNext = () => {
      const newIndex = currentIndex < stories.length - 1 ? currentIndex + 1 : (loop ? 0 : stories.length - 1);
      setCurrentIndex(newIndex);
      scrollToStory(newIndex);
    };

    const contextValue: StoriesContextType = {
      currentIndex,
      setCurrentIndex,
      isPlaying,
      setIsPlaying,
      isMuted,
      setIsMuted,
      stories,
    };

    if (stories.length === 0) {
      return (
        <div className={cn(storiesVariants({ variant, size, aspectRatio }), 'flex items-center justify-center text-muted-foreground', className)}>
          No stories available
        </div>
      );
    }

    return (
      <StoriesContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('relative', className)}
          {...props}
        >
          {showNavigation && stories.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Next story"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story, index) => (
              <StoryItem
                key={story.id}
                story={story}
                index={index}
                size={size}
                aspectRatio={aspectRatio}
                onClick={() => handleStoryClick(story, index)}
                isActive={index === currentIndex}
              />
            ))}
          </div>

          {children}
        </div>
      </StoriesContext.Provider>
    );
  }
);

Stories.displayName = 'Stories';

// Story Item component
interface StoryItemProps {
  story: StoryItem;
  index: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | null;
  aspectRatio?: 'portrait' | 'square' | 'landscape' | null;
  onClick: () => void;
  isActive?: boolean;
}

const StoryItem = React.forwardRef<HTMLDivElement, StoryItemProps>(
  ({ story, index, size, aspectRatio, onClick, isActive }, ref) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const handleImageError = () => {
      setHasError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          storyItemVariants({ size: size || 'lg', aspectRatio: aspectRatio || 'portrait' }),
          isActive && 'ring-2 ring-primary ring-offset-2',
          story.viewed && 'opacity-60',
          'group'
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {story.type === 'avatar' ? (
          <StoryAvatar story={story} />
        ) : story.type === 'video' ? (
          <StoryVideo story={story} />
        ) : (
          <StoryImage 
            story={story} 
            onLoad={handleImageLoad}
            onError={handleImageError}
            loaded={imageLoaded}
            hasError={hasError}
          />
        )}
        
        <StoryOverlay story={story} />
      </div>
    );
  }
);

StoryItem.displayName = 'StoryItem';

// Story Avatar component
const StoryAvatar = React.forwardRef<HTMLDivElement, { story: StoryItem }>(
  ({ story }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-1"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        {!story.viewed && (
          <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-pink-500 to-purple-500" />
        )}
      </div>
    );
  }
);

StoryAvatar.displayName = 'StoryAvatar';

// Story Image component
interface StoryImageProps {
  story: StoryItem;
  onLoad: () => void;
  onError: () => void;
  loaded: boolean;
  hasError: boolean;
}

const StoryImage = React.forwardRef<HTMLDivElement, StoryImageProps>(
  ({ story, onLoad, onError, loaded, hasError }, ref) => {
    if (hasError) {
      return (
        <div
          ref={ref}
          className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground"
        >
          Failed to load
        </div>
      );
    }

    return (
      <div ref={ref} className="relative w-full h-full">
        {!loaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={story.src}
          alt={story.title || `Story by ${story.author.name}`}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={onLoad}
          onError={onError}
        />
      </div>
    );
  }
);

StoryImage.displayName = 'StoryImage';

// Story Video component
const StoryVideo = React.forwardRef<HTMLDivElement, { story: StoryItem }>(
  ({ story }, ref) => {
    const { isPlaying, isMuted } = useStories();
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    }, [isPlaying]);

    React.useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
      }
    }, [isMuted]);

    return (
      <div ref={ref} className="relative w-full h-full">
        <video
          ref={videoRef}
          src={story.src}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
        
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="p-1 bg-black/50 rounded-full">
            <Play className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
    );
  }
);

StoryVideo.displayName = 'StoryVideo';

// Story Overlay component
const StoryOverlay = React.forwardRef<HTMLDivElement, { story: StoryItem }>(
  ({ story }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2">
            <img
              src={story.author.avatar}
              alt={story.author.name}
              className="w-6 h-6 rounded-full border border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {story.author.name}
              </p>
              {story.title && (
                <p className="text-white/80 text-xs truncate">
                  {story.title}
                </p>
              )}
            </div>
          </div>
          
          {story.timestamp && (
            <p className="text-white/60 text-xs mt-1">
              {story.timestamp.toLocaleDateString()}
            </p>
          )}
        </div>

        {!story.viewed && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        )}
      </div>
    );
  }
);

StoryOverlay.displayName = 'StoryOverlay';

// Stories Controls component
export interface StoriesControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const StoriesControls = React.forwardRef<HTMLDivElement, StoriesControlsProps>(
  ({ className, children, ...props }, ref) => {
    const { isPlaying, setIsPlaying, isMuted, setIsMuted } = useStories();

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        
        {children}
      </div>
    );
  }
);

StoriesControls.displayName = 'StoriesControls';

export {
  Stories,
  StoryItem,
  StoryAvatar,
  StoryImage,
  StoryVideo,
  StoryOverlay,
  StoriesControls,
  storiesVariants,
  storyItemVariants,
};

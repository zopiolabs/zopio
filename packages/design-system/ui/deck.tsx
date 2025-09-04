/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronLeft, ChevronRight, RotateCcw, X, Heart } from 'lucide-react';

// Deck variants
const deckVariants = cva(
  'relative flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-64 h-80',
        md: 'w-80 h-96',
        lg: 'w-96 h-[28rem]',
        xl: 'w-[28rem] h-[36rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const deckCardVariants = cva(
  'absolute rounded-lg shadow-lg cursor-grab active:cursor-grabbing transition-all duration-300 ease-out select-none',
  {
    variants: {
      size: {
        sm: 'w-64 h-80',
        md: 'w-80 h-96',
        lg: 'w-96 h-[28rem]',
        xl: 'w-[28rem] h-[36rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Types
interface DeckProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deckVariants> {
  cards: React.ReactNode[];
  currentIndex?: number;
  onSwipe?: (direction: 'left' | 'right', cardIndex: number) => void;
  onSwipeEnd?: (direction: 'left' | 'right', cardIndex: number) => void;
  swipeThreshold?: number;
  stackSize?: number;
  perspective?: number;
  scaling?: number;
  showControls?: boolean;
  onIndexChange?: (index: number) => void;
}

interface DeckContextType {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  totalCards: number;
  swipeDirection: 'left' | 'right' | null;
  setSwipeDirection: React.Dispatch<React.SetStateAction<'left' | 'right' | null>>;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeckContext = React.createContext<DeckContextType | undefined>(undefined);

export const useDeck = () => {
  const context = React.useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a Deck');
  }
  return context;
};

// Main Deck component
const Deck = React.forwardRef<HTMLDivElement, DeckProps>(
  ({ 
    className, 
    size,
    cards,
    currentIndex: controlledIndex,
    onSwipe,
    onSwipeEnd,
    swipeThreshold = 100,
    stackSize = 3,
    perspective = 1000,
    scaling = 0.95,
    showControls = false,
    onIndexChange,
    children,
    ...props 
  }, ref) => {
    const [internalIndex, setInternalIndex] = React.useState(0);
    const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);

    const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
    const totalCards = cards.length;

    const handleSwipe = (direction: 'left' | 'right') => {
      if (isAnimating || currentIndex >= totalCards) return;

      setIsAnimating(true);
      setSwipeDirection(direction);
      onSwipe?.(direction, currentIndex);

      setTimeout(() => {
        const newIndex = currentIndex + 1;
        if (controlledIndex === undefined) {
          setInternalIndex(newIndex);
        }
        onIndexChange?.(newIndex);
        onSwipeEnd?.(direction, currentIndex);
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 300);
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        if (controlledIndex === undefined) {
          setInternalIndex(newIndex);
        }
        onIndexChange?.(newIndex);
      }
    };

    const handleReset = () => {
      if (controlledIndex === undefined) {
        setInternalIndex(0);
      }
      onIndexChange?.(0);
      setSwipeDirection(null);
      setIsAnimating(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (isAnimating) return;
      setDragStart({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !dragStart || isAnimating) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      if (!isDragging || !dragStart) return;
      
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > swipeThreshold) {
        const direction = dragOffset.x > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
      
      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (isAnimating) return;
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging || !dragStart || isAnimating) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = () => {
      if (!isDragging || !dragStart) return;
      
      setIsDragging(false);
      
      if (Math.abs(dragOffset.x) > swipeThreshold) {
        const direction = dragOffset.x > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
      
      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
    };

    const getCardStyle = (index: number) => {
      const relativeIndex = index - currentIndex;
      
      if (relativeIndex < 0) {
        // Already swiped cards
        return {
          opacity: 0,
          transform: 'translateX(-100%) scale(0.8)',
          zIndex: -1,
        };
      }
      
      if (relativeIndex >= stackSize) {
        // Cards beyond stack size
        return {
          opacity: 0,
          transform: 'scale(0.8)',
          zIndex: -1,
        };
      }

      const scale = Math.pow(scaling, relativeIndex);
      const translateY = relativeIndex * 4;
      const opacity = relativeIndex === 0 ? 1 : 0.8 - (relativeIndex * 0.2);
      const zIndex = stackSize - relativeIndex;

      let transform = `translateY(${translateY}px) scale(${scale})`;
      
      // Apply drag offset to the top card
      if (relativeIndex === 0 && isDragging) {
        const rotation = dragOffset.x * 0.1;
        transform = `translateX(${dragOffset.x}px) translateY(${translateY + dragOffset.y * 0.2}px) rotate(${rotation}deg) scale(${scale})`;
      }

      // Apply swipe animation to the top card
      if (relativeIndex === 0 && swipeDirection && isAnimating) {
        const swipeX = swipeDirection === 'left' ? -window.innerWidth : window.innerWidth;
        const rotation = swipeDirection === 'left' ? -30 : 30;
        transform = `translateX(${swipeX}px) rotate(${rotation}deg) scale(${scale})`;
      }

      return {
        opacity,
        transform,
        zIndex,
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
      };
    };

    const contextValue: DeckContextType = {
      currentIndex,
      setCurrentIndex: controlledIndex === undefined ? setInternalIndex : () => {},
      totalCards,
      swipeDirection,
      setSwipeDirection,
      isAnimating,
      setIsAnimating,
    };

    if (totalCards === 0) {
      return (
        <div className={cn(deckVariants({ size }), 'flex items-center justify-center text-muted-foreground', className)}>
          No cards available
        </div>
      );
    }

    return (
      <DeckContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(deckVariants({ size }), className)}
          style={{ perspective: `${perspective}px` }}
          {...props}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className={cn(deckCardVariants({ size }))}
              style={getCardStyle(index)}
              onMouseDown={index === currentIndex ? handleMouseDown : undefined}
              onMouseMove={index === currentIndex ? handleMouseMove : undefined}
              onMouseUp={index === currentIndex ? handleMouseUp : undefined}
              onMouseLeave={index === currentIndex ? handleMouseUp : undefined}
              onTouchStart={index === currentIndex ? handleTouchStart : undefined}
              onTouchMove={index === currentIndex ? handleTouchMove : undefined}
              onTouchEnd={index === currentIndex ? handleTouchEnd : undefined}
            >
              {card}
            </div>
          ))}

          {currentIndex >= totalCards && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No more cards</p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          )}

          {showControls && currentIndex < totalCards && (
            <DeckControls
              onSwipeLeft={() => handleSwipe('left')}
              onSwipeRight={() => handleSwipe('right')}
              onPrevious={handlePrevious}
              onReset={handleReset}
              canGoBack={currentIndex > 0}
            />
          )}

          {children}
        </div>
      </DeckContext.Provider>
    );
  }
);

Deck.displayName = 'Deck';

// Deck Controls component
interface DeckControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPrevious: () => void;
  onReset: () => void;
  canGoBack: boolean;
}

const DeckControls = React.forwardRef<HTMLDivElement, DeckControlsProps>(
  ({ onSwipeLeft, onSwipeRight, onPrevious, onReset, canGoBack }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4"
      >
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className="p-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={onSwipeLeft}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Swipe Left"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={onSwipeRight}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Swipe Right"
        >
          <Heart className="h-5 w-5" />
        </button>

        <button
          onClick={onReset}
          className="p-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    );
  }
);

DeckControls.displayName = 'DeckControls';

// Deck Card component
export interface DeckCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const DeckCard = React.forwardRef<HTMLDivElement, DeckCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full bg-background border border-border rounded-lg overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DeckCard.displayName = 'DeckCard';

// Deck Info component
export interface DeckInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

const DeckInfo = React.forwardRef<HTMLDivElement, DeckInfoProps>(
  ({ className, children, ...props }, ref) => {
    const { currentIndex, totalCards, swipeDirection } = useDeck();

    return (
      <div
        ref={ref}
        className={cn('text-center text-sm text-muted-foreground', className)}
        {...props}
      >
        <div>
          Current Index: {currentIndex} | Total Cards: {totalCards}
        </div>
        {swipeDirection && (
          <div>
            Next Direction: {swipeDirection}
          </div>
        )}
        {children}
      </div>
    );
  }
);

DeckInfo.displayName = 'DeckInfo';

// Standalone Deck Info component (can be used outside of Deck context)
export interface StandaloneDeckInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  currentIndex: number;
  totalCards: number;
  swipeDirection?: 'left' | 'right' | null;
}

const StandaloneDeckInfo = React.forwardRef<HTMLDivElement, StandaloneDeckInfoProps>(
  ({ className, children, currentIndex, totalCards, swipeDirection, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-center text-sm text-muted-foreground', className)}
        {...props}
      >
        <div>
          Current Index: {currentIndex} | Total Cards: {totalCards}
        </div>
        {swipeDirection && (
          <div>
            Next Direction: {swipeDirection}
          </div>
        )}
        {children}
      </div>
    );
  }
);

StandaloneDeckInfo.displayName = 'StandaloneDeckInfo';

export {
  Deck,
  DeckControls,
  DeckCard,
  DeckInfo,
  StandaloneDeckInfo,
  deckVariants,
  deckCardVariants,
};

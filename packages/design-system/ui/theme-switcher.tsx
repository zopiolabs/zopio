/**
 * SPDX-License-Identifier: MIT
 */

'use client';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { Monitor, Moon, Sun, Info, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@repo/design-system/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@repo/design-system/ui/popover';
import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseTitle,
  GlimpseDescription
} from '@repo/design-system/ui/glimpse';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
    description: 'Follows your device settings',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
    description: 'Light mode for daytime use',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
    description: 'Dark mode for nighttime use',
  },
];

export type ThemeSwitcherProps = {
  value?: 'light' | 'dark' | 'system';
  onChange?: (theme: 'light' | 'dark' | 'system') => void;
  defaultValue?: 'light' | 'dark' | 'system';
  className?: string;
  draggable?: boolean;
  showPopover?: boolean;
  showGlimpse?: boolean;
  showList?: boolean;
};

// Draggable theme button component
const DraggableThemeButton = ({
  themeKey,
  icon: Icon,
  label,
  description,
  isActive,
  onClick,
  showGlimpse,
}: {
  themeKey: string;
  icon: any;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  showGlimpse?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `theme-${themeKey}`,
  });

  const button = (
    <button
      ref={setNodeRef}
      aria-label={label}
      className={cn(
        "relative h-6 w-6 rounded-full",
        transform ? "cursor-grabbing" : "cursor-pointer"
      )}
      key={themeKey}
      onClick={onClick}
      type="button"
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translateX(${transform.x}px) translateY(${transform.y}px)`
          : undefined,
      }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-secondary"
          layoutId="activeTheme"
          transition={{ type: 'spring', duration: 0.5 }}
        />
      )}
      <Icon
        className={cn(
          'relative z-10 m-auto h-4 w-4',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      />
    </button>
  );

  if (showGlimpse) {
    return (
      <Glimpse>
        <GlimpseTrigger asChild>
          {button}
        </GlimpseTrigger>
        <GlimpseContent className="w-64">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-secondary p-1">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <GlimpseTitle>{label}</GlimpseTitle>
              <GlimpseDescription>{description}</GlimpseDescription>
            </div>
          </div>
        </GlimpseContent>
      </Glimpse>
    );
  }

  return button;
};

// Regular theme button component
const ThemeButton = ({
  themeKey,
  icon: Icon,
  label,
  description,
  isActive,
  onClick,
  showGlimpse,
}: {
  themeKey: string;
  icon: any;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  showGlimpse?: boolean;
}) => {
  const button = (
    <button
      aria-label={label}
      className="relative h-6 w-6 rounded-full"
      key={themeKey}
      onClick={onClick}
      type="button"
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-secondary"
          layoutId="activeTheme"
          transition={{ type: 'spring', duration: 0.5 }}
        />
      )}
      <Icon
        className={cn(
          'relative z-10 m-auto h-4 w-4',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      />
    </button>
  );

  if (showGlimpse) {
    return (
      <Glimpse>
        <GlimpseTrigger asChild>
          {button}
        </GlimpseTrigger>
        <GlimpseContent className="w-64">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-secondary p-1">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <GlimpseTitle>{label}</GlimpseTitle>
              <GlimpseDescription>{description}</GlimpseDescription>
            </div>
          </div>
        </GlimpseContent>
      </Glimpse>
    );
  }

  return button;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = 'system',
  className,
  draggable = false,
  showPopover = false,
  showGlimpse = false,
  showList = false,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey: 'light' | 'dark' | 'system') => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      // Optional: Add custom drag end behavior
      console.log('Drag ended:', event);
    },
    []
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeSwitcherContent = (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
    >
      {themes.map(({ key, icon, label, description }) => {
        const isActive = theme === key;

        if (draggable) {
          return (
            <DraggableThemeButton
              key={key}
              themeKey={key}
              icon={icon}
              label={label}
              description={description}
              isActive={isActive}
              onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
              showGlimpse={showGlimpse}
            />
          );
        }

        return (
          <ThemeButton
            key={key}
            themeKey={key}
            icon={icon}
            label={label}
            description={description}
            isActive={isActive}
            onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
            showGlimpse={showGlimpse}
          />
        );
      })}
    </div>
  );

  // Show list view of themes
  if (showList) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          {themeSwitcherContent}
        </div>
        <div className="space-y-2 rounded-md border p-2">
          {themes.map(({ key, icon: Icon, label, description }) => {
            const isActive = theme === key;
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  isActive ? "bg-secondary" : "hover:bg-muted/50"
                )}
                onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Show with popover
  if (showPopover) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm">
            <Settings className="h-4 w-4" />
            <span>Theme</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Select Theme</h4>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            {themeSwitcherContent}
            <div className="space-y-2">
              {themes.map(({ key, icon: Icon, label, description }) => {
                const isActive = theme === key;
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md cursor-pointer",
                      isActive ? "bg-secondary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )} />
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // If draggable, wrap in DndContext
  if (draggable) {
    return (
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        {themeSwitcherContent}
      </DndContext>
    );
  }

  // Default view
  return themeSwitcherContent;
};

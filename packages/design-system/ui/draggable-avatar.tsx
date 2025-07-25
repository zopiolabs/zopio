/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { motion } from 'framer-motion';
import type * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from '@repo/design-system/lib/utils';

export interface DraggableAvatarProps {
  /**
   * The initials to display when no image is available
   */
  initials?: string;
  /**
   * Optional image URL for the avatar
   */
  imageUrl?: string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional size override (default is 'md')
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional background color for the avatar fallback
   */
  bgColor?: string;
  /**
   * Optional text color for the avatar fallback
   */
  textColor?: string;
  /**
   * Optional z-index for the avatar
   */
  zIndex?: number;
}

/**
 * A draggable avatar component that can be freely moved around the screen
 */
export function DraggableAvatar({
  initials = 'AB',
  imageUrl,
  className,
  size = 'md',
  bgColor,
  textColor,
  zIndex = 50,
  ...props
}: DraggableAvatarProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16',
    xl: 'size-20',
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.1 }}
      className={cn('absolute cursor-grab active:cursor-grabbing', className)}
      style={{ zIndex }}
      {...props}
    >
      <Avatar 
        className={cn(
          sizeClasses[size],
          'shadow-md',
          className
        )}
      >
        {imageUrl && <AvatarImage src={imageUrl} alt={initials} />}
        <AvatarFallback
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}

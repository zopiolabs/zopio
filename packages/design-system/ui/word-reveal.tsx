/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../lib/utils';

export interface WordRevealProps {
  /**
   * The text to be revealed word by word
   */
  text: string;
  /**
   * Optional CSS class names
   */
  className?: string;
  /**
   * Delay between each word animation in seconds
   * @default 0.15
   */
  delay?: number;
}

/**
 * WordReveal component animates text by revealing words one by one with a blur effect
 */
export const WordReveal = React.forwardRef<HTMLHeadingElement, WordRevealProps>(
  ({ text, className, delay = 0.15, ...props }, ref) => {
    const words = text.split(' ');

    const container: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: delay },
      },
    };

    const child: Variants = {
      hidden: {
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
      },
      visible: (i: number) => ({
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          delay: i * delay,
          type: 'spring',
          damping: 12,
          stiffness: 100,
        },
      }),
    };

    return (
      <motion.h1
        ref={ref}
        variants={container}
        initial="hidden"
        animate="visible"
        className={cn(
          'drop-shadow-sm font-bold font-display md:leading-[5rem] md:text-7xl text-center text-4xl text-foreground tracking-[-0.02em]',
          className
        )}
        {...props}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={child}
            custom={i}
            className="inline-block mr-[0.25em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
    );
  }
);

WordReveal.displayName = 'WordReveal';

export default WordReveal;

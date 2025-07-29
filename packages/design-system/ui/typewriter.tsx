'use client';

/**
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

type TypewriterProps = {
  /**
   * Text to be displayed with typewriter effect
   * Supports HTML tags for styling
   */
  text?: string;
  
  /**
   * Speed of typing in milliseconds per character
   * @default 33
   */
  typeSpeed?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Callback function that is called when typing is complete
   */
  onComplete?: () => void;
};

/**
 * Typewriter component that displays text with a typing animation effect
 * Supports HTML tags within the text for styling
 */
export const Typewriter = ({
  text = '',
  typeSpeed = 33,
  onComplete,
  className,
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete); // Ref to store the latest onComplete

  // Keep onComplete callback reference up-to-date without causing effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    /**
     * Each time text changes,
     * only add new characters from the end of the currently displayed text.
     */
    const startTyping = () => {
      let currentIndex = displayedText.length;
      
      intervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          // Only add new characters, do not reset old text
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onCompleteRef.current?.();
        }
      }, typeSpeed);
    };

    // If there is new text, start typing animation
    if (text.length > displayedText.length) {
      // Start typing immediately, no need to wait for delay
      startTyping();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, typeSpeed, displayedText]);

  return (
    <span 
      className={cn('whitespace-pre-wrap leading-7', className)} 
      dangerouslySetInnerHTML={{ __html: displayedText }}
    />
  );
};

/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import {
  NotificationFeedPopover,
  NotificationIconButton,
} from '@knocklabs/react';
import type React from 'react';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { keys } from '../keys';

// Required CSS import, unless you're overriding the styling
import '@knocklabs/react/dist/index.css';
import '../styles.css';

export const NotificationsTrigger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (event: Event) => {
    if (event.target === notifButtonRef.current) {
      return;
    }

    setIsVisible(false);
  };

  if (!keys().NEXT_PUBLIC_KNOCK_API_KEY) {
    return null;
  }

  // Using type assertions to work around React 19 compatibility issues
  const IconButton = NotificationIconButton as React.ForwardRefExoticComponent<{
    onClick: () => void;
    ref: React.RefObject<HTMLButtonElement | null>;
  }>;

  const FeedPopover = NotificationFeedPopover as React.ComponentType<{
    buttonRef: RefObject<HTMLElement>;
    isVisible: boolean;
    onClose: (event: Event) => void;
  }>;

  return (
    <>
      <IconButton
        onClick={() => setIsVisible(!isVisible)}
        ref={notifButtonRef}
      />
      {notifButtonRef.current && (
        <FeedPopover
          buttonRef={notifButtonRef as RefObject<HTMLElement>}
          isVisible={isVisible}
          onClose={handleClose}
        />
      )}
    </>
  );
};

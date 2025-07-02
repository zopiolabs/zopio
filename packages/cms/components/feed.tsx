/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import type { FC, ReactNode } from 'react';

interface FeedProps {
  children?: ReactNode | ((data: Record<string, unknown>) => ReactNode);
  data?: Record<string, unknown>;
}

export const Feed: FC<FeedProps> = ({ children, data }) => {
  return (
    <div className="basehub-feed">
      {typeof children !== 'function' && children}
      {data && (
        <div className="basehub-feed-data">
          {typeof children === 'function' ? children(data) : null}
        </div>
      )}
    </div>
  );
};

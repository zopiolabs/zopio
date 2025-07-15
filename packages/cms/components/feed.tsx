/**
 * SPDX-License-Identifier: MIT
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

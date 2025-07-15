/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import dynamic from 'next/dynamic';

// Define the props for our Video component
type VideoProps = {
  aspectRatio: string;
  url: string;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playing?: boolean;
};

const ReactPlayer = dynamic(
  () => import('react-player/youtube').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-black" />,
  }
);

export const Video = ({ aspectRatio, ...props }: VideoProps) => (
  <div className="relative w-full" style={{ aspectRatio }}>
    {/* @ts-ignore - Ignoring type issues with ReactPlayer in React 19 */}
    <ReactPlayer
      {...props}
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
      }}
    />
  </div>
);

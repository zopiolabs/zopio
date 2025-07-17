/**
 * SPDX-License-Identifier: MIT
 */
import { ImageZoom } from '@repo/design-system/ui/image-zoom';
import Image from 'next/image';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

export default {
  title: 'ui/ImageZoom',
  component: ImageZoom,
  tags: ['autodocs'],
};

export const Default = {
  render: (
    args: import('@repo/design-system/ui/image-zoom').ImageZoomProps
  ) => (
    <div className="flex flex-col items-center gap-8 p-8">
      <ImageZoom {...args}>
        <Image
          alt="Beautiful landscape"
          src={IMAGE_URL}
          width={400}
          height={300}
          className="h-auto w-full rounded-lg object-cover shadow-md"
        />
      </ImageZoom>
    </div>
  ),
  args: {},
};

export const WithCustomBackdrop = {
  render: (
    args: import('@repo/design-system/ui/image-zoom').ImageZoomProps
  ) => (
    <div className="flex flex-col items-center gap-8 p-8">
      <ImageZoom
        {...args}
        backdropClassName='[&_[data-rmiz-modal-overlay="visible"]]:bg-red-900/80'
      >
        <Image
          alt="Custom backdrop"
          src={IMAGE_URL}
          width={400}
          height={300}
          className="h-auto w-full rounded-lg object-cover shadow-md"
        />
      </ImageZoom>
    </div>
  ),
  args: {
    isZoomed: true,
  },
};

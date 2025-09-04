/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Info } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  FullscreenButton,
  ImageZoom,
  ImageZoomCanvas,
  ImageZoomControls,
  ResetButton,
  RotateButton,
  ZoomInButton,
  ZoomOutButton,
  ZoomSlider,
  useImageZoom,
} from '@repo/design-system/ui/image-zoom';
import Image from 'next/image';

/**
 * A component that allows users to zoom, pan, and rotate images with interactive controls.
 */
const meta: Meta<typeof ImageZoom> = {
  title: 'ui/Image Zoom',
  component: ImageZoom,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the zoom container',
    },
    minZoom: {
      control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
      description: 'Minimum zoom level',
    },
    maxZoom: {
      control: { type: 'number', min: 1, max: 10, step: 0.5 },
      description: 'Maximum zoom level',
    },
    zoomStep: {
      control: { type: 'number', min: 0.1, max: 1, step: 0.05 },
      description: 'Zoom increment/decrement step',
    },
    initialZoom: {
      control: { type: 'number', min: 0.5, max: 3, step: 0.1 },
      description: 'Initial zoom level',
    },
    wheelZoom: {
      control: { type: 'boolean' },
      description: 'Enable mouse wheel zooming',
    },
    doubleClickZoom: {
      control: { type: 'boolean' },
      description: 'Enable double-click to zoom',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample images for demos
const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
const PORTRAIT_IMAGE =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop';
const LANDSCAPE_IMAGE =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop';

/**
 * Basic image zoom with default settings.
 */
export const Default: Story = {
  render: () => (
    <ImageZoom src={SAMPLE_IMAGE} alt="Mountain landscape">
      <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
      <ImageZoomControls>
        <ZoomOutButton />
        <ZoomInButton />
        <ResetButton />
        <RotateButton />
        <FullscreenButton />
      </ImageZoomControls>
    </ImageZoom>
  ),
};

/**
 * Different container sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <ImageZoom src={SAMPLE_IMAGE} size="sm">
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <ImageZoom src={SAMPLE_IMAGE} size="md">
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <ImageZoom src={SAMPLE_IMAGE} size="lg">
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>
    </div>
  ),
};

/**
 * Custom zoom range and step.
 */
export const CustomZoomRange: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">
          Fine Control (0.1x - 3x, 0.1 step)
        </h4>
        <ImageZoom src={SAMPLE_IMAGE} minZoom={0.1} maxZoom={3} zoomStep={0.1}>
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomSlider />
            <ResetButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">
          High Magnification (0.5x - 10x, 0.5 step)
        </h4>
        <ImageZoom src={SAMPLE_IMAGE} minZoom={0.5} maxZoom={10} zoomStep={0.5}>
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomSlider />
            <ResetButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>
    </div>
  ),
};

/**
 * With zoom slider control.
 */
export const WithSlider: Story = {
  render: () => (
    <ImageZoom src={SAMPLE_IMAGE} maxZoom={4}>
      <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
      <ImageZoomControls>
        <ZoomOutButton />
        <ZoomSlider />
        <ZoomInButton />
        <ResetButton />
        <RotateButton />
      </ImageZoomControls>
    </ImageZoom>
  ),
};

/**
 * Disabled interactions.
 */
export const DisabledInteractions: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">No Wheel Zoom</h4>
        <ImageZoom src={SAMPLE_IMAGE} wheelZoom={false}>
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
            <span className="text-muted-foreground text-xs">
              Wheel zoom disabled
            </span>
          </ImageZoomControls>
        </ImageZoom>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">No Double-Click Zoom</h4>
        <ImageZoom src={SAMPLE_IMAGE} doubleClickZoom={false}>
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
            <span className="text-muted-foreground text-xs">
              Double-click zoom disabled
            </span>
          </ImageZoomControls>
        </ImageZoom>
      </div>
    </div>
  ),
};

/**
 * Different image orientations.
 */
export const ImageOrientations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Portrait</h4>
        <ImageZoom src={PORTRAIT_IMAGE} size="md">
          <ImageZoomCanvas src={PORTRAIT_IMAGE} alt="Forest path" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
            <RotateButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Landscape</h4>
        <ImageZoom src={LANDSCAPE_IMAGE} size="lg">
          <ImageZoomCanvas src={LANDSCAPE_IMAGE} alt="Lake sunset" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ResetButton />
            <RotateButton />
          </ImageZoomControls>
        </ImageZoom>
      </div>
    </div>
  ),
};

/**
 * Image gallery with zoom.
 */
export const ImageGallery: Story = {
  render: () => {
    const images = [
      { id: 1, src: SAMPLE_IMAGE, title: 'Mountain View' },
      { id: 2, src: PORTRAIT_IMAGE, title: 'Forest Path' },
      { id: 3, src: LANDSCAPE_IMAGE, title: 'Lake Sunset' },
    ];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {images.map((image) => (
            <Button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`relative h-16 w-20 overflow-hidden rounded border-2 ${
                selectedImage.id === image.id
                  ? 'border-primary'
                  : 'border-muted'
              }`}
            >
              <Image
                src={image.src}
                alt={image.title}
                className="h-full w-full object-cover"
                width={100}
                height={100}
                unoptimized
                priority
              />
            </Button>
          ))}
        </div>

        <ImageZoom src={selectedImage.src} alt={selectedImage.title} size="lg">
          <ImageZoomCanvas src={selectedImage.src} alt={selectedImage.title} />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomSlider />
            <ResetButton />
            <RotateButton />
            <FullscreenButton />
            <span className="ml-auto text-muted-foreground text-sm">
              {selectedImage.title}
            </span>
          </ImageZoomControls>
        </ImageZoom>
      </div>
    );
  },
};

/**
 * Product image viewer.
 */
export const ProductViewer: Story = {
  render: () => {
    const [selectedView, setSelectedView] = useState('front');

    const productImages = {
      front: SAMPLE_IMAGE,
      back: PORTRAIT_IMAGE,
      side: LANDSCAPE_IMAGE,
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {Object.entries(productImages).map(([view, _src]) => (
            <Button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`rounded border px-3 py-1 text-sm ${
                selectedView === view
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>

        <ImageZoom
          src={productImages[selectedView as keyof typeof productImages]}
          alt={`Product ${selectedView} view`}
          size="lg"
          maxZoom={6}
        >
          <ImageZoomCanvas
            src={productImages[selectedView as keyof typeof productImages]}
            alt={`Product ${selectedView} view`}
          />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomSlider />
            <ResetButton />
            <RotateButton />
            <FullscreenButton />
            <div className="ml-auto text-muted-foreground text-xs">
              Use mouse wheel or double-click to zoom
            </div>
          </ImageZoomControls>
        </ImageZoom>
      </div>
    );
  },
};

/**
 * Controlled zoom with external controls.
 */
export const ControlledZoom: Story = {
  render: () => {
    const [externalZoom, setExternalZoom] = useState(1);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded bg-muted p-4">
          <span className="font-medium text-sm">External Controls:</span>
          <Button
            onClick={() => setExternalZoom(0.5)}
            className="rounded border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            50%
          </Button>
          <Button
            onClick={() => setExternalZoom(1)}
            className="rounded border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            100%
          </Button>
          <Button
            onClick={() => setExternalZoom(2)}
            className="rounded border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            200%
          </Button>
          <Button
            onClick={() => setExternalZoom(4)}
            className="rounded border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            400%
          </Button>
        </div>

        <ImageZoom
          src={SAMPLE_IMAGE}
          initialZoom={externalZoom}
          key={externalZoom} // Force re-render with new zoom
          onZoomChange={undefined}
          onPositionChange={undefined}
        >
          <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
          <ImageZoomControls>
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomSlider />
            <ResetButton />
            <ZoomInfo />
          </ImageZoomControls>
        </ImageZoom>
      </div>
    );
  },
};

/**
 * Fullscreen mode.
 */
export const FullscreenMode: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded bg-muted p-4 text-sm">
        <strong>Instructions:</strong> Click the fullscreen button to enter
        fullscreen mode. Press Escape or click the fullscreen button again to
        exit.
      </div>

      <ImageZoom src={SAMPLE_IMAGE} size="md">
        <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
        <ImageZoomControls>
          <ZoomOutButton />
          <ZoomInButton />
          <ResetButton />
          <RotateButton />
          <FullscreenButton />
          <span className="ml-auto text-muted-foreground text-xs">
            Press Escape to exit fullscreen
          </span>
        </ImageZoomControls>
      </ImageZoom>
    </div>
  ),
};

/**
 * Custom controls and styling.
 */
export const CustomControls: Story = {
  render: () => (
    <ImageZoom src={SAMPLE_IMAGE} size="lg">
      <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
      <ImageZoomControls className="bg-muted/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <ZoomOutButton variant="ghost" />
          <ZoomInButton variant="ghost" />
        </div>

        <ZoomSlider className="mx-4 flex-1" />

        <div className="flex items-center gap-2">
          <ResetButton variant="ghost" />
          <RotateButton variant="ghost" />
          <FullscreenButton variant="default" />
        </div>

        <ZoomInfo />
      </ImageZoomControls>
    </ImageZoom>
  ),
};

// Custom zoom info component for stories
const ZoomInfo = () => {
  const { zoom, position, rotation } = useImageZoom();

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <Info className="h-3 w-3" />
      <span>
        {Math.round(zoom * 100)}% |{Math.round(position.x)},{' '}
        {Math.round(position.y)} |{rotation}°
      </span>
    </div>
  );
};

/**
 * Using the image zoom context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <ImageZoom src={SAMPLE_IMAGE} maxZoom={3}>
        <ImageZoomCanvas src={SAMPLE_IMAGE} alt="Mountain landscape" />
        <ImageZoomControls>
          <ZoomOutButton />
          <ZoomInButton />
          <ZoomSlider />
          <ResetButton />
          <RotateButton />
          <ZoomInfo />
        </ImageZoomControls>
        <DetailedZoomInfo />
      </ImageZoom>
    </div>
  ),
};

// Detailed zoom info component
const DetailedZoomInfo = () => {
  const {
    zoom,
    position,
    rotation,
    isDragging,
    minZoom,
    maxZoom,
    isFullscreen,
  } = useImageZoom();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Zoom:</span>
          <div>
            {Math.round(zoom * 100)}% ({minZoom}x - {maxZoom}x)
          </div>
        </div>
        <div>
          <span className="font-medium">Position:</span>
          <div>
            x: {Math.round(position.x)}, y: {Math.round(position.y)}
          </div>
        </div>
        <div>
          <span className="font-medium">Rotation:</span>
          <div>{rotation}°</div>
        </div>
        <div>
          <span className="font-medium">State:</span>
          <div>
            {isDragging && 'Dragging'}
            {isFullscreen && 'Fullscreen'}
            {!isDragging && !isFullscreen && 'Idle'}
          </div>
        </div>
      </div>
    </div>
  );
};

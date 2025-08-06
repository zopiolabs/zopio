/**
 * SPDX-License-Identifier: MIT
 */

import { Image } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Image> = {
  title: 'UI/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: {
        type: 'select',
        options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      },
    },
    shadow: {
      control: {
        type: 'select',
        options: ['none', 'sm', 'md', 'lg'],
      },
    },
    objectFit: {
      control: {
        type: 'select',
        options: ['contain', 'cover', 'fill', 'none', 'scaleDown'],
      },
    },
    isBlurred: {
      control: 'boolean',
    },
    isZoomed: {
      control: 'boolean',
    },
    disableSkeleton: {
      control: 'boolean',
    },
    removeWrapper: {
      control: 'boolean',
    },
    loading: {
      control: {
        type: 'select',
        options: ['eager', 'lazy'],
      },
    },
  },
  args: {
    src: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ea',
    alt: 'Sample image',
    width: 400,
    height: 300,
    radius: 'md',
    shadow: 'md',
    objectFit: 'cover',
    loading: 'lazy',
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

/**
 * Default image with standard settings.
 */
export const Default: Story = {};

/**
 * Image with different radius options.
 */
export const Radius: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <Image {...args} radius="none" alt="No radius" />
        <span className="text-muted-foreground text-sm">none</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} radius="sm" alt="Small radius" />
        <span className="text-muted-foreground text-sm">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} radius="md" alt="Medium radius" />
        <span className="text-muted-foreground text-sm">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} radius="lg" alt="Large radius" />
        <span className="text-muted-foreground text-sm">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} radius="xl" alt="Extra large radius" />
        <span className="text-muted-foreground text-sm">xl</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image
          {...args}
          radius="full"
          width={300}
          height={300}
          alt="Full radius"
        />
        <span className="text-muted-foreground text-sm">full</span>
      </div>
    </div>
  ),
};

/**
 * Image with different shadow options.
 */
export const Shadow: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col items-center gap-2">
        <Image {...args} shadow="none" alt="No shadow" />
        <span className="text-muted-foreground text-sm">none</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} shadow="sm" alt="Small shadow" />
        <span className="text-muted-foreground text-sm">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} shadow="md" alt="Medium shadow" />
        <span className="text-muted-foreground text-sm">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Image {...args} shadow="lg" alt="Large shadow" />
        <span className="text-muted-foreground text-sm">lg</span>
      </div>
    </div>
  ),
};

/**
 * Image with different object-fit options.
 */
export const ObjectFit: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="border border-border border-dashed p-2">
          <Image
            {...args}
            objectFit="contain"
            width={200}
            height={200}
            alt="Contain fit"
          />
        </div>
        <span className="text-muted-foreground text-sm">contain</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="border border-border border-dashed p-2">
          <Image
            {...args}
            objectFit="cover"
            width={200}
            height={200}
            alt="Cover fit"
          />
        </div>
        <span className="text-muted-foreground text-sm">cover</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="border border-border border-dashed p-2">
          <Image
            {...args}
            objectFit="fill"
            width={200}
            height={200}
            alt="Fill fit"
          />
        </div>
        <span className="text-muted-foreground text-sm">fill</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="border border-border border-dashed p-2">
          <Image
            {...args}
            objectFit="none"
            width={200}
            height={200}
            alt="None fit"
          />
        </div>
        <span className="text-muted-foreground text-sm">none</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="border border-border border-dashed p-2">
          <Image
            {...args}
            objectFit="scaleDown"
            width={200}
            height={200}
            alt="Scale down fit"
          />
        </div>
        <span className="text-muted-foreground text-sm">scaleDown</span>
      </div>
    </div>
  ),
};

/**
 * Image with blur effect.
 */
export const Blurred: Story = {
  args: {
    isBlurred: true,
  },
};

/**
 * Image with zoom effect on hover.
 */
export const Zoomed: Story = {
  args: {
    isZoomed: true,
  },
};

/**
 * Image with both blur and zoom effects.
 */
export const BlurredAndZoomed: Story = {
  args: {
    isBlurred: true,
    isZoomed: true,
  },
};

/**
 * Image with loading skeleton animation.
 */
export const WithSkeleton: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 font-medium text-lg">With Skeleton (Default)</h3>
        <Image
          {...args}
          // Using a delayed image to show skeleton
          src="https://app.requestly.io/delay/3000/https://images.unsplash.com/photo-1682687220923-c58b9a4592ea"
          disableSkeleton={false}
          alt="Image with skeleton"
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-lg">Without Skeleton</h3>
        <Image
          {...args}
          // Using a delayed image
          src="https://app.requestly.io/delay/3000/https://images.unsplash.com/photo-1682687220923-c58b9a4592ea"
          disableSkeleton={true}
          alt="Image without skeleton"
        />
      </div>
    </div>
  ),
};

/**
 * Image with fallback for error handling.
 */
export const WithFallback: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Invalid Image URL</h3>
        <Image
          {...args}
          src="https://invalid-image-url.jpg"
          fallbackSrc="https://placehold.co/400x300?text=Fallback+Image"
          alt="Image with fallback"
        />
        <span className="text-muted-foreground text-sm">
          Shows fallback when image fails to load
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Valid Image URL</h3>
        <Image {...args} alt="Valid image" />
        <span className="text-muted-foreground text-sm">
          Shows the actual image when URL is valid
        </span>
      </div>
    </div>
  ),
};

/**
 * Image without wrapper element.
 */
export const WithoutWrapper: Story = {
  args: {
    removeWrapper: true,
  },
};

/**
 * Image with custom classNames for styling.
 */
export const WithCustomClassNames: Story = {
  args: {
    classNames: {
      wrapper: 'border-4 border-primary p-2',
      img: 'opacity-90 hover:opacity-100',
    },
  },
};

/**
 * Responsive image that adapts to container width.
 */
export const Responsive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div className="w-full max-w-sm">
        <h3 className="mb-2 font-medium text-lg">Small container (max-w-sm)</h3>
        <Image
          {...args}
          className="w-full"
          width={undefined}
          height={undefined}
          alt="Responsive image in small container"
        />
      </div>
      <div className="w-full max-w-md">
        <h3 className="mb-2 font-medium text-lg">
          Medium container (max-w-md)
        </h3>
        <Image
          {...args}
          className="w-full"
          width={undefined}
          height={undefined}
          alt="Responsive image in medium container"
        />
      </div>
      <div className="w-full max-w-lg">
        <h3 className="mb-2 font-medium text-lg">Large container (max-w-lg)</h3>
        <Image
          {...args}
          className="w-full"
          width={undefined}
          height={undefined}
          alt="Responsive image in large container"
        />
      </div>
    </div>
  ),
};

/**
 * Image with aspect ratio.
 */
export const AspectRatio: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-2">
        <div className="aspect-square w-64 overflow-hidden">
          <Image
            {...args}
            className="h-full w-full"
            width={undefined}
            height={undefined}
            alt="Square aspect ratio (1:1)"
          />
        </div>
        <span className="text-muted-foreground text-sm">Square (1:1)</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="aspect-video w-64 overflow-hidden">
          <Image
            {...args}
            className="h-full w-full"
            width={undefined}
            height={undefined}
            alt="Video aspect ratio (16:9)"
          />
        </div>
        <span className="text-muted-foreground text-sm">Video (16:9)</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-64 overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <Image
            {...args}
            className="h-full w-full"
            width={undefined}
            height={undefined}
            alt="Classic aspect ratio (4:3)"
          />
        </div>
        <span className="text-muted-foreground text-sm">Classic (4:3)</span>
      </div>
    </div>
  ),
};

/**
 * Gallery of images with different sizes and styles.
 */
export const Gallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682687220923-c58b9a4592ea"
        alt="Gallery image 1"
        radius="md"
        shadow="sm"
      />
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682687221175-9b0cd7ee9633"
        alt="Gallery image 2"
        radius="lg"
        isZoomed
      />
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682695795255-b236b1f1267d"
        alt="Gallery image 3"
        radius="xl"
        isBlurred
      />
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682695797221-8164ff1fafc9"
        alt="Gallery image 4"
        radius="full"
        width={300}
        height={300}
        objectFit="cover"
      />
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682686581551-867e0b208bd1"
        alt="Gallery image 5"
        shadow="lg"
      />
      <Image
        {...args}
        src="https://images.unsplash.com/photo-1682686580391-615b1e82cdd9"
        alt="Gallery image 6"
        isZoomed
        isBlurred
      />
    </div>
  ),
};

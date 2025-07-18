/**
 * SPDX-License-Identifier: MIT
 */

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'UI/Marquee',
  component: Marquee,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default example of a marquee with fading edges.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Marquee className="py-4">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {Array.from({ length: 10 }).map((_, i) => (
            <MarqueeItem key={i} className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="font-bold text-2xl">{i + 1}</span>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  ),
};

/**
 * Example of a marquee without fading edges.
 */
export const WithoutFading: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Marquee className="py-4">
        <MarqueeContent>
          {Array.from({ length: 10 }).map((_, i) => (
            <MarqueeItem key={i} className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="font-bold text-2xl">{i + 1}</span>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  ),
};

/**
 * Example with custom marquee options.
 */
export const CustomOptions: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Marquee className="py-4">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent
          speed={50}
          delay={0.5}
          direction="right"
          pauseOnHover={true}
          gradient={false}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <MarqueeItem key={i} className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="font-bold text-2xl">{i + 1}</span>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  ),
};

/**
 * Example with custom spacing between items.
 */
export const CustomSpacing: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Marquee className="py-4">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {Array.from({ length: 10 }).map((_, i) => (
            <MarqueeItem key={i} className="mx-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="font-bold text-2xl">{i + 1}</span>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  ),
};

/**
 * Example with custom content.
 */
export const CustomContent: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Marquee className="py-4">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {[
            'React',
            'TypeScript',
            'Tailwind CSS',
            'Next.js',
            'Storybook',
            'Shadcn UI',
          ].map((tech, i) => (
            <MarqueeItem key={i} className="flex items-center gap-4">
              <div className="flex h-16 items-center justify-center rounded-lg bg-primary px-6 text-primary-foreground">
                <span className="font-medium text-lg">{tech}</span>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  ),
};

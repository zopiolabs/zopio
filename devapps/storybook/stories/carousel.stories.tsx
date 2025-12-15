/**
 * SPDX-License-Identifier: MIT
 */

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/design-system/ui/carousel";
import type { Meta, StoryObj } from "@storybook/nextjs";

const slides = Array.from({ length: 5 }, (_, index) => ({
  id: `slide-${index + 1}`,
  label: index + 1,
}));

/**
 * A carousel with motion and swipe built using Embla.
 */
const meta: Meta<typeof Carousel> = {
  title: "ui/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-full max-w-xs",
  },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="flex aspect-square items-center justify-center rounded border bg-card p-6">
              <span className="font-semibold text-4xl">{slide.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the carousel.
 */
export const Default: Story = {};

/**
 * Use the `basis` utility class to change the size of the carousel.
 */
export const Size: Story = {
  render: (args) => (
    <Carousel {...args} className="mx-12 w-full max-w-xs">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem className="basis-1/3" key={slide.id}>
            <div className="flex aspect-square items-center justify-center rounded border bg-card p-6">
              <span className="font-semibold text-4xl">{slide.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  args: {
    className: "mx-12 w-full max-w-xs",
  },
};

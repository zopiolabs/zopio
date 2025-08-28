/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Avatar, AvatarFallback } from '@repo/design-system/ui/avatar';
import { Badge } from '@repo/design-system/ui/badge';
import { Marquee } from '@repo/design-system/ui/marquee';

/**
 * Marquees are a great way to show a list of items in a horizontal scrolling motion.
 */
const meta: Meta<typeof Marquee> = {
  title: 'ui/Marquee',
  component: Marquee,
  tags: ['autodocs'],
  argTypes: {
    speed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Animation speed (higher = faster)',
    },
    gap: {
      control: { type: 'range', min: 0, max: 100, step: 4 },
      description: 'Gap between items in pixels',
    },
    fade: {
      control: { type: 'boolean' },
      description: 'Show fade gradients on edges',
    },
    reverse: {
      control: { type: 'boolean' },
      description: 'Reverse animation direction',
    },
    vertical: {
      control: { type: 'boolean' },
      description: 'Vertical scrolling instead of horizontal',
    },
    pauseOnHover: {
      control: { type: 'boolean' },
      description: 'Pause animation on hover',
    },
    repeat: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Number of times to repeat content',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const companies = [
  'Microsoft',
  'Apple',
  'Google',
  'Amazon',
  'Meta',
  'Tesla',
  'Netflix',
  'Adobe',
  'Salesforce',
  'Oracle',
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechCorp',
    content: 'This product has transformed our workflow completely.',
    avatar: 'SJ',
  },
  {
    name: 'Mike Chen',
    role: 'CTO, StartupXYZ',
    content: 'Amazing performance and reliability.',
    avatar: 'MC',
  },
  {
    name: 'Emily Davis',
    role: 'Designer, CreativeStudio',
    content: 'The user experience is absolutely fantastic.',
    avatar: 'ED',
  },
  {
    name: 'Alex Rodriguez',
    role: 'Developer, CodeLab',
    content: "Best developer experience I've ever had.",
    avatar: 'AR',
  },
];

/**
 * The default marquee with text items.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full">
      <Marquee>
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex h-16 w-32 items-center justify-center rounded-lg border bg-white font-medium text-sm shadow-sm"
          >
            {company}
          </div>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Marquee without fade gradients.
 */
export const WithoutFade: Story = {
  render: () => (
    <div className="w-full">
      <Marquee fade={false}>
        {companies.map((company, index) => (
          <Badge key={index} variant="secondary" className="whitespace-nowrap">
            {company}
          </Badge>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Reverse direction marquee.
 */
export const Reverse: Story = {
  render: () => (
    <div className="w-full">
      <Marquee reverse>
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex h-12 w-24 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground text-xs"
          >
            {company}
          </div>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Different speeds.
 */
export const Speeds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 font-medium text-sm">Slow (speed: 20)</h3>
        <Marquee speed={20}>
          {companies.slice(0, 5).map((company, index) => (
            <Badge key={index} variant="outline">
              {company}
            </Badge>
          ))}
        </Marquee>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Normal (speed: 50)</h3>
        <Marquee speed={50}>
          {companies.slice(0, 5).map((company, index) => (
            <Badge key={index} variant="secondary">
              {company}
            </Badge>
          ))}
        </Marquee>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Fast (speed: 100)</h3>
        <Marquee speed={100}>
          {companies.slice(0, 5).map((company, index) => (
            <Badge key={index} variant="default">
              {company}
            </Badge>
          ))}
        </Marquee>
      </div>
    </div>
  ),
};

/**
 * Custom gap between items.
 */
export const CustomGap: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 font-medium text-sm">Small gap (8px)</h3>
        <Marquee gap={8}>
          {companies.slice(0, 6).map((company, index) => (
            <Badge key={index} variant="secondary">
              {company}
            </Badge>
          ))}
        </Marquee>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Large gap (32px)</h3>
        <Marquee gap={32}>
          {companies.slice(0, 6).map((company, index) => (
            <Badge key={index} variant="secondary">
              {company}
            </Badge>
          ))}
        </Marquee>
      </div>
    </div>
  ),
};

/**
 * Vertical marquee.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex justify-center">
      <div className="h-64 w-48">
        <Marquee vertical>
          {companies.slice(0, 6).map((company, index) => (
            <div
              key={index}
              className="flex h-12 w-full items-center justify-center rounded-md border bg-card font-medium text-sm"
            >
              {company}
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  ),
};

/**
 * Testimonials marquee.
 */
export const Testimonials: Story = {
  render: () => (
    <div className="w-full">
      <Marquee speed={30} pauseOnHover>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex w-80 flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
          >
            <p className="text-muted-foreground text-sm">
              "{testimonial.content}"
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {testimonial.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{testimonial.name}</p>
                <p className="text-muted-foreground text-xs">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Logo showcase.
 */
export const LogoShowcase: Story = {
  render: () => (
    <div className="w-full bg-muted/30 py-8">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-lg">Trusted by leading companies</h3>
      </div>
      <Marquee speed={15} pauseOnHover={false}>
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex h-16 w-32 items-center justify-center rounded-lg bg-white font-bold text-gray-800 text-lg shadow-sm"
          >
            {company}
          </div>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Multiple rows of marquees.
 */
export const MultipleRows: Story = {
  render: () => (
    <div className="space-y-4">
      <Marquee speed={50}>
        {companies.slice(0, 5).map((company, index) => (
          <Badge key={index} variant="default">
            {company}
          </Badge>
        ))}
      </Marquee>

      <Marquee speed={40} reverse>
        {companies.slice(5, 10).map((company, index) => (
          <Badge key={index} variant="secondary">
            {company}
          </Badge>
        ))}
      </Marquee>

      <Marquee speed={60}>
        {companies.slice(0, 4).map((company, index) => (
          <Badge key={index} variant="outline">
            {company}
          </Badge>
        ))}
      </Marquee>
    </div>
  ),
};

/**
 * Interactive marquee that pauses on hover.
 */
export const Interactive: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <p className="text-center text-muted-foreground text-sm">
        Hover over the marquee to pause the animation
      </p>
      <Marquee pauseOnHover>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex w-72 cursor-pointer flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {testimonial.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-xs">{testimonial.name}</p>
                <p className="text-muted-foreground text-xs">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              "{testimonial.content}"
            </p>
          </div>
        ))}
      </Marquee>
    </div>
  ),
};

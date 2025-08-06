/**
 * SPDX-License-Identifier: MIT
 */

import { HeroBadge } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight, Check, ExternalLink, Link } from 'lucide-react';

/**
 * A hero badge component that can be used as a button or link with icons.
 * It's designed to be visually prominent and interactive, perfect for call-to-action elements.
 */
const meta: Meta<typeof HeroBadge> = {
  title: 'ui/HeroBadge',
  component: HeroBadge,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the badge',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    icon: {
      description: 'Icon displayed before the text',
    },
    endIcon: {
      description: 'Icon displayed after the text',
    },
    href: {
      control: 'text',
      description: 'Optional URL to make the badge a link',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler for the badge',
    },
  },
  args: {
    text: 'Hero Badge',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default hero badge with primary styling.
 */
export const Default: Story = {};

/**
 * Hero badge with an outline style, providing a more subtle appearance.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    text: 'Outline Badge',
  },
};

/**
 * Ghost variant with minimal visual presence until hovered.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    text: 'Ghost Badge',
  },
};

/**
 * Hero badge with a leading icon to enhance visual recognition.
 */
export const WithIcon: Story = {
  args: {
    text: 'Badge with Icon',
    icon: <Check className="h-4 w-4" />,
  },
};

/**
 * Hero badge with both leading and trailing icons.
 */
export const WithBothIcons: Story = {
  args: {
    text: 'Badge with Icons',
    icon: <Check className="h-4 w-4" />,
    endIcon: <ArrowRight className="h-4 w-4" />,
  },
};

/**
 * Small-sized hero badge for compact UI areas.
 */
export const Small: Story = {
  args: {
    text: 'Small Badge',
    size: 'sm',
    icon: <Check className="h-3 w-3" />,
  },
};

/**
 * Large-sized hero badge for prominent UI elements.
 */
export const Large: Story = {
  args: {
    text: 'Large Badge',
    size: 'lg',
    icon: <Check className="h-5 w-5" />,
  },
};

/**
 * Hero badge as a link that navigates to a URL when clicked.
 */
export const AsLink: Story = {
  args: {
    text: 'Link Badge',
    href: '#',
    icon: <Link className="h-4 w-4" />,
    endIcon: <ExternalLink className="h-4 w-4" />,
  },
};

/**
 * A showcase of all hero badge variants and sizes.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex min-h-[350px] w-full items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <HeroBadge
            href="#"
            text="Default Badge"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
          <HeroBadge
            href="#"
            text="Outline Badge"
            variant="outline"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
          <HeroBadge
            href="#"
            text="Ghost Badge"
            variant="ghost"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <HeroBadge
            text="Small Badge"
            size="sm"
            icon={<Check className="h-3 w-3" />}
            onClick={() => alert('Small clicked!')}
          />
          <HeroBadge
            text="Medium Badge"
            size="md"
            icon={<Check className="h-4 w-4" />}
            onClick={() => alert('Medium clicked!')}
          />
          <HeroBadge
            text="Large Badge"
            size="lg"
            icon={<Check className="h-5 w-5" />}
            onClick={() => alert('Large clicked!')}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Dark theme showcase of hero badges.
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="flex min-h-[350px] w-full items-center justify-center rounded-xl bg-gray-950 p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <HeroBadge
            href="#"
            text="Default Badge"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
          <HeroBadge
            href="#"
            text="Outline Badge"
            variant="outline"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
          <HeroBadge
            href="#"
            text="Ghost Badge"
            variant="ghost"
            icon={<Check className="h-4 w-4" />}
            endIcon={<ArrowRight className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  ),
};

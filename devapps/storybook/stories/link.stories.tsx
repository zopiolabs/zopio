/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight, Github, Mail } from 'lucide-react';

import { Link } from '@repo/design-system/ui';

/**
 * The Link component provides accessible navigation with various styling options.
 * It supports different variants, underline styles, and can be used with external links.
 */
const meta: Meta<typeof Link> = {
  title: 'ui/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    href: {
      control: 'text',
    },
    external: {
      control: 'boolean',
    },
    hideExternalIcon: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    underline: 'hover',
    size: 'default',
    children: 'Link Text',
    href: '#',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default link style with hover underline effect.
 */
export const Default: Story = {};

/**
 * Link with permanent underline for stronger visual emphasis.
 */
export const AlwaysUnderlined: Story = {
  args: {
    underline: 'always',
  },
};

/**
 * Link with no underline for cleaner appearance in certain contexts.
 */
export const NoUnderline: Story = {
  args: {
    underline: 'none',
  },
};

/**
 * Destructive variant for actions that require caution.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

/**
 * Muted variant for less emphasized links.
 */
export const Muted: Story = {
  args: {
    variant: 'muted',
  },
};

/**
 * Accent variant for links that should stand out with accent colors.
 */
export const Accent: Story = {
  args: {
    variant: 'accent',
  },
};

/**
 * Small size variant for compact UI contexts.
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Large size variant for improved visibility and accessibility.
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

/**
 * External link with automatic external icon and proper security attributes.
 */
export const External: Story = {
  args: {
    children: 'External Link',
    external: true,
  },
};

/**
 * External link without the external icon.
 */
export const ExternalNoIcon: Story = {
  args: {
    children: 'External Link (No Icon)',
    external: true,
    hideExternalIcon: true,
  },
};

/**
 * Link with a leading icon for enhanced visual communication.
 */
export const WithLeadingIcon: Story = {
  render: (args) => (
    <Link {...args}>
      <Mail className="size-4" />
      Contact Us
    </Link>
  ),
};

/**
 * Link with a trailing icon to indicate direction or action.
 */
export const WithTrailingIcon: Story = {
  render: (args) => (
    <Link {...args}>
      View Documentation
      <ArrowRight className="size-4" />
    </Link>
  ),
};

/**
 * Link used within a paragraph of text to demonstrate contextual usage.
 */
export const InlineWithText: Story = {
  render: (args) => (
    <p className="max-w-md text-base">
      This is a paragraph with an <Link {...args}>inline link</Link> embedded
      within the text to demonstrate how links appear in context.
    </p>
  ),
};

/**
 * Link styled as a button for call-to-action scenarios.
 */
export const ButtonLike: Story = {
  render: (args) => (
    <Link
      {...args}
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
    >
      Sign Up Now
    </Link>
  ),
};

/**
 * Disabled link state for unavailable actions.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-disabled': true,
  },
};

/**
 * Link with custom styling to demonstrate flexibility.
 */
export const CustomStyling: Story = {
  args: {
    className:
      'font-bold text-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500',
    children: 'Custom Styled Link',
  },
};

/**
 * Link with GitHub icon as an example of a social link.
 */
export const SocialLink: Story = {
  render: (args) => (
    <Link {...args}>
      <Github className="size-4" />
      GitHub Repository
    </Link>
  ),
  args: {
    external: true,
  },
};

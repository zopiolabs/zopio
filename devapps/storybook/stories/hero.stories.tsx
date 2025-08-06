/**
 * SPDX-License-Identifier: MIT
 */

import { Card } from '@repo/design-system/ui';
import { Hero } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { LucideBook, LucideComponent, LucideSquare } from 'lucide-react';

const meta: Meta<typeof Hero> = {
  title: 'ui/Hero',
  component: Hero,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Basic: Story = {
  render: () => (
    <Hero
      content={{
        title: 'Welcome to',
        titleHighlight: 'my website',
        description: 'A beautiful landing page built with PrismUI.',
        primaryAction: { href: '/get-started', text: 'Get Started' },
      }}
    />
  ),
};

export const WithPillAndPreview: Story = {
  render: () => (
    <Hero
      pill={{
        text: 'New! PrismUI Components',
        href: '/docs',
        icon: <LucideSquare className="h-4 w-4" />,
      }}
      content={{
        title: 'The better way to',
        titleHighlight: 'build apps fast',
        description:
          'A fully customizable component library built on top of shadcn/ui. Beautiful, accessible, and ready for production.',
        primaryAction: {
          href: '/docs',
          text: 'Documentation',
          icon: <LucideBook className="h-4 w-4" />,
        },
        secondaryAction: {
          href: '/docs',
          text: 'Components',
          icon: <LucideComponent className="h-4 w-4" />,
        },
      }}
      preview={
        <Card className="flex aspect-video items-center justify-center bg-muted p-8 text-muted-foreground">
          Component Preview
        </Card>
      }
    />
  ),
};

export const CustomStyled: Story = {
  render: () => (
    <Hero
      content={{
        title: 'Custom Styled',
        titleHighlight: 'hero section',
        description: 'With custom styling.',
        primaryAction: { href: '/get-started', text: 'Get Started' },
      }}
      className="bg-gradient-to-r from-blue-500 to-purple-500"
    />
  ),
};

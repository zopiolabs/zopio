/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  OpenSource,
  type OpenSourceStats,
} from '@repo/design-system/ui/open-source';

/**
 * A beautiful and interactive open-source project showcase component with animations and contributor statistics.
 */
const meta: Meta<typeof OpenSource> = {
  title: 'ui/OpenSource',
  component: OpenSource,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'hero'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'full'],
    },
    showContributors: {
      control: 'boolean',
    },
    maxContributors: {
      control: 'number',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    showContributors: true,
    maxContributors: 8,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const defaultStats: OpenSourceStats = {
  stars: 1247,
  forks: 89,
  contributors: [
    {
      login: 'sarah-dev',
      avatar_url:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      html_url: 'https://github.com/sarah-dev',
    },
    {
      login: 'mike-codes',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      html_url: 'https://github.com/mike-codes',
    },
    {
      login: 'alex-ui',
      avatar_url:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      html_url: 'https://github.com/alex-ui',
    },
    {
      login: 'emma-design',
      avatar_url:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      html_url: 'https://github.com/emma-design',
    },
    {
      login: 'john-frontend',
      avatar_url:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      html_url: 'https://github.com/john-frontend',
    },
  ],
};

/**
 * Default open source showcase.
 */
export const Default: Story = {
  args: {
    repository: 'username/awesome-project',
    defaultStats,
  },
};

/**
 * Compact variant for smaller spaces.
 */
export const Compact: Story = {
  args: {
    repository: 'username/ui-library',
    variant: 'compact',
    defaultStats,
  },
};

/**
 * Hero variant for landing pages.
 */
export const Hero: Story = {
  args: {
    repository: 'username/design-system',
    variant: 'hero',
    size: 'lg',
    title: 'Built by the community',
    description:
      'Join thousands of developers building the future of web development with our open-source design system.',
    buttonText: 'Contribute on GitHub',
    defaultStats: {
      ...defaultStats,
      stars: 5420,
      forks: 342,
    },
  },
};

/**
 * Custom content and styling.
 */
export const CustomContent: Story = {
  args: {
    repository: 'username/react-components',
    title: 'Community Driven',
    description:
      'Our component library is built with love by developers from around the world.',
    buttonText: 'Join the Community',
    defaultStats,
  },
};

/**
 * Without contributors display.
 */
export const NoContributors: Story = {
  args: {
    repository: 'username/simple-project',
    showContributors: false,
    defaultStats,
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    repository: 'username/mini-lib',
    size: 'sm',
    variant: 'compact',
    defaultStats: {
      stars: 89,
      forks: 12,
      contributors: defaultStats.contributors.slice(0, 3),
    },
  },
};

/**
 * Large project with many contributors.
 */
export const PopularProject: Story = {
  args: {
    repository: 'username/popular-framework',
    size: 'lg',
    title: 'Trusted by thousands',
    description:
      'The most popular open-source framework for building modern web applications.',
    defaultStats: {
      stars: 45600,
      forks: 8900,
      contributors: [
        ...defaultStats.contributors,
        {
          login: 'lisa-backend',
          avatar_url:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          html_url: 'https://github.com/lisa-backend',
        },
        {
          login: 'david-devops',
          avatar_url:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
          html_url: 'https://github.com/david-devops',
        },
        {
          login: 'maria-qa',
          avatar_url:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
          html_url: 'https://github.com/maria-qa',
        },
      ],
    },
  },
};

/**
 * Full width layout.
 */
export const FullWidth: Story = {
  args: {
    repository: 'username/enterprise-solution',
    size: 'full',
    variant: 'hero',
    title: 'Enterprise-grade open source',
    description:
      "Scalable, secure, and battle-tested by the world's leading companies.",
    defaultStats,
  },
  parameters: {
    layout: 'padded',
  },
};

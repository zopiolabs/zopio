/**
 * SPDX-License-Identifier: MIT
 */

import { LogoCarousel } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Airplay,
  Chrome,
  Codepen,
  Codesandbox,
  Dribbble,
  Figma,
  Framer,
  Github,
  Gitlab,
  Linkedin,
  Slack,
  Twitter,
} from 'lucide-react';

/**
 * The Logo Carousel component provides a smooth, animated way to showcase logos in multiple columns.
 * Perfect for partner showcases, client logos, and brand displays with automatic cycling and responsive design.
 */
const meta: Meta<typeof LogoCarousel> = {
  title: 'ui/LogoCarousel',
  component: LogoCarousel,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Number of columns to display',
      table: {
        defaultValue: { summary: '2' },
      },
    },
    cycleDuration: {
      control: { type: 'range', min: 500, max: 5000, step: 500 },
      description: 'Duration between logo changes in milliseconds',
      table: {
        defaultValue: { summary: '2000' },
      },
    },
    logoSize: {
      control: { type: 'range', min: 16, max: 48, step: 4 },
      description: 'Size of the logo icons',
      table: {
        defaultValue: { summary: '24' },
      },
    },
    useSpring: {
      control: 'boolean',
      description: 'Whether to use spring animation',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    columns: 2,
    cycleDuration: 2000,
    logoSize: 24,
    useSpring: true,
  },
  render: (args) => (
    <LogoCarousel
      {...args}
      logos={[
        { id: 1, name: 'Github', icon: Github },
        { id: 2, name: 'Twitter', icon: Twitter },
        { id: 3, name: 'Figma', icon: Figma },
        { id: 4, name: 'Slack', icon: Slack },
        { id: 5, name: 'Chrome', icon: Chrome },
        { id: 6, name: 'Dribbble', icon: Dribbble },
        { id: 7, name: 'Framer', icon: Framer },
        { id: 8, name: 'Airplay', icon: Airplay },
      ]}
    />
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LogoCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default logo carousel with 2 columns.
 */
export const Default: Story = {};

/**
 * Logo carousel with 3 columns.
 */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
  },
};

/**
 * Logo carousel with custom logos.
 */
export const CustomLogos: Story = {
  render: (args) => (
    <LogoCarousel
      {...args}
      columns={4}
      logos={[
        { id: 1, name: 'Github', icon: Github },
        { id: 2, name: 'Gitlab', icon: Gitlab },
        { id: 3, name: 'Codepen', icon: Codepen },
        { id: 4, name: 'Codesandbox', icon: Codesandbox },
        { id: 5, name: 'Linkedin', icon: Linkedin },
        { id: 6, name: 'Twitter', icon: Twitter },
        { id: 7, name: 'Figma', icon: Figma },
        { id: 8, name: 'Airplay', icon: Airplay },
        { id: 9, name: 'Chrome', icon: Chrome },
        { id: 10, name: 'Dribbble', icon: Dribbble },
        { id: 11, name: 'Framer', icon: Framer },
      ]}
    />
  ),
};

/**
 * Logo carousel with faster animation.
 */
export const FastAnimation: Story = {
  args: {
    columns: 3,
    cycleDuration: 1000,
  },
};

/**
 * Logo carousel with larger logos.
 */
export const LargeLogos: Story = {
  args: {
    columns: 2,
    logoSize: 40,
  },
};

/**
 * Logo carousel with non-spring animation.
 */
export const NonSpringAnimation: Story = {
  args: {
    columns: 3,
    useSpring: false,
  },
};

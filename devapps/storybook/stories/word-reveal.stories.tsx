/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { WordReveal } from '@repo/design-system/ui/word-reveal';

/**
 * A text animation component that reveals words with a staggered motion effect.
 */
const meta: Meta<typeof WordReveal> = {
  title: 'ui/WordReveal',
  component: WordReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 200,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'accent', 'primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    delay: {
      control: 'number',
    },
    duration: {
      control: 'number',
    },
    stagger: {
      control: 'number',
    },
    blur: {
      control: 'boolean',
    },
    once: {
      control: 'boolean',
    },
  },
  args: {
    text: 'Animate text with style',
    variant: 'default',
    size: 'default',
    weight: 'normal',
    delay: 0.1,
    duration: 0.6,
    stagger: 0.1,
    blur: true,
    once: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic word reveal animation.
 */
export const Default: Story = {};

/**
 * Large hero text with bold weight.
 */
export const Hero: Story = {
  args: {
    text: 'Build amazing experiences with beautiful animations',
    size: '3xl',
    weight: 'bold',
  },
};

/**
 * Custom delay for slower animation.
 */
export const SlowReveal: Story = {
  args: {
    text: 'Slower animation with custom delay',
    delay: 0.3,
    stagger: 0.2,
    duration: 0.8,
  },
};

/**
 * Fast reveal animation.
 */
export const FastReveal: Story = {
  args: {
    text: 'Quick and snappy animation',
    delay: 0.05,
    stagger: 0.05,
    duration: 0.3,
  },
};

/**
 * Without blur effect.
 */
export const NoBlur: Story = {
  args: {
    text: 'Animation without blur effect',
    blur: false,
  },
};

/**
 * Primary colored text.
 */
export const Primary: Story = {
  args: {
    text: 'Primary colored reveal animation',
    variant: 'primary',
    size: 'lg',
    weight: 'semibold',
  },
};

/**
 * Muted text variant.
 */
export const Muted: Story = {
  args: {
    text: 'Subtle muted text animation',
    variant: 'muted',
    size: 'lg',
  },
};

/**
 * Large display text.
 */
export const LargeDisplay: Story = {
  args: {
    text: 'Revolutionary Design System',
    size: '4xl',
    weight: 'bold',
    stagger: 0.15,
  },
};

/**
 * Marketing headline style.
 */
export const Marketing: Story = {
  args: {
    text: 'Transform your ideas into reality with cutting-edge technology',
    size: '2xl',
    weight: 'semibold',
    variant: 'accent',
  },
};

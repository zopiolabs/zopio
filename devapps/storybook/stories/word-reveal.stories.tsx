/**
 * SPDX-License-Identifier: MIT
 */

import { WordReveal } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof WordReveal> = {
  title: 'UI/WordReveal',
  component: WordReveal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to be revealed word by word',
    },
    delay: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: 'Delay between each word animation in seconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WordReveal>;

/**
 * Default word reveal animation with standard settings
 */
export const Default: Story = {
  args: {
    text: 'Animate text word by word',
  },
};

/**
 * Word reveal with custom styling
 */
export const CustomStyling: Story = {
  args: {
    text: 'Custom styled animated text',
    className: 'text-blue-500 font-light',
  },
};

/**
 * Word reveal with slower animation
 */
export const SlowAnimation: Story = {
  args: {
    text: 'This animation is slower than default',
    delay: 0.3,
  },
};

/**
 * Word reveal with longer text content
 */
export const LongText: Story = {
  args: {
    text: 'This is a longer piece of text that demonstrates how the component handles multiple words in a sentence with proper spacing and animation timing',
  },
};

/**
 * Dark theme word reveal
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="rounded-xl bg-gray-950 p-8">
      <WordReveal
        text="Elegant animations in dark mode"
        className="text-white"
      />
    </div>
  ),
};

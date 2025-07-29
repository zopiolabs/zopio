/**
 * SPDX-License-Identifier: MIT
 */

import {
  Blockquote,
  BlockquoteAuthor,
} from '@repo/design-system/ui/blockquote';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Blockquote> = {
  title: 'UI/Blockquote',
  component: Blockquote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Blockquote>;

/**
 * Default blockquote with author
 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Blockquote>
        Happiness lies not in the mere possession of money; it lies in the joy
        of achievement, in the thrill of creative effort.
        <BlockquoteAuthor>Franklin Roosevelt</BlockquoteAuthor>
      </Blockquote>
    </div>
  ),
};

/**
 * Blockquote without author
 */
export const WithoutAuthor: Story = {
  render: () => (
    <div className="w-96">
      <Blockquote>
        The best way to predict the future is to invent it.
      </Blockquote>
    </div>
  ),
};

/**
 * Blockquote with custom styling
 */
export const CustomStyled: Story = {
  render: () => (
    <div className="w-96">
      <Blockquote className="border-l-blue-600 bg-blue-50 text-blue-700 before:text-blue-600">
        Design is not just what it looks like and feels like. Design is how it
        works.
        <BlockquoteAuthor className="text-blue-800">
          Steve Jobs
        </BlockquoteAuthor>
      </Blockquote>
    </div>
  ),
};

/**
 * Dark theme blockquote
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="w-96 rounded-xl bg-gray-950 p-8">
      <Blockquote className="border-l-gray-400 bg-gray-800 text-gray-300 before:text-gray-400">
        The future belongs to those who believe in the beauty of their dreams.
        <BlockquoteAuthor className="text-gray-200">
          Eleanor Roosevelt
        </BlockquoteAuthor>
      </Blockquote>
    </div>
  ),
};

/**
 * Blockquote with longer content
 */
export const LongContent: Story = {
  render: () => (
    <div className="w-96">
      <Blockquote>
        We choose to go to the moon in this decade and do the other things, not
        because they are easy, but because they are hard, because that goal will
        serve to organize and measure the best of our energies and skills,
        because that challenge is one that we are willing to accept, one we are
        unwilling to postpone, and one which we intend to win.
        <BlockquoteAuthor>John F. Kennedy</BlockquoteAuthor>
      </Blockquote>
    </div>
  ),
};

/**
 * Blockquote with HTML content
 */
export const WithHTMLContent: Story = {
  render: () => (
    <div className="w-96">
      <Blockquote>
        <span>
          The <strong>greatest glory</strong> in living lies not in never
          falling, but in <em>rising every time we fall</em>.
        </span>
        <BlockquoteAuthor>Nelson Mandela</BlockquoteAuthor>
      </Blockquote>
    </div>
  ),
};

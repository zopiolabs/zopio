/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui/button';
import { Typewriter } from '@repo/design-system/ui/typewriter';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof Typewriter> = {
  title: 'UI/Typewriter',
  component: Typewriter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Typewriter>;

/**
 * Basic usage of the Typewriter component with default settings.
 */
export const Default: Story = {
  args: {
    text: 'This is a simple typewriter effect.',
    typeSpeed: 50,
  },
};

/**
 * Typewriter with HTML formatting support.
 */
export const WithHtmlFormatting: Story = {
  args: {
    text: 'This text has <strong>bold</strong>, <em>italic</em>, and <span style="color: blue;">colored</span> formatting.',
    typeSpeed: 40,
  },
};

/**
 * Typewriter with a very slow typing speed.
 */
export const SlowTyping: Story = {
  args: {
    text: 'This text types very slowly...',
    typeSpeed: 150,
  },
};

/**
 * Typewriter with a very fast typing speed.
 */
export const FastTyping: Story = {
  args: {
    text: 'This text types very quickly!',
    typeSpeed: 10,
  },
};

/**
 * Typewriter with a completion callback.
 */
export const WithCompletionCallback: Story = {
  render: () => {
    const [completed, setCompleted] = useState(false);

    return (
      <div className="space-y-4">
        <Typewriter
          text="This text will trigger a callback when typing is complete."
          typeSpeed={30}
          onComplete={() => setCompleted(true)}
        />
        {completed && (
          <div className="font-medium text-green-500">✓ Typing completed!</div>
        )}
      </div>
    );
  },
};

/**
 * Interactive demo with a longer text passage.
 */
export const LongTextDemo: Story = {
  render: () => {
    const [isTyping, setIsTyping] = useState(false);
    const [text, setText] = useState('');

    const startTyping = () => {
      setIsTyping(true);
      setText(DEMO_TEXT);
    };

    const resetTyping = () => {
      setIsTyping(false);
      setText('');
    };

    return (
      <div className="max-w-2xl space-y-4">
        <div className="flex space-x-4">
          <Button onClick={startTyping} disabled={isTyping}>
            Start Typing
          </Button>
          <Button
            onClick={resetTyping}
            variant="outline"
            disabled={!isTyping && text === ''}
          >
            Reset
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          {text ? (
            <Typewriter
              text={text}
              typeSpeed={20}
              onComplete={() => setIsTyping(false)}
            />
          ) : (
            <div className="text-muted-foreground italic">
              Click "Start Typing" to begin the demo
            </div>
          )}
        </div>
      </div>
    );
  },
};

const DEMO_TEXT = `Lorem Ipsum is <strong>simply dummy text</strong> of the printing and typesetting industry. Lorem Ipsum
has been the industry's standard dummy text ever since the 1500s, when an unknown
printer took a galley of type and scrambled it to make a type specimen book. It has
survived not only five centuries, but also the leap into electronic typesetting,
remaining essentially unchanged. It was popularised in the 1960s with the release of
Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

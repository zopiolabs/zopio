/**
 * SPDX-License-Identifier: MIT
 */

import { Divider } from '@repo/design-system/ui/divider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

/**
 * Basic horizontal divider.
 */
export const Default: Story = {
  render: () => (
    <div className="w-80 rounded-lg bg-background p-4">
      <div className="text-sm">Content above</div>
      <Divider className="my-4" />
      <div className="text-sm">Content below</div>
    </div>
  ),
};

/**
 * Vertical divider between elements.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center rounded-lg bg-background p-4">
      <div className="text-sm">Left</div>
      <Divider orientation="vertical" className="mx-4 h-full" />
      <div className="text-sm">Right</div>
    </div>
  ),
};

/**
 * Divider with text content.
 */
export const WithText: Story = {
  render: () => (
    <div className="w-80 rounded-lg bg-background p-4">
      <div className="text-sm">Content above</div>
      <Divider className="my-4">OR</Divider>
      <div className="text-sm">Content below</div>
    </div>
  ),
};

/**
 * Divider with different text alignments.
 */
export const TextAlignment: Story = {
  render: () => (
    <div className="w-80 space-y-6 rounded-lg bg-background p-4">
      <div>
        <div className="text-sm">Default center alignment</div>
        <Divider className="my-2">CENTER</Divider>
      </div>
      <div>
        <div className="text-sm">Left alignment</div>
        <Divider className="my-2" textAlign="left">
          LEFT
        </Divider>
      </div>
      <div>
        <div className="text-sm">Right alignment</div>
        <Divider className="my-2" textAlign="right">
          RIGHT
        </Divider>
      </div>
    </div>
  ),
};

/**
 * Divider with different variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-6 rounded-lg bg-background p-4">
      <div>
        <div className="text-sm">Default variant</div>
        <Divider className="my-2" />
      </div>
      <div>
        <div className="text-sm">Inset variant</div>
        <Divider className="my-2" variant="inset" />
      </div>
      <div>
        <div className="text-sm">Middle variant</div>
        <Divider className="my-2" variant="middle" />
      </div>
    </div>
  ),
};

/**
 * Dashed divider style.
 */
export const Dashed: Story = {
  render: () => (
    <div className="w-80 rounded-lg bg-background p-4">
      <div className="text-sm">Content above</div>
      <Divider className="my-4" dashed />
      <div className="text-sm">Content below</div>
    </div>
  ),
};

/**
 * Divider in a flex container.
 */
export const FlexItem: Story = {
  render: () => (
    <div className="flex h-20 items-center rounded-lg bg-background p-4">
      <div className="flex items-center space-x-2">
        <svg
          aria-labelledby="align-left-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title id="align-left-icon">Align Left</title>
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="15" x2="3" y1="12" y2="12" />
          <line x1="17" x2="3" y1="18" y2="18" />
        </svg>
        <svg
          aria-labelledby="align-center-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title id="align-center-icon">Align Center</title>
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="17" x2="7" y1="12" y2="12" />
          <line x1="19" x2="5" y1="18" y2="18" />
        </svg>
        <svg
          aria-labelledby="align-right-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title id="align-right-icon">Align Right</title>
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="21" x2="9" y1="12" y2="12" />
          <line x1="21" x2="7" y1="18" y2="18" />
        </svg>
      </div>
      <Divider orientation="vertical" flexItem className="mx-4 h-10" />
      <div className="flex items-center space-x-2">
        <svg
          aria-labelledby="bold-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title id="bold-icon">Bold</title>
          <path d="M14 12a4 4 0 0 0 0-8H6v8" />
          <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
        </svg>
        <svg
          aria-labelledby="italic-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title id="italic-icon">Italic</title>
          <line x1="19" x2="10" y1="4" y2="4" />
          <line x1="14" x2="5" y1="20" y2="20" />
          <line x1="15" x2="9" y1="4" y2="20" />
        </svg>
      </div>
    </div>
  ),
};

/**
 * Responsive divider that changes orientation based on screen size.
 */
export const Responsive: Story = {
  render: () => (
    <div className="flex w-80 flex-col rounded-lg bg-background p-4 sm:flex-row">
      <div className="grid h-20 place-items-center rounded-md bg-muted">
        Content
      </div>
      <Divider
        className="sm:orientation-vertical my-2 sm:mx-2 sm:my-0 sm:h-auto"
        orientation="horizontal"
      >
        OR
      </Divider>
      <div className="grid h-20 place-items-center rounded-md bg-muted">
        Content
      </div>
    </div>
  ),
};

/**
 * Complete example showing multiple divider variants.
 */
export const CompleteExample: Story = {
  render: () => (
    <div className="w-96 space-y-6 rounded-lg bg-background p-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Section 1</h3>
        <p className="text-muted-foreground text-sm">
          This is the first section of content showing a basic divider.
        </p>
      </div>

      <Divider />

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Section 2</h3>
        <p className="text-muted-foreground text-sm">
          This section demonstrates a divider with text.
        </p>
      </div>

      <Divider>SECTION BREAK</Divider>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Section 3</h3>
        <p className="text-muted-foreground text-sm">
          This section shows a dashed divider with left-aligned text.
        </p>
      </div>

      <Divider dashed textAlign="left">
        NOTES
      </Divider>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            aria-labelledby="document-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title id="document-icon">Document</title>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm">Document.pdf</span>
        </div>

        <Divider orientation="vertical" className="mx-4 h-8" />

        <div className="flex items-center space-x-2">
          <svg
            aria-labelledby="image-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title id="image-icon">Image</title>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="text-sm">Image.png</span>
        </div>
      </div>
    </div>
  ),
};

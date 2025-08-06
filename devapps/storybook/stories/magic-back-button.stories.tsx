/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowLeft, ChevronLeft, Home } from 'lucide-react';

import { MagicBackButton } from '@repo/design-system/ui';

/**
 * The Magic Back Button is designed to prevent users from unintentionally leaving your site.
 * When a user directly visits a page with this button (i.e., their first visit),
 * clicking the button will redirect them to the homepage or specified backLink.
 *
 * If they navigate to the page from another part of the site, the button behaves like
 * a normal back button, without disrupting the browser's history records.
 */
const meta: Meta<typeof MagicBackButton> = {
  title: 'ui/MagicBackButton',
  component: MagicBackButton,
  tags: ['autodocs'],
  argTypes: {
    backLink: {
      control: 'text',
      description:
        'The URL to navigate to when the user directly visits the page',
      defaultValue: '/',
    },
    isFirstPage: {
      control: 'boolean',
      description:
        'Force the button to behave as if this is the first page in navigation history',
    },
    children: {
      control: 'text',
      description: 'Optional custom content for the button',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button that intelligently navigates back in history or to a fallback route.',
      },
    },
  },
  args: {
    variant: 'outline',
    size: 'icon',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default state of the Magic Back Button.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="max-w-md text-center text-muted-foreground">
        <p className="mb-2">
          Try opening this page link in a new tab, and you'll notice the button
          will navigate directly to the homepage.
        </p>
        <p>
          However, if you navigate to this page from another component, the
          button will simply go back to the previous page.
        </p>
      </div>
      <MagicBackButton {...args} />
    </div>
  ),
};

/**
 * The Magic Back Button with custom icon.
 */
export const WithCustomIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <MagicBackButton {...args}>
        <ChevronLeft className="size-4" />
      </MagicBackButton>
      <MagicBackButton {...args}>
        <ArrowLeft className="size-4" />
      </MagicBackButton>
      <MagicBackButton {...args}>
        <Home className="size-4" />
      </MagicBackButton>
    </div>
  ),
};

/**
 * The Magic Back Button with different variants.
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <MagicBackButton {...args} variant="default" />
      <MagicBackButton {...args} variant="destructive" />
      <MagicBackButton {...args} variant="outline" />
      <MagicBackButton {...args} variant="secondary" />
      <MagicBackButton {...args} variant="ghost" />
      <MagicBackButton {...args} variant="link">
        <ChevronLeft className="mr-2 size-4" />
        <span>Back</span>
      </MagicBackButton>
    </div>
  ),
};

/**
 * The Magic Back Button with different sizes.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <MagicBackButton {...args} size="default">
        <ChevronLeft className="mr-2 size-4" />
        <span>Back</span>
      </MagicBackButton>
      <MagicBackButton {...args} size="sm">
        <ChevronLeft className="mr-2 size-4" />
        <span>Back</span>
      </MagicBackButton>
      <MagicBackButton {...args} size="lg">
        <ChevronLeft className="mr-2 size-4" />
        <span>Back</span>
      </MagicBackButton>
      <MagicBackButton {...args} size="icon" />
    </div>
  ),
};

/**
 * The Magic Back Button with custom backLink.
 */
export const CustomBackLink: Story = {
  args: {
    backLink: '/docs',
  },
  render: (args) => (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="max-w-md text-center text-muted-foreground">
        <p className="mb-2">
          This button will navigate to <code>/docs</code> when clicked on first
          page visit.
        </p>
      </div>
      <MagicBackButton {...args} />
    </div>
  ),
};

/**
 * The Magic Back Button with forced first page state.
 */
export const ForcedFirstPage: Story = {
  args: {
    isFirstPage: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="max-w-md text-center text-muted-foreground">
        <p className="mb-2">
          This button is forced to behave as if this is the first page visit. It
          will always navigate to the homepage when clicked.
        </p>
      </div>
      <MagicBackButton {...args} />
    </div>
  ),
};

/**
 * The Magic Back Button with forced navigation history.
 */
export const ForcedNavigationHistory: Story = {
  args: {
    isFirstPage: false,
  },
  render: (args) => (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="max-w-md text-center text-muted-foreground">
        <p className="mb-2">
          This button is forced to behave as if the user navigated here from
          another page. It will always use <code>router.back()</code> when
          clicked.
        </p>
      </div>
      <MagicBackButton {...args} />
    </div>
  ),
};

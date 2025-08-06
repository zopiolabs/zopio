/**
 * SPDX-License-Identifier: MIT
 */

import { H1, H2, H3, H4, H5, H6, P } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof H1> = {
  title: 'UI/HeadingWithAnchor',
  component: H1,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof H1>;

export const Heading1: Story = {
  args: {
    children: 'Heading 1',
    anchor: 'heading-1',
  },
};

export const Heading1WithCloseAlignment: Story = {
  args: {
    children: 'Heading 1 with Close Alignment',
    anchor: 'heading-1-close',
    anchorAlignment: 'close',
  },
};

export const Heading1WithHoverVisibility: Story = {
  args: {
    children: 'Heading 1 with Hover Visibility',
    anchor: 'heading-1-hover',
    anchorVisibility: 'hover',
  },
};

export const Heading1WithCustomStyle: Story = {
  args: {
    children: 'Heading 1 with Custom Style',
    anchor: 'heading-1-custom',
    className: 'border-b-2 border-gray-200 pb-2',
  },
};

export const WithoutAnchor: Story = {
  args: {
    children: 'Heading 1 without Anchor',
  },
};

export const DisableCopyToClipboard: Story = {
  args: {
    children: 'Heading 1 with Disabled Copy',
    anchor: 'heading-1-no-copy',
    disableCopyToClipboard: true,
  },
};

export const AllHeadings: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-6">
      <H1 anchor="demo-h1">Heading 1 with Anchor</H1>
      <H2 anchor="demo-h2">Heading 2 with Anchor</H2>
      <H3 anchor="demo-h3">Heading 3 with Anchor</H3>
      <H4 anchor="demo-h4">Heading 4 with Anchor</H4>
      <H5 anchor="demo-h5">Heading 5 with Anchor</H5>
      <H6 anchor="demo-h6">Heading 6 with Anchor</H6>
      <P anchor="demo-p">Paragraph with Anchor</P>
    </div>
  ),
};

export const AnchorVisibilityOptions: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-6">
      <H1 anchor="always-visible" anchorVisibility="always">
        Always Visible Anchor
      </H1>
      <H1 anchor="hover-visible" anchorVisibility="hover">
        Hover Visible Anchor
      </H1>
      <H1 anchor="never-visible" anchorVisibility="never">
        Never Visible Anchor
      </H1>
    </div>
  ),
};

export const AnchorAlignmentOptions: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-6">
      <H1 anchor="spaced-alignment" anchorAlignment="spaced">
        Spaced Alignment (Default)
      </H1>
      <H1 anchor="close-alignment" anchorAlignment="close">
        Close Alignment
      </H1>
    </div>
  ),
};

export const HeadingWithAnchorDemo: Story = {
  render: () => (
    <div className="w-full space-y-5 px-10">
      <H1 anchor="demo-heading-1" className="border-gray-200 border-b-2 pb-2">
        Heading 1
      </H1>
      <H1
        anchor="demo-heading-align"
        className="border-gray-200 border-b-2 pb-2"
        anchorAlignment="close"
      >
        Heading 1 align
      </H1>
    </div>
  ),
};

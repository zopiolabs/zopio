/**
 * SPDX-License-Identifier: MIT
 */

import { Separator } from "@repo/design-system/ui/separator";
import type { Meta, StoryObj } from "@storybook/nextjs";

/**
 * Visually or semantically separates content.
 */
const meta: Meta<typeof Separator> = {
  title: "ui/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the separator.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="flex gap-2">
      <div>Left</div>
      <Separator className="h-auto" orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};

/**
 * A vertical separator.
 */
export const Vertical: Story = {
  render: () => (
    <div className="grid gap-2">
      <div>Top</div>
      <Separator orientation="horizontal" />
      <div>Bottom</div>
    </div>
  ),
};

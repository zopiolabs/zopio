/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommandSeparator } from 'cmdk';
import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/ui/command';

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

/**
 * Fast, composable, unstyled command menu for React.
 */
const meta: Meta<typeof Command> = {
  title: 'ui/Command',
  component: Command,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    className: 'rounded-lg w-96 border shadow-md',
  },
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {/* Using React.createElement with CommandGroupProps interface */}
        {React.createElement(
          CommandGroup as React.ComponentType<CommandGroupProps>,
          { heading: 'Suggestions' },
          <CommandItem>Calendar</CommandItem>,
          <CommandItem>Search Emoji</CommandItem>,
          <CommandItem>Calculator</CommandItem>
        )}
        <CommandSeparator />
        {React.createElement(
          CommandGroup as React.ComponentType<CommandGroupProps>,
          { heading: 'Settings' },
          <CommandItem>Profile</CommandItem>,
          <CommandItem>Billing</CommandItem>,
          <CommandItem>Settings</CommandItem>
        )}
      </CommandList>
    </Command>
  ),
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the command.
 */
export const Default: Story = {};

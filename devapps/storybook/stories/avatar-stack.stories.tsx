/**
 * SPDX-License-Identifier: MIT
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/ui/avatar';
import { AvatarStack } from '@repo/design-system/ui/avatar-stack';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/ui/popover';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof AvatarStack> = {
  title: 'UI/AvatarStack',
  component: AvatarStack,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarStack>;

export const Default: Story = {
  render: () => (
    <AvatarStack>
      {Array.from({ length: 5 }).map((_, i) => (
        <Avatar key={i}>
          <AvatarImage
            src={`https://i.pravatar.cc/150?img=${i + 10}`}
            alt={`User ${i + 1}`}
          />
          <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarStack>
  ),
};

export const WithAnimation: Story = {
  render: () => (
    <AvatarStack animate={true}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Avatar key={i}>
          <AvatarImage
            src={`https://i.pravatar.cc/150?img=${i + 10}`}
            alt={`User ${i + 1}`}
          />
          <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarStack>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <AvatarStack size={60}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Avatar key={i}>
          <AvatarImage
            src={`https://i.pravatar.cc/150?img=${i + 10}`}
            alt={`User ${i + 1}`}
          />
          <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarStack>
  ),
};

export const WithPopover: Story = {
  render: () => (
    <AvatarStack animate={true} size={50}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Popover key={i}>
          <PopoverTrigger asChild>
            <div className="cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-primary">
              <Avatar>
                <AvatarImage
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  alt={`User ${i + 1}`}
                />
                <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">User {i + 1}</h4>
                <p className="text-muted-foreground text-sm">
                  This is a message from User {i + 1}
                </p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">
                  Hello there! This is my message in the popover. Click outside
                  to close.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </AvatarStack>
  ),
};

export const CombinedWithMarquee: Story = {
  render: () => {
    // This story will be implemented in the combined story
    return (
      <div className="rounded-md border p-4">
        <p className="mb-4 text-muted-foreground">
          See the combined implementation in the Marquee stories.
        </p>
        <AvatarStack animate={true} size={45}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Popover key={i}>
              <PopoverTrigger asChild>
                <div className="cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-primary">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i + 10}`}
                      alt={`User ${i + 1}`}
                    />
                    <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">User {i + 1}</h4>
                    <p className="text-muted-foreground text-sm">
                      Message preview from User {i + 1}
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </AvatarStack>
      </div>
    );
  },
};

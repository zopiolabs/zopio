/**
 * SPDX-License-Identifier: MIT
 */

import type { DragEndEvent } from '@repo/design-system/ui/list';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  ActivityIcon,
  BellIcon,
  GripIcon,
  InfoIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

import {
  Pill,
  PillAvatar,
  PillAvatarGroup,
  PillButton,
  PillDelta,
  PillDraggable,
  PillGlimpse,
  PillGlimpseContent,
  PillGlimpseDescription,
  PillGlimpseImage,
  PillGlimpseTitle,
  PillGlimpseTrigger,
  PillIcon,
  PillIndicator,
  PillList,
  PillListGroup,
  PillListHeader,
  PillListItems,
  PillPopover,
  PillPopoverContent,
  PillPopoverTrigger,
  PillStatus,
} from '@repo/design-system/ui/pill';

/**
 * A flexible badge component designed for a variety of use cases including status indicators,
 * avatars, buttons, and more.
 */
const meta = {
  title: 'ui/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Pill',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pill>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the pill.
 */
export const Default: Story = {};

/**
 * A pill with different variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>Default</Pill>
      <Pill variant="default">Default</Pill>
      <Pill variant="secondary">Secondary</Pill>
      <Pill variant="outline">Outline</Pill>
      <Pill variant="destructive">Destructive</Pill>
    </div>
  ),
};

/**
 * A pill with an avatar and text.
 */
export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
        With Avatar
      </Pill>
      <Pill variant="outline">
        <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
        With Avatar
      </Pill>
    </div>
  ),
};

/**
 * A pill with a status indicator and text.
 */
export const WithStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillStatus>
          <PillIndicator variant="success" />
          Active
        </PillStatus>
        Status Pill
      </Pill>
      <Pill>
        <PillStatus>
          <PillIndicator variant="error" />
          Offline
        </PillStatus>
        Status Pill
      </Pill>
      <Pill>
        <PillStatus>
          <PillIndicator variant="warning" />
          Away
        </PillStatus>
        Status Pill
      </Pill>
      <Pill>
        <PillStatus>
          <PillIndicator variant="info" />
          Info
        </PillStatus>
        Status Pill
      </Pill>
    </div>
  ),
};

/**
 * A pill with a button for dismissal.
 */
export const WithButton: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        Dismissible
        <PillButton>
          <XIcon />
        </PillButton>
      </Pill>
      <Pill variant="outline">
        Dismissible
        <PillButton>
          <XIcon />
        </PillButton>
      </Pill>
    </div>
  ),
};

/**
 * Pills with different indicator states.
 */
export const Indicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillIndicator variant="success" />
        Success
      </Pill>
      <Pill>
        <PillIndicator variant="error" />
        Error
      </Pill>
      <Pill>
        <PillIndicator variant="warning" />
        Warning
      </Pill>
      <Pill>
        <PillIndicator variant="info" />
        Info
      </Pill>
      <Pill>
        <PillIndicator variant="success" pulse />
        Pulse
      </Pill>
    </div>
  ),
};

/**
 * Pills showing different delta states.
 */
export const Deltas: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillDelta delta={1} />
        Increased
      </Pill>
      <Pill>
        <PillDelta delta={-1} />
        Decreased
      </Pill>
      <Pill>
        <PillDelta delta={0} />
        No Change
      </Pill>
    </div>
  ),
};

/**
 * A pill with an icon and text.
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillIcon icon={BellIcon} />
        Notifications
      </Pill>
      <Pill>
        <PillIcon icon={ActivityIcon} />
        Activity
      </Pill>
      <Pill>
        <PillIcon icon={InfoIcon} />
        Information
      </Pill>
      <Pill variant="outline">
        <PillIcon icon={UserIcon} />
        User
      </Pill>
    </div>
  ),
};

/**
 * A pill with multiple avatars grouped together.
 */
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillAvatarGroup>
          <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
          <PillAvatar src="https://github.com/shadcn.png" fallback="JD" />
          <PillAvatar src="https://github.com/shadcn.png" fallback="AB" />
        </PillAvatarGroup>
        Team Members
      </Pill>
      <Pill variant="outline">
        <PillAvatarGroup>
          <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
          <PillAvatar src="https://github.com/shadcn.png" fallback="JD" />
          <PillAvatar src="https://github.com/shadcn.png" fallback="AB" />
        </PillAvatarGroup>
        Team Members
      </Pill>
    </div>
  ),
};

/**
 * A complex example combining multiple pill features.
 */
export const Complex: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill>
        <PillStatus>
          <PillIndicator variant="success" pulse />
          Online
        </PillStatus>
        <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
        John Doe
        <PillButton>
          <XIcon />
        </PillButton>
      </Pill>
      <Pill variant="outline">
        <PillStatus>
          <PillDelta delta={5} />
          Trending
        </PillStatus>
        <PillIcon icon={ActivityIcon} />
        Activity Report
        <PillButton>
          <XIcon />
        </PillButton>
      </Pill>
    </div>
  ),
};

/**
 * A draggable pill that can be used in drag and drop interfaces.
 */
export const Draggable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PillDraggable id="pill-1">
        <GripIcon className="mr-2 size-3" />
        Drag me
      </PillDraggable>
      <PillDraggable id="pill-2">
        <GripIcon className="mr-2 size-3" />
        Drag me too
      </PillDraggable>
    </div>
  ),
};

/**
 * A pill with a popover that shows additional content when clicked.
 */
export const WithPopover: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PillPopover>
        <PillPopoverTrigger asChild>
          <Pill className="cursor-pointer">
            <PillIcon icon={InfoIcon} />
            Click for more info
          </Pill>
        </PillPopoverTrigger>
        <PillPopoverContent>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-sm">Additional Information</h4>
            <p className="text-muted-foreground text-sm">
              This is additional information that appears in a popover when the
              pill is clicked.
            </p>
          </div>
        </PillPopoverContent>
      </PillPopover>
    </div>
  ),
};

/**
 * A pill with a glimpse that shows additional content on hover.
 */
export const WithGlimpse: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PillGlimpse>
        <PillGlimpseTrigger asChild>
          <Pill className="cursor-help">
            <PillAvatar src="https://github.com/shadcn.png" fallback="CN" />
            Hover for profile
          </Pill>
        </PillGlimpseTrigger>
        <PillGlimpseContent>
          <div className="flex flex-col gap-2">
            <PillGlimpseImage
              src="https://github.com/shadcn.png"
              alt="User profile"
            />
            <PillGlimpseTitle>John Doe</PillGlimpseTitle>
            <PillGlimpseDescription>
              Senior Developer at Acme Inc. Specializes in React, TypeScript,
              and UI design. Available for new projects starting next month.
            </PillGlimpseDescription>
          </div>
        </PillGlimpseContent>
      </PillGlimpse>
    </div>
  ),
};

/**
 * Pills organized in a list with drag and drop functionality.
 */
export const PillsInList: Story = {
  render: () => {
    // This is a client component that needs useState, so we're using a function component
    const PillListExample = () => {
      const [items, setItems] = useState([
        { id: 'pill-1', content: 'High Priority', group: 'group-1' },
        { id: 'pill-2', content: 'Medium Priority', group: 'group-1' },
        { id: 'pill-3', content: 'Low Priority', group: 'group-2' },
        { id: 'pill-4', content: 'Completed', group: 'group-2' },
      ]);

      const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          setItems((items) => {
            const activeItem = items.find((item) => item.id === active.id);
            const overItem = items.find((item) => item.id === over.id);

            if (activeItem && overItem) {
              const activeIndex = items.indexOf(activeItem);
              const overIndex = items.indexOf(overItem);

              const newItems = [...items];
              newItems.splice(activeIndex, 1);
              newItems.splice(overIndex, 0, activeItem);

              return newItems;
            }

            return items;
          });
        }
      };

      return (
        <div className="mx-auto w-full max-w-md">
          <PillList onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <PillListGroup id="group-1">
                  <PillListHeader name="To Do" color="#f43f5e" />
                  <PillListItems>
                    {items
                      .filter((item) => item.group === 'group-1')
                      .map((item) => (
                        <PillDraggable
                          key={item.id}
                          id={item.id}
                          data={{ group: item.group }}
                        >
                          <PillIcon icon={GripIcon} />
                          {item.content}
                        </PillDraggable>
                      ))}
                  </PillListItems>
                </PillListGroup>
              </div>
              <div>
                <PillListGroup id="group-2">
                  <PillListHeader name="Done" color="#22c55e" />
                  <PillListItems>
                    {items
                      .filter((item) => item.group === 'group-2')
                      .map((item) => (
                        <PillDraggable
                          key={item.id}
                          id={item.id}
                          data={{ group: item.group }}
                        >
                          <PillIcon icon={GripIcon} />
                          {item.content}
                        </PillDraggable>
                      ))}
                  </PillListItems>
                </PillListGroup>
              </div>
            </div>
          </PillList>
        </div>
      );
    };

    return <PillListExample />;
  },
};

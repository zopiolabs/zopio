/**
 * SPDX-License-Identifier: MIT
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/ui/card';
import { EditableField } from '@repo/design-system/ui/editable-field';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof EditableField> = {
  component: EditableField,
  tags: ['autodocs'],
  title: 'UI/EditableField',
};

export default meta;
type Story = StoryObj<typeof EditableField>;

export const Default: Story = {
  render: () => <EditableField defaultValue="Design System Updates" />,
};

export const WithCustomButtonText: Story = {
  render: () => (
    <EditableField defaultValue="Design System Updates" buttonText="Save" />
  ),
};

export const WithCallback: Story = {
  render: function Component() {
    const [value, setValue] = useState<string>('Design System Updates');
    const [lastUpdated, setLastUpdated] = useState<string>('');

    return (
      <div className="space-y-4">
        <EditableField
          defaultValue={value}
          onUpdate={(newValue) => {
            setValue(newValue);
            setLastUpdated(new Date().toLocaleTimeString());
          }}
        />

        {lastUpdated && (
          <div className="text-muted-foreground text-sm">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
    );
  },
};

export const InsideCard: Story = {
  render: function Component() {
    const [projectTitle, setProjectTitle] = useState<string>(
      'Design System Updates'
    );

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>Update your project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="font-medium text-sm">Project Name</div>
            <EditableField
              defaultValue={projectTitle}
              onUpdate={setProjectTitle}
              placeholder="Enter project name"
              aria-label="Project name"
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-xs">
            Changes are automatically saved
          </div>
        </CardFooter>
      </Card>
    );
  },
};

export const Disabled: Story = {
  render: () => <EditableField defaultValue="Design System Updates" disabled />,
};

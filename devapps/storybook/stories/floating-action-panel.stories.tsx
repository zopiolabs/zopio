/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Check,
  Copy,
  Edit,
  FileText,
  MessageSquare,
  Plus,
  Send,
  Share,
  Trash,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import * as FloatingActionPanel from '@repo/design-system/ui/floating-action-panel';

/**
 * The FloatingActionPanel component provides a contextual popup panel that appears
 * relative to a trigger element. It's useful for displaying actions, forms, or
 * other contextual information without disrupting the user's workflow.
 */
const meta: Meta<typeof FloatingActionPanel.Root> = {
  title: 'UI/FloatingActionPanel',
  component: FloatingActionPanel.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FloatingActionPanel.Root>;

/**
 * Basic example showing a floating action panel with multiple action buttons.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex h-[300px] w-[400px] items-center justify-center">
      <FloatingActionPanel.Root>
        {(_) => (
          <>
            <FloatingActionPanel.Trigger title="Item Actions" mode="actions">
              Actions
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content>
              <div className="space-y-1 p-2">
                <FloatingActionPanel.Button
                  onClick={() => console.log('Edit clicked')}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button
                  onClick={() => console.log('Copy clicked')}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button
                  onClick={() => console.log('Share clicked')}
                >
                  <Share className="h-4 w-4" />
                  Share
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => console.log('Delete clicked')}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </FloatingActionPanel.Button>
              </div>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>
    </div>
  ),
};

/**
 * Example showing a note input form in the floating panel.
 */
export const NoteForm: Story = {
  render: () => (
    <div className="flex h-[300px] w-[400px] items-center justify-center">
      <FloatingActionPanel.Root>
        {(context) => (
          <>
            <FloatingActionPanel.Trigger
              title="Add Note"
              mode="note"
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Note
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content className="w-[300px]">
              <FloatingActionPanel.Form
                onSubmit={(note) => {
                  alert(`Note submitted: ${note}`);
                }}
              >
                <FloatingActionPanel.Textarea className="min-h-[100px] border-zinc-200 border-t dark:border-zinc-800" />
                <div className="flex justify-end gap-2 border-zinc-200 border-t p-2 dark:border-zinc-800">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => context.closePanel()}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    <Send className="mr-1 h-4 w-4" />
                    Submit
                  </Button>
                </div>
              </FloatingActionPanel.Form>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>
    </div>
  ),
};

/**
 * Multiple action panels in a single view.
 */
export const MultipleActionPanels: Story = {
  render: () => (
    <div className="flex h-[300px] w-[500px] items-center justify-around">
      <FloatingActionPanel.Root>
        {(_) => (
          <>
            <FloatingActionPanel.Trigger
              title="Document Actions"
              mode="actions"
              className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <FileText className="mr-2 h-4 w-4" />
              Document
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content>
              <div className="space-y-1 p-2">
                <FloatingActionPanel.Button>
                  <Edit className="h-4 w-4" />
                  Edit Document
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button>
                  <Share className="h-4 w-4" />
                  Share Document
                </FloatingActionPanel.Button>
              </div>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>

      <FloatingActionPanel.Root>
        {(_) => (
          <>
            <FloatingActionPanel.Trigger
              title="Add Item"
              mode="note"
              className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content>
              <div className="space-y-1 p-2">
                <FloatingActionPanel.Button>
                  <FileText className="h-4 w-4" />
                  New Document
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button>
                  <MessageSquare className="h-4 w-4" />
                  New Comment
                </FloatingActionPanel.Button>
              </div>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>
    </div>
  ),
};

/**
 * Dark theme example of the floating action panel.
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="flex h-[300px] w-[400px] items-center justify-center">
      <FloatingActionPanel.Root>
        {(_) => (
          <>
            <FloatingActionPanel.Trigger title="Item Actions" mode="actions">
              Actions
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content>
              <div className="space-y-1 p-2">
                <FloatingActionPanel.Button>
                  <Edit className="h-4 w-4" />
                  Edit
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button>
                  <Copy className="h-4 w-4" />
                  Duplicate
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button>
                  <Share className="h-4 w-4" />
                  Share
                </FloatingActionPanel.Button>
                <FloatingActionPanel.Button className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                  <Trash className="h-4 w-4" />
                  Delete
                </FloatingActionPanel.Button>
              </div>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>
    </div>
  ),
};

/**
 * Example with controlled state.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Helper component for controlled example
function ControlledExample() {
  const [notes, setNotes] = useState<string[]>([]);

  const handleNoteSubmit = (note: string) => {
    if (note.trim()) {
      setNotes((prev) => [...prev, note]);
    }
  };

  return (
    <div className="w-[400px] space-y-4">
      <FloatingActionPanel.Root>
        {(_) => (
          <>
            <FloatingActionPanel.Trigger
              title="Add Note"
              mode="note"
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Note
            </FloatingActionPanel.Trigger>
            <FloatingActionPanel.Content className="w-[300px]">
              <FloatingActionPanel.Form onSubmit={handleNoteSubmit}>
                <FloatingActionPanel.Textarea className="min-h-[100px] border-zinc-200 border-t dark:border-zinc-800" />
                <div className="flex justify-end gap-2 border-zinc-200 border-t p-2 dark:border-zinc-800">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => _.closePanel()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Submit
                  </Button>
                </div>
              </FloatingActionPanel.Form>
            </FloatingActionPanel.Content>
          </>
        )}
      </FloatingActionPanel.Root>

      <div className="space-y-2 rounded-lg border p-4">
        <h3 className="font-medium">Submitted Notes</h3>
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No notes yet. Add one using the button above.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded-md bg-zinc-50 p-2 dark:bg-zinc-900"
              >
                <Check className="mt-0.5 h-4 w-4 text-green-500" />
                <span className="text-sm">{note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

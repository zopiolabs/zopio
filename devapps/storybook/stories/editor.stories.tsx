/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Download, FileText, Save, Settings, Upload } from 'lucide-react';
import { useState } from 'react';

import {
  Editor,
  EditorButton,
  EditorFooter,
  EditorToolbar,
  getCharacterCount,
  getWordCount,
  useEditor,
} from '@repo/design-system/ui/editor';
import { Label } from '@repo/design-system/ui/label';

/**
 * A rich text editor component with formatting tools, history management, and extensible toolbar.
 */
const meta: Meta<typeof Editor> = {
  title: 'ui/Editor',
  component: Editor,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the editor',
    },
    value: {
      control: { type: 'text' },
      description: 'Editor content value',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text when empty',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Make editor read-only',
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maximum character limit',
    },
    showToolbar: {
      control: { type: 'boolean' },
      description: 'Show formatting toolbar',
    },
    showWordCount: {
      control: { type: 'boolean' },
      description: 'Show word and character count',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic editor with default settings.
 */
export const Default: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="w-full max-w-2xl">
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Start writing your content..."
          showWordCount
        />
      </div>
    );
  },
};

/**
 * Different editor sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <Editor size="sm" placeholder="Small editor..." showWordCount />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <Editor size="md" placeholder="Medium editor..." showWordCount />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <Editor size="lg" placeholder="Large editor..." showWordCount />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Extra Large</h4>
        <Editor size="xl" placeholder="Extra large editor..." showWordCount />
      </div>
    </div>
  ),
};

/**
 * Editor without toolbar.
 */
export const NoToolbar: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="w-full max-w-2xl">
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Simple editor without toolbar..."
          showToolbar={false}
          showWordCount
        />
      </div>
    );
  },
};

/**
 * Read-only editor for displaying content.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Editor
        value="This is a read-only editor. You can select text but cannot edit it. This is useful for displaying formatted content that shouldn't be modified."
        readOnly
        showWordCount
      />
    </div>
  ),
};

/**
 * Editor with character limit.
 */
export const WithCharacterLimit: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="w-full max-w-2xl">
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Type here... (max 200 characters)"
          maxLength={200}
          showWordCount
        />
      </div>
    );
  },
};

/**
 * Editor with pre-filled content.
 */
export const WithContent: Story = {
  render: () => {
    const [content, setContent] = useState(`# Welcome to the Editor

This is a **rich text editor** with formatting capabilities. You can:

- Make text *italic* or **bold**
- Add ~~strikethrough~~ text
- Create \`inline code\`
- Add > blockquotes

Try selecting text and using the toolbar buttons or keyboard shortcuts:
- Ctrl+B for bold
- Ctrl+I for italic
- Ctrl+U for underline
- Ctrl+Z for undo
- Ctrl+Y for redo`);

    return (
      <div className="w-full max-w-2xl">
        <Editor value={content} onChange={setContent} showWordCount />
      </div>
    );
  },
};

/**
 * Blog post editor with custom footer.
 */
export const BlogEditor: Story = {
  render: () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    return (
      <div className="w-full max-w-4xl space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">Post Title</Label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post title..."
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Content</Label>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Write your blog post content here..."
            size="xl"
            showWordCount
          >
            <EditorFooter>
              <div className="flex w-full items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  {getWordCount(content)} words, {getCharacterCount(content)}{' '}
                  characters
                </div>
                <div className="flex gap-2">
                  <EditorButton>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </EditorButton>
                  <EditorButton>
                    <Upload className="mr-2 h-4 w-4" />
                    Publish
                  </EditorButton>
                </div>
              </div>
            </EditorFooter>
          </Editor>
        </div>
      </div>
    );
  },
};

/**
 * Comment editor with simple layout.
 */
export const CommentEditor: Story = {
  render: () => {
    const [comment, setComment] = useState('');

    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
              U
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">John Doe</div>
              <div className="text-muted-foreground text-xs">2 hours ago</div>
              <div className="mt-2 text-sm">
                This is a great article! I really enjoyed reading about the
                different approaches to solving this problem.
              </div>
            </div>
          </div>
        </div>

        <div>
          <Editor
            value={comment}
            onChange={setComment}
            placeholder="Write a comment..."
            size="sm"
            showToolbar={false}
          >
            <EditorFooter>
              <div className="flex w-full items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  {getCharacterCount(comment)} characters
                </div>
                <div className="flex gap-2">
                  <EditorButton className="border border-border text-sm">
                    Cancel
                  </EditorButton>
                  <EditorButton className="bg-primary text-primary-foreground text-sm">
                    Post Comment
                  </EditorButton>
                </div>
              </div>
            </EditorFooter>
          </Editor>
        </div>
      </div>
    );
  },
};

/**
 * Email composer with custom toolbar.
 */
export const EmailComposer: Story = {
  render: () => {
    const [email, setEmail] = useState({
      to: '',
      subject: '',
      body: '',
    });

    return (
      <div className="w-full max-w-4xl space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="mb-1 block font-medium text-sm">To</Label>
            <input
              type="email"
              value={email.to}
              onChange={(e) =>
                setEmail((prev) => ({ ...prev, to: e.target.value }))
              }
              placeholder="recipient@example.com"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <Label className="mb-1 block font-medium text-sm">Subject</Label>
            <input
              type="text"
              value={email.subject}
              onChange={(e) =>
                setEmail((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Email subject"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Message</Label>
          <Editor
            value={email.body}
            onChange={(body) => setEmail((prev) => ({ ...prev, body }))}
            placeholder="Compose your email..."
            size="lg"
          >
            <EditorFooter>
              <div className="flex w-full items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  {getWordCount(email.body)} words
                </div>
                <div className="flex gap-2">
                  <EditorButton className="border border-border text-sm">
                    Save Draft
                  </EditorButton>
                  <EditorButton>Send Email</EditorButton>
                </div>
              </div>
            </EditorFooter>
          </Editor>
        </div>
      </div>
    );
  },
};

/**
 * Note-taking editor with custom actions.
 */
export const NoteTaker: Story = {
  render: () => {
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
      // Simulate save
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    return (
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Quick Notes</h3>
          <div className="flex gap-2">
            <EditorButton onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {saved ? 'Saved!' : 'Save'}
            </EditorButton>
            <EditorButton className="border border-border text-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </EditorButton>
          </div>
        </div>

        <Editor
          value={notes}
          onChange={setNotes}
          placeholder="Jot down your thoughts, ideas, or reminders..."
          size="lg"
          showWordCount
        />
      </div>
    );
  },
};

/**
 * Collaborative editor with user indicators.
 */
export const CollaborativeEditor: Story = {
  render: () => {
    const [content, setContent] = useState(`# Project Planning Document

## Overview
This is a collaborative document where team members can contribute ideas and feedback.

## Current Tasks
- [ ] Research user requirements
- [ ] Design system architecture
- [ ] Create project timeline

## Notes
Add your thoughts and suggestions below...`);

    const collaborators = [
      { name: 'Alice', color: 'bg-blue-500', active: true },
      { name: 'Bob', color: 'bg-green-500', active: true },
      { name: 'Charlie', color: 'bg-purple-500', active: false },
    ];

    return (
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Team Document</h3>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">
              Collaborators:
            </span>
            {collaborators.map((user) => (
              <div
                key={user.name}
                className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center font-medium text-white text-xs ${
                  user.active ? 'ring-2 ring-green-400' : 'opacity-60'
                }`}
                title={`${user.name} ${user.active ? '(active)' : '(offline)'}`}
              >
                {user.name[0]}
              </div>
            ))}
          </div>
        </div>

        <Editor value={content} onChange={setContent} size="xl" showWordCount>
          <EditorFooter>
            <div className="flex w-full items-center justify-between">
              <div className="text-muted-foreground text-xs">
                {getWordCount(content)} words • Last saved 2 minutes ago
              </div>
              <div className="flex gap-2">
                <EditorButton className="border border-border text-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Version History
                </EditorButton>
                <EditorButton>
                  <Settings className="mr-2 h-4 w-4" />
                  Share Settings
                </EditorButton>
              </div>
            </div>
          </EditorFooter>
        </Editor>
      </div>
    );
  },
};

/**
 * Custom toolbar editor.
 */
export const CustomToolbar: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="w-full max-w-2xl">
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Editor with custom toolbar..."
          showWordCount
        >
          <EditorToolbar className="border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <EditorButton>
                <FileText className="h-4 w-4" />
              </EditorButton>
              <EditorButton>
                <Save className="h-4 w-4" />
              </EditorButton>
              <EditorButton>
                <Download className="h-4 w-4" />
              </EditorButton>
            </div>
          </EditorToolbar>
        </Editor>
      </div>
    );
  },
};

// Custom editor info component for stories
const EditorInfo = () => {
  const { content, canUndo, canRedo, history, historyIndex } = useEditor();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Content Length:</span>
          <div>{content.length} characters</div>
        </div>
        <div>
          <span className="font-medium">Word Count:</span>
          <div>{getWordCount(content)} words</div>
        </div>
        <div>
          <span className="font-medium">History:</span>
          <div>
            {history.length} entries (index: {historyIndex})
          </div>
        </div>
        <div>
          <span className="font-medium">Actions:</span>
          <div>
            Undo: {canUndo ? 'Available' : 'Disabled'} | Redo:{' '}
            {canRedo ? 'Available' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the editor context hook.
 */
export const WithContext: Story = {
  render: () => {
    const [content, setContent] = useState(
      'Type something to see the context information update...'
    );

    return (
      <div className="w-full max-w-2xl space-y-4">
        <Editor value={content} onChange={setContent} showWordCount>
          <EditorInfo />
        </Editor>
      </div>
    );
  },
};

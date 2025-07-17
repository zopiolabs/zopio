/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { EditorProvider, KiboEditor } from '@repo/design-system/ui/editor';

/**
 * A rich text editor component with formatting options, slash commands, and more.
 */
const meta = {
  title: 'ui/Editor',
  component: EditorProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EditorProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleContent = `<h1>Welcome to the Editor</h1>
<p>This is a rich text editor with various formatting options.</p>
<ul>
  <li>Create headings with the slash command</li>
  <li>Format text with the toolbar</li>
  <li>Add links, lists, and more</li>
</ul>
<p>Try it out by typing <strong>bold text</strong>, <em>italic text</em>, or <u>underlined text</u>.</p>
`;

/**
 * The default editor with basic formatting options.
 */
export const Default: Story = {
  args: {
    content: sampleContent,
    editable: true,
  },
  render: (args) => {
    return (
      <div className="w-[800px] rounded-md border">
        <EditorProvider {...args}>
          {(editor) => <KiboEditor editor={editor} />}
        </EditorProvider>
      </div>
    );
  },
};

/**
 * An editor with character limit.
 */
export const WithCharacterLimit: Story = {
  args: {
    content:
      'This editor has a character limit of 100 characters. Try typing more to see the counter.',
    editable: true,
    characterLimit: 100,
  },
  render: (args) => {
    return (
      <div className="w-[800px] rounded-md border">
        <EditorProvider {...args}>
          {(editor) => <KiboEditor editor={editor} />}
        </EditorProvider>
      </div>
    );
  },
};

/**
 * A read-only editor that cannot be edited.
 */
export const ReadOnly: Story = {
  args: {
    content: sampleContent,
    editable: false,
  },
  render: (args) => {
    return (
      <div className="w-[800px] rounded-md border">
        <EditorProvider {...args}>
          {(editor) => <KiboEditor editor={editor} />}
        </EditorProvider>
      </div>
    );
  },
};

/**
 * An editor with custom placeholder text.
 */
export const WithPlaceholder: Story = {
  args: {
    content: '',
    editable: true,
    placeholder: 'Start typing or use the slash command...',
  },
  render: (args) => {
    return (
      <div className="w-[800px] rounded-md border">
        <EditorProvider {...args}>
          {(editor) => <KiboEditor editor={editor} />}
        </EditorProvider>
      </div>
    );
  },
};

/**
 * An editor in dark mode.
 */
export const DarkMode: Story = {
  args: {
    content: sampleContent,
    editable: true,
  },
  render: (args) => {
    return (
      <div className="dark w-[800px] rounded-md border">
        <EditorProvider {...args}>
          {(editor) => <KiboEditor editor={editor} />}
        </EditorProvider>
      </div>
    );
  },
};

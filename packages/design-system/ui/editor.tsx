/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from '@repo/design-system/lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from './command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Separator } from './separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Editor, Range, Node, mergeAttributes } from '@tiptap/core';
import type { UseEditorOptions } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import Typography from '@tiptap/extension-typography';
import { DOMOutputSpec, Node as ProseMirrorNode } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';
import { EditorContent, ReactRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import Fuse from 'fuse.js';
import { common, createLowlight } from 'lowlight';
import {
  BoldIcon,
  CheckSquareIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  TableIcon,
  TextIcon,
  TextQuoteIcon,
  UnderlineIcon,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import tippy from 'tippy.js';

interface SlashNodeAttrs {
  id: string | null;
  label?: string | null;
}

type SlashOptions<
  SlashOptionSuggestionItem = unknown,
  Attrs = SlashNodeAttrs,
> = {
  HTMLAttributes: Record<string, unknown>;
  renderText: (props: {
    options: SlashOptions<SlashOptionSuggestionItem, Attrs>;
    node: ProseMirrorNode;
  }) => string;
  renderHTML: (props: {
    options: SlashOptions<SlashOptionSuggestionItem, Attrs>;
    node: ProseMirrorNode;
  }) => DOMOutputSpec;
  deleteTriggerWithBackspace: boolean;
  suggestion: Omit<
    SuggestionOptions<SlashOptionSuggestionItem, Attrs>,
    'editor'
  >;
};

const SlashPluginKey = new PluginKey('slash');

export interface SuggestionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  searchTerms: string[];
  command: (props: { editor: Editor; range: Range }) => void;
}

export const defaultSlashSuggestions: SuggestionOptions<SuggestionItem>['items'] =
  () => [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: TextIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .run();
      },
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: CheckSquareIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: Heading1Icon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: Heading2Icon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: Heading3Icon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: ListIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: ListOrderedIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: TextQuoteIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run(),
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: CodeIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: 'Table',
      description: 'Add a table view to organize data.',
      searchTerms: ['table'],
      icon: TableIcon,
      command: ({ editor, range }: { editor: Editor; range: Range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
  ];

const Slash = Node.create<SlashOptions>({
  name: 'slash',
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      deleteTriggerWithBackspace: false,
      renderHTML({ options, node }) {
        return [
          'span',
          mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
          `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
        ];
      },
      suggestion: {
        char: '/',
        pluginKey: SlashPluginKey,
        command: ({ editor, range, props }) => {
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');
          if (overrideSpace) {
            range.to += 1;
          }
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();
          // get reference to `window` object from editor element, to support cross-frame JS usage
          editor.view.dom.ownerDocument.defaultView
            ?.getSelection()
            ?.collapseToEnd();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);
          return allow;
        },
      },
    };
  },
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-id': attributes.id,
          };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }
          return {
            'data-label': attributes.label,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const mergedOptions = { ...this.options };
    mergedOptions.HTMLAttributes = mergeAttributes(
      { 'data-type': this.name },
      this.options.HTMLAttributes,
      HTMLAttributes
    );
    const html = this.options.renderHTML({
      options: mergedOptions,
      node,
    });
    if (typeof html === 'string') {
      return [
        'span',
        mergeAttributes(
          { 'data-type': this.name },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        html,
      ];
    }
    return html;
  },
  renderText({ node }) {
    return this.options.renderText({
      options: this.options,
      node,
    });
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;
          if (!empty) {
            return false;
          }
          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(
                this.options.deleteTriggerWithBackspace
                  ? ''
                  : this.options.suggestion.char || '',
                pos,
                pos + node.nodeSize
              );
              return false;
            }
          });
          return isMention;
        }),
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

// Create a lowlight instance with common languages loaded
const lowlight = createLowlight(common);

type EditorSlashMenuProps = {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
  editor: Editor;
  range: Range;
};

const EditorSlashMenu = ({ items, editor, range }: EditorSlashMenuProps) => (
  <Command
    className="border shadow"
    id="slash-command"
    onKeyDown={(e) => {
      e.stopPropagation();
    }}
  >
    <CommandEmpty className="flex w-full items-center justify-center p-4 text-muted-foreground text-sm">
      <p>No results</p>
    </CommandEmpty>
    <CommandList>
      {items.map((item) => (
        <CommandItem
          className="flex items-center gap-3 pr-3"
          key={item.title}
          onSelect={() => item.command({ editor, range })}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded border bg-secondary">
            <item.icon className="text-muted-foreground" size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{item.title}</span>
            <span className="text-muted-foreground text-xs">
              {item.description}
            </span>
          </div>
        </CommandItem>
      ))}
    </CommandList>
  </Command>
);

const handleCommandNavigation = (event: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
    const slashCommand = document.querySelector('#slash-command');
    if (slashCommand) {
      event.preventDefault();
      slashCommand.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: event.key,
          cancelable: true,
          bubbles: true,
        })
      );
      return true;
    }
  }
};

export interface EditorProviderProps {
  children?: ((editor: Editor) => React.ReactNode);
  slashSuggestions?: SuggestionOptions<SuggestionItem>['items'];
  characterLimit?: number;
  editable?: boolean;
  placeholder?: string;
  onUpdate?: (editor: Editor) => void;
  extensions?: any[];
  content?: string;
  editorProps?: Partial<UseEditorOptions>;
  className?: string;
};

interface KiboEditorProps {
  editor: Editor;
  className?: string;
  characterLimit?: number;
}

export function KiboEditor({ editor, className, characterLimit }: KiboEditorProps) {
  const [characterCount, setCharacterCount] = useState<number>(0);

  useEffect(() => {
    if (!editor) return;

    const characterStorage = editor.storage.characterCount;

    if (characterStorage && typeof characterStorage.characters === 'function') {
      setCharacterCount(characterStorage.characters());
    }

    const updateListener = () => {
      if (characterStorage && typeof characterStorage.characters === 'function') {
        setCharacterCount(characterStorage.characters());
      }
    };

    editor.on('update', updateListener);
    return () => {
      editor.off('update', updateListener);
    };
  }, [editor]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex flex-wrap items-center gap-1">
          <TooltipProvider delayDuration={100}>
            <EditorBubbleMenu editor={editor} />
          </TooltipProvider>
        </div>
        {/* ✔ Karakter limiti gösterimi */}
        {characterLimit !== undefined && (
          <div className="text-muted-foreground text-sm">
            {characterCount}/{characterLimit}
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export const EditorProvider = ({
  children,
  slashSuggestions = defaultSlashSuggestions,
  characterLimit,
  editable = true,
  placeholder = 'Write something...',
  onUpdate,
  extensions = [],
  content = '',
  editorProps = {},
  className,
}: EditorProviderProps) => {
  // Use the useEditor hook with proper typing
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside leading-3 -mt-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside leading-3 -mt-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'leading-normal mb-2',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary',
          },
        },
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class: 'rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
          },
        },
        horizontalRule: false,
        dropcursor: {
          color: 'rgba(var(--primary) / 0.5)',
          width: 4,
        },
        gapcursor: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-muted-foreground before:h-0 before:float-left before:pointer-events-none',
      }),
      Slash.configure({
        suggestion: {
          items: slashSuggestions,
          render: () => {
            let component: ReactRenderer<any> | null = null;
            let popup: any | null = null;
            let fuzzyItems: SuggestionItem[] = [];

            // Make sure the return type matches what's expected by SuggestionOptions
            return {
              onStart: (props: SuggestionProps<unknown, SlashNodeAttrs>) => {
                const { editor, clientRect, items } = props;

                // Cast items to SuggestionItem[] since we know the structure
                fuzzyItems = items as SuggestionItem[];

                component = new ReactRenderer(EditorSlashMenu, {
                  props: {
                    items: fuzzyItems,
                    command: (item: SuggestionItem) => {
                      item.command({ editor, range: props.range });
                    },
                    editor,
                    range: props.range,
                  },
                  editor,
                });

                // @ts-ignore
                popup = tippy('body', {
                  getReferenceClientRect: clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate: (props: SuggestionProps<unknown, SlashNodeAttrs>) => {
                const { editor, clientRect, items, query } = props;

                if (!component) {
                  return;
                }

                // Cast items to SuggestionItem[] since we know the structure
                const typedItems = items as SuggestionItem[];

                if (query) {
                  const fuse = new Fuse(typedItems, {
                    keys: ['title', 'description', 'searchTerms'],
                    threshold: 0.3,
                  });

                  fuzzyItems = fuse
                    .search(query)
                    .map((result) => result.item);
                } else {
                  fuzzyItems = typedItems;
                }

                component.updateProps({
                  items: fuzzyItems,
                  command: (item: SuggestionItem) => {
                    item.command({ editor, range: props.range });
                  },
                  editor,
                  range: props.range,
                });

                popup?.[0].setProps({
                  getReferenceClientRect: clientRect,
                });
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                const { event } = props;
                // The onKeyDown handler must return a boolean
                const result = handleCommandNavigation(event);
                return result === true ? true : false;
              },
              onExit: () => {
                if (popup) {
                  popup[0].destroy();
                  popup = null;
                }

                if (component) {
                  component.destroy();
                  component = null;
                }
              },
            };
          },
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-4',
        },
        nested: true,
      }),
      Superscript,
      Subscript,
      Typography,
      TextStyle,
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-muted transition-colors hover:bg-muted/50 data-[head=true]:hover:bg-background',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      ...(characterLimit
        ? [
            CharacterCount.configure({
              limit: characterLimit,
            }),
          ]
        : []),
      ...extensions,
    ],
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert prose-headings:font-heading prose-headings:text-primary max-w-full',
          'prose-p:leading-relaxed prose-pre:p-0',
          'focus-visible:outline-none'
        ),
      },
      handleDOMEvents: {
        keydown: (_view: any, event: KeyboardEvent) => {
          return handleCommandNavigation(event);
        },
      },
      // Spread the editorProps but make sure to exclude any 'editable' property
      ...(typeof editorProps === 'object' ?
        Object.fromEntries(
          Object.entries(editorProps).filter(([key]) => key !== 'editable')
        ) : {}),
    },
    content,
    // Use the boolean directly as expected by the top-level API
    editable: Boolean(editable),
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
  });

  return (
    <div className={cn('relative w-full', className)}>
      {editor && children ? children(editor) : editor ? <KiboEditor editor={editor} /> : null}
    </div>
  );
};

interface EditorBubbleMenuProps {
  editor: Editor;
}

function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const items = [
    {
      name: 'bold',
      isActive: () => editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: 'italic',
      isActive: () => editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: 'underline',
      isActive: () => editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: 'strike',
      isActive: () => editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: 'code',
      isActive: () => editor.isActive('code'),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const headingItems = [
    {
      name: 'heading-1',
      isActive: () => editor.isActive('heading', { level: 1 }),
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: Heading1Icon,
    },
    {
      name: 'heading-2',
      isActive: () => editor.isActive('heading', { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: Heading2Icon,
    },
    {
      name: 'heading-3',
      isActive: () => editor.isActive('heading', { level: 3 }),
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: Heading3Icon,
    },
    {
      name: 'bullet-list',
      isActive: () => editor.isActive('bulletList'),
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: ListIcon,
    },
    {
      name: 'ordered-list',
      isActive: () => editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: ListOrderedIcon,
    },
    {
      name: 'task-list',
      isActive: () => editor.isActive('taskList'),
      command: () => editor.chain().focus().toggleTaskList().run(),
      icon: CheckSquareIcon,
    },
  ];

  const linkItem = {
    name: 'link',
    isActive: () => editor.isActive('link'),
    command: () => setLink(editor),
    icon: LinkIcon,
  };

  const setLink = useCallback(
    (editor: Editor) => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    },
    []
  );

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-none border-none hover:bg-muted',
                item.isActive() && 'bg-muted'
              )}
              onClick={item.command}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {item.name}
          </TooltipContent>
        </Tooltip>
      ))}
      <Separator orientation="vertical" className="mx-1 h-6" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none border-none hover:bg-muted"
          >
            <TextIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {headingItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className={cn(
                'flex items-center gap-2',
                item.isActive() && 'bg-muted'
              )}
              onClick={item.command}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-none border-none hover:bg-muted',
              linkItem.isActive() && 'bg-muted'
            )}
            onClick={linkItem.command}
          >
            <linkItem.icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {linkItem.name}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default KiboEditor;

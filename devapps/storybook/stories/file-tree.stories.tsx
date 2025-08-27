/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Copy,
  Download,
  Edit,
  FolderPlus,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  FileTree,
  FileTreeActions,
  FileTreeButton,
  FileTreeContent,
  FileTreeHeader,
  type FileTreeItemType,
  FileTreeSearch,
  filterTreeData,
  useFileTree,
} from '@repo/design-system/ui/file-tree';

/**
 * A hierarchical file and folder tree component with selection, search, and context menu support.
 */
const meta: Meta<typeof FileTree> = {
  title: 'ui/FileTree',
  component: FileTree,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    multiSelect: {
      control: { type: 'boolean' },
      description: 'Allow multiple item selection',
    },
    showIcons: {
      control: { type: 'boolean' },
      description: 'Show file type icons',
    },
    showSize: {
      control: { type: 'boolean' },
      description: 'Show file sizes',
    },
    showModified: {
      control: { type: 'boolean' },
      description: 'Show modification dates',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample file tree data
const sampleData: FileTreeItemType[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: '3',
            name: 'Button.tsx',
            type: 'file',
            size: 2048,
            modified: new Date('2024-03-15'),
          },
          {
            id: '4',
            name: 'Input.tsx',
            type: 'file',
            size: 1536,
            modified: new Date('2024-03-14'),
          },
          {
            id: '5',
            name: 'Modal.tsx',
            type: 'file',
            size: 3072,
            modified: new Date('2024-03-13'),
          },
        ],
      },
      {
        id: '6',
        name: 'utils',
        type: 'folder',
        children: [
          {
            id: '7',
            name: 'helpers.ts',
            type: 'file',
            size: 1024,
            modified: new Date('2024-03-12'),
          },
          {
            id: '8',
            name: 'constants.ts',
            type: 'file',
            size: 512,
            modified: new Date('2024-03-11'),
          },
        ],
      },
      {
        id: '9',
        name: 'App.tsx',
        type: 'file',
        size: 4096,
        modified: new Date('2024-03-16'),
      },
      {
        id: '10',
        name: 'index.tsx',
        type: 'file',
        size: 256,
        modified: new Date('2024-03-10'),
      },
    ],
  },
  {
    id: '11',
    name: 'public',
    type: 'folder',
    children: [
      {
        id: '12',
        name: 'images',
        type: 'folder',
        children: [
          {
            id: '13',
            name: 'logo.png',
            type: 'file',
            size: 8192,
            modified: new Date('2024-03-05'),
          },
          {
            id: '14',
            name: 'hero.jpg',
            type: 'file',
            size: 16384,
            modified: new Date('2024-03-04'),
          },
        ],
      },
      {
        id: '15',
        name: 'favicon.ico',
        type: 'file',
        size: 1024,
        modified: new Date('2024-03-03'),
      },
    ],
  },
  {
    id: '16',
    name: 'package.json',
    type: 'file',
    size: 2048,
    modified: new Date('2024-03-17'),
  },
  {
    id: '17',
    name: 'README.md',
    type: 'file',
    size: 1536,
    modified: new Date('2024-03-18'),
  },
];

/**
 * Basic file tree with default settings.
 */
export const Default: Story = {
  render: () => (
    <div className="h-96 w-80">
      <FileTree data={sampleData} defaultExpanded={['1', '2']}>
        <FileTreeContent data={sampleData} />
      </FileTree>
    </div>
  ),
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <div className="h-64 w-80">
          <FileTree variant="default" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <div className="h-64 w-80">
          <FileTree variant="ghost" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <div className="h-64 w-80">
          <FileTree variant="outline" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>
    </div>
  ),
};

/**
 * Different text sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-16">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <div className="h-48 w-80">
          <FileTree size="sm" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <div className="h-48 w-80">
          <FileTree size="md" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <div className="h-48 w-80">
          <FileTree size="lg" data={sampleData} defaultExpanded={['1']}>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>
    </div>
  ),
};

/**
 * Multi-select file tree.
 */
export const MultiSelect: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Selected: {selectedItems.length} items
          {selectedItems.length > 0 && (
            <span className="ml-2">({selectedItems.join(', ')})</span>
          )}
        </div>

        <div className="h-96 w-80">
          <FileTree
            data={sampleData}
            multiSelect
            defaultExpanded={['1', '2']}
            onSelectionChange={setSelectedItems}
          >
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>
      </div>
    );
  },
};

/**
 * File tree with search functionality.
 */
export const WithSearch: Story = {
  render: () => {
    const [filteredData, setFilteredData] = useState(sampleData);

    const handleSearch = (query: string) => {
      setFilteredData(filterTreeData(sampleData, query));
    };

    return (
      <div className="h-96 w-80">
        <FileTree data={filteredData} defaultExpanded={['1', '2']}>
          <FileTreeHeader>
            <FileTreeSearch onSearch={handleSearch} />
          </FileTreeHeader>
          <FileTreeContent data={filteredData} />
        </FileTree>
      </div>
    );
  },
};

/**
 * File tree with header and actions.
 */
export const WithHeaderAndActions: Story = {
  render: () => (
    <div className="h-96 w-80">
      <FileTree data={sampleData} defaultExpanded={['1']}>
        <FileTreeHeader>
          <h3 className="font-semibold">Project Files</h3>
          <FileTreeActions>
            <FileTreeButton>
              <Plus className="h-3 w-3" />
            </FileTreeButton>
            <FileTreeButton>
              <FolderPlus className="h-3 w-3" />
            </FileTreeButton>
          </FileTreeActions>
        </FileTreeHeader>
        <FileTreeContent data={sampleData} />
      </FileTree>
    </div>
  ),
};

/**
 * File tree with file sizes and modification dates.
 */
export const WithMetadata: Story = {
  render: () => (
    <div className="h-96 w-[500px]">
      <FileTree
        data={sampleData}
        showSize
        showModified
        defaultExpanded={['1', '2']}
      >
        <FileTreeHeader>
          <h3 className="font-semibold">File Explorer</h3>
        </FileTreeHeader>
        <FileTreeContent data={sampleData} />
      </FileTree>
    </div>
  ),
};

/**
 * Code editor file explorer.
 */
export const CodeEditor: Story = {
  render: () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleItemClick = (item: FileTreeItemType) => {
      if (item.type === 'file') {
        setSelectedFile(item.name);
      }
    };

    return (
      <div className="flex gap-4">
        <div className="h-96 w-80">
          <FileTree
            data={sampleData}
            defaultExpanded={['1', '2']}
            onItemClick={handleItemClick}
          >
            <FileTreeHeader>
              <h3 className="font-semibold">Explorer</h3>
              <FileTreeActions>
                <FileTreeButton>
                  <Plus className="h-3 w-3" />
                </FileTreeButton>
                <FileTreeButton>
                  <FolderPlus className="h-3 w-3" />
                </FileTreeButton>
                <FileTreeButton>
                  <Upload className="h-3 w-3" />
                </FileTreeButton>
              </FileTreeActions>
            </FileTreeHeader>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>

        <div className="h-96 flex-1 rounded-lg bg-muted p-4">
          {selectedFile ? (
            <div>
              <h4 className="mb-2 font-semibold">{selectedFile}</h4>
              <div className="text-muted-foreground text-sm">
                File content would be displayed here...
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Select a file to view its content
            </div>
          )}
        </div>
      </div>
    );
  },
};

/**
 * File manager with context menu actions.
 */
export const FileManager: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      item: FileTreeItemType;
    } | null>(null);

    const handleContextMenu = (
      item: FileTreeItemType,
      event: React.MouseEvent
    ) => {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        item,
      });
    };

    const handleCloseContextMenu = () => {
      setContextMenu(null);
    };

    React.useEffect(() => {
      const handleClick = () => setContextMenu(null);
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
      <div className="relative">
        <div className="h-96 w-80">
          <FileTree
            data={sampleData}
            multiSelect
            showSize
            defaultExpanded={['1']}
            onItemContextMenu={handleContextMenu}
          >
            <FileTreeHeader>
              <h3 className="font-semibold">File Manager</h3>
              <FileTreeActions>
                <FileTreeButton>
                  <Plus className="h-3 w-3" />
                </FileTreeButton>
                <FileTreeButton>
                  <Upload className="h-3 w-3" />
                </FileTreeButton>
                <FileTreeButton>
                  <Download className="h-3 w-3" />
                </FileTreeButton>
              </FileTreeActions>
            </FileTreeHeader>
            <FileTreeContent data={sampleData} />
          </FileTree>
        </div>

        {contextMenu && (
          <dialog
            open
            className="fixed z-50 min-w-32 rounded-lg border bg-popover py-1 shadow-lg"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onClick={handleCloseContextMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter') {
                handleCloseContextMenu();
              }
            }}
          >
            <Button className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm hover:bg-muted">
              <Edit className="h-3 w-3" />
              Rename
            </Button>
            <Button className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm hover:bg-muted">
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            <Button className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm hover:bg-muted">
              <Download className="h-3 w-3" />
              Download
            </Button>
            <hr className="my-1" />
            <Button className="flex w-full items-center gap-2 px-3 py-1 text-left text-destructive text-sm hover:bg-muted">
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </dialog>
        )}
      </div>
    );
  },
};

/**
 * Media library file tree.
 */
export const MediaLibrary: Story = {
  render: () => {
    const mediaData: FileTreeItemType[] = [
      {
        id: '1',
        name: 'Images',
        type: 'folder',
        children: [
          {
            id: '2',
            name: 'Photos',
            type: 'folder',
            children: [
              { id: '3', name: 'vacation.jpg', type: 'file', size: 2048000 },
              { id: '4', name: 'family.png', type: 'file', size: 1536000 },
              { id: '5', name: 'sunset.webp', type: 'file', size: 1024000 },
            ],
          },
          {
            id: '6',
            name: 'Icons',
            type: 'folder',
            children: [
              { id: '7', name: 'home.svg', type: 'file', size: 2048 },
              { id: '8', name: 'user.svg', type: 'file', size: 1536 },
            ],
          },
        ],
      },
      {
        id: '9',
        name: 'Videos',
        type: 'folder',
        children: [
          { id: '10', name: 'demo.mp4', type: 'file', size: 10485760 },
          { id: '11', name: 'tutorial.avi', type: 'file', size: 20971520 },
        ],
      },
      {
        id: '12',
        name: 'Audio',
        type: 'folder',
        children: [
          { id: '13', name: 'music.mp3', type: 'file', size: 5242880 },
          { id: '14', name: 'podcast.wav', type: 'file', size: 15728640 },
        ],
      },
    ];

    return (
      <div className="h-96 w-96">
        <FileTree data={mediaData} showSize defaultExpanded={['1', '2']}>
          <FileTreeHeader>
            <h3 className="font-semibold">Media Library</h3>
            <FileTreeActions>
              <FileTreeButton>
                <Upload className="h-3 w-3" />
              </FileTreeButton>
              <FileTreeButton>
                <FolderPlus className="h-3 w-3" />
              </FileTreeButton>
            </FileTreeActions>
          </FileTreeHeader>
          <FileTreeContent data={mediaData} />
        </FileTree>
      </div>
    );
  },
};

/**
 * Documentation site navigation.
 */
export const DocumentationNav: Story = {
  render: () => {
    const docsData: FileTreeItemType[] = [
      {
        id: '1',
        name: 'Getting Started',
        type: 'folder',
        children: [
          { id: '2', name: 'Installation', type: 'file' },
          { id: '3', name: 'Quick Start', type: 'file' },
          { id: '4', name: 'Configuration', type: 'file' },
        ],
      },
      {
        id: '5',
        name: 'Components',
        type: 'folder',
        children: [
          {
            id: '6',
            name: 'Layout',
            type: 'folder',
            children: [
              { id: '7', name: 'Container', type: 'file' },
              { id: '8', name: 'Grid', type: 'file' },
              { id: '9', name: 'Flex', type: 'file' },
            ],
          },
          {
            id: '10',
            name: 'Forms',
            type: 'folder',
            children: [
              { id: '11', name: 'Input', type: 'file' },
              { id: '12', name: 'Button', type: 'file' },
              { id: '13', name: 'Select', type: 'file' },
            ],
          },
        ],
      },
      {
        id: '14',
        name: 'API Reference',
        type: 'folder',
        children: [
          { id: '15', name: 'Hooks', type: 'file' },
          { id: '16', name: 'Utilities', type: 'file' },
          { id: '17', name: 'Types', type: 'file' },
        ],
      },
    ];

    return (
      <div className="h-96 w-80">
        <FileTree
          data={docsData}
          variant="ghost"
          defaultExpanded={['1', '5', '6']}
        >
          <FileTreeHeader>
            <h3 className="font-semibold">Documentation</h3>
            <FileTreeSearch placeholder="Search docs..." />
          </FileTreeHeader>
          <FileTreeContent data={docsData} />
        </FileTree>
      </div>
    );
  },
};

// Custom file tree info component for stories
const FileTreeInfo = () => {
  const { selectedItems, expandedItems } = useFileTree();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Selected Items:</span>
          <div>{selectedItems.size}</div>
        </div>
        <div>
          <span className="font-medium">Expanded Folders:</span>
          <div>{expandedItems.size}</div>
        </div>
      </div>
      {selectedItems.size > 0 && (
        <div className="mt-2">
          <span className="font-medium">Selected IDs:</span>
          <div className="text-muted-foreground text-xs">
            {Array.from(selectedItems).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Using the file tree context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="h-64 w-80">
        <FileTree data={sampleData} multiSelect defaultExpanded={['1']}>
          <FileTreeContent data={sampleData} />
          <FileTreeInfo />
        </FileTree>
      </div>
    </div>
  ),
};

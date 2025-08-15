/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmpty,
  type DropzoneFile,
  formatFileSize,
  useDropzone,
} from '@repo/design-system/ui/dropzone';
import { Label } from '@repo/design-system/ui/label';

/**
 * Allows users to drag-and-drop files into a container to upload or process them.
 */
const meta: Meta<typeof Dropzone> = {
  title: 'ui/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'active', 'error', 'success'],
      description: 'Visual variant of the dropzone',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the dropzone',
    },
    accept: {
      control: { type: 'text' },
      description: 'Accepted file types (MIME types or extensions)',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple file selection',
    },
    maxFiles: {
      control: { type: 'number' },
      description: 'Maximum number of files allowed',
    },
    maxSize: {
      control: { type: 'number' },
      description: 'Maximum file size in bytes',
    },
    minSize: {
      control: { type: 'number' },
      description: 'Minimum file size in bytes',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the dropzone',
    },
    showPreview: {
      control: { type: 'boolean' },
      description: 'Show image previews',
    },
    allowReplace: {
      control: { type: 'boolean' },
      description: 'Allow replacing existing files',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic dropzone with default settings.
 */
export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone onFilesChange={setFiles}>
          <DropzoneContent />
        </Dropzone>

        {files.length > 0 && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            <div className="mb-2 font-medium">Uploaded Files:</div>
            {files.map((file, index) => (
              <div key={index} className="flex justify-between">
                <span className="truncate">{file.name}</span>
                <span className="text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <div className="w-80">
          <Dropzone size="sm">
            <DropzoneContent />
          </Dropzone>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <div className="w-80">
          <Dropzone size="md">
            <DropzoneContent />
          </Dropzone>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <div className="w-80">
          <Dropzone size="lg">
            <DropzoneContent />
          </Dropzone>
        </div>
      </div>
    </div>
  ),
};

/**
 * Images only with preview.
 */
export const ImagesOnly: Story = {
  render: () => {
    const [_files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone accept="image/*" showPreview onFilesChange={setFiles}>
          <DropzoneContent>
            <DropzoneEmpty>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="font-medium text-sm">Upload images</div>
              <div className="text-muted-foreground text-xs">
                Drag and drop or click to upload
                <br />
                Accepts image/*
              </div>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * Single file with size limits.
 */
export const SingleFileWithLimits: Story = {
  render: () => {
    const [_files, setFiles] = useState<DropzoneFile[]>([]);
    const minSize = 1024; // 1KB
    const maxSize = 10 * 1024 * 1024; // 10MB

    return (
      <div className="w-96">
        <Dropzone
          multiple={false}
          minSize={minSize}
          maxSize={maxSize}
          onFilesChange={setFiles}
        >
          <DropzoneContent>
            <DropzoneEmpty>
              <div className="font-medium text-sm">Upload a file</div>
              <div className="text-muted-foreground text-xs">
                Drag and drop or click to upload
                <br />
                between {formatFileSize(minSize)} and {formatFileSize(maxSize)}
              </div>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * Multiple files with limit.
 */
export const MultipleFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone multiple maxFiles={5} onFilesChange={setFiles}>
          <DropzoneContent>
            <DropzoneEmpty>
              <div className="font-medium text-sm">Upload files</div>
              <div className="text-muted-foreground text-xs">
                Drag and drop or click to upload
                <br />
                Maximum 5 files
              </div>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>

        {files.length > 0 && (
          <div className="mt-4 rounded bg-muted p-3 text-sm">
            <div className="mb-2 font-medium">Files: {files.length}/5</div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Documents only.
 */
export const DocumentsOnly: Story = {
  render: () => {
    const [_files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone accept=".pdf,.doc,.docx,.txt,.rtf" onFilesChange={setFiles}>
          <DropzoneContent>
            <DropzoneEmpty>
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="font-medium text-sm">Upload documents</div>
              <div className="text-muted-foreground text-xs">
                Drag and drop or click to upload
                <br />
                Accepts PDF, DOC, DOCX, TXT, RTF
              </div>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * Custom empty state.
 */
export const CustomEmpty: Story = {
  render: () => {
    const [_files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone onFilesChange={setFiles}>
          <DropzoneContent>
            <DropzoneEmpty>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 font-semibold text-lg">
                Upload your videos
              </div>
              <div className="mb-4 text-muted-foreground text-sm">
                Share your content with the world
              </div>
              <Button variant="outline" size="sm">
                Choose files
              </Button>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <Dropzone disabled>
        <DropzoneContent>
          <DropzoneEmpty>
            <div className="font-medium text-sm">Upload disabled</div>
            <div className="text-muted-foreground text-xs">
              File upload is currently disabled
            </div>
          </DropzoneEmpty>
        </DropzoneContent>
      </Dropzone>
    </div>
  ),
};

/**
 * With replace functionality.
 */
export const WithReplace: Story = {
  render: () => {
    const [_files, setFiles] = useState<DropzoneFile[]>([]);

    return (
      <div className="w-96">
        <Dropzone
          multiple={false}
          allowReplace
          showPreview
          accept="image/*"
          onFilesChange={setFiles}
        >
          <DropzoneContent>
            <DropzoneEmpty>
              <div className="font-medium text-sm">Upload profile picture</div>
              <div className="text-muted-foreground text-xs">
                Drag and drop or click to upload
                <br />
                New files will replace existing ones
              </div>
            </DropzoneEmpty>
          </DropzoneContent>
        </Dropzone>
      </div>
    );
  },
};

/**
 * Controlled with external actions.
 */
export const Controlled: Story = {
  render: () => {
    const [files, setFiles] = useState<DropzoneFile[]>([]);

    const handleClear = () => {
      setFiles([]);
    };

    const handleAddSample = () => {
      const sampleFile = new File(['sample content'], 'sample.txt', {
        type: 'text/plain',
      });
      setFiles((prev) => [...prev, sampleFile as DropzoneFile]);
    };

    return (
      <div className="w-96 space-y-4">
        <Dropzone onFilesChange={setFiles}>
          <DropzoneContent />
        </Dropzone>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddSample}>
            Add Sample File
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        <div className="rounded bg-muted p-3 text-sm">
          <div>
            <strong>Files:</strong> {files.length}
          </div>
          <div>
            <strong>Total Size:</strong>{' '}
            {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * File upload form.
 */
export const FileUploadForm: Story = {
  render: () => {
    const [files, setFiles] = useState<DropzoneFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async () => {
      if (files.length === 0) {
        return;
      }

      setIsUploading(true);

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsUploading(false);
      alert(`Uploaded ${files.length} file(s) successfully!`);
      setFiles([]);
    };

    return (
      <div className="w-96 space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">
            Project Files
          </Label>
          <Dropzone
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
            onFilesChange={setFiles}
          >
            <DropzoneContent>
              <DropzoneEmpty>
                <div className="font-medium text-sm">Upload project files</div>
                <div className="text-muted-foreground text-xs">
                  Maximum 10 files, 50MB each
                </div>
              </DropzoneEmpty>
            </DropzoneContent>
          </Dropzone>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={files.length === 0 || isUploading}
            className="flex-1"
          >
            {isUploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFiles([])}
            disabled={files.length === 0 || isUploading}
          >
            Clear
          </Button>
        </div>

        {files.length > 0 && (
          <div className="rounded bg-muted p-3 text-sm">
            <div className="mb-2 font-medium">Ready to upload:</div>
            <div className="space-y-1">
              {files.map((file, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Using the dropzone context hook.
 */
const DropzoneInfo = () => {
  const { files, isDragActive, isUploading, error, clearFiles } = useDropzone();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Files:</span>
          <div>{files.length}</div>
        </div>
        <div>
          <span className="font-medium">Drag Active:</span>
          <div>{isDragActive ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Uploading:</span>
          <div>{isUploading ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Error:</span>
          <div>{error || 'None'}</div>
        </div>
      </div>
      {files.length > 0 && (
        <Button variant="outline" size="sm" onClick={clearFiles}>
          Clear Files
        </Button>
      )}
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <div className="w-96">
      <Dropzone>
        <DropzoneContent>
          <DropzoneEmpty>
            <div className="font-medium text-sm">Context Demo</div>
            <div className="text-muted-foreground text-xs">
              Upload files to see live context updates
            </div>
          </DropzoneEmpty>
        </DropzoneContent>
        <DropzoneInfo />
      </Dropzone>
    </div>
  ),
};

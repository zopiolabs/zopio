/**
 * SPDX-License-Identifier: MIT
 */

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@repo/design-system/ui/dropzone';
import type { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';
import { useState } from 'react';

const meta: Meta<typeof Dropzone> = {
  title: 'UI/Dropzone',
  component: Dropzone,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
        >
          {files.length > 0 ? <DropzoneContent /> : <DropzoneEmptyState />}
        </Dropzone>
      </div>
    );
  },
};

export const WithMinAndMaxSizes: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          minSize={1024} // 1KB
          maxSize={10485760} // 10MB
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
        >
          {files.length > 0 ? <DropzoneContent /> : <DropzoneEmptyState />}
        </Dropzone>
      </div>
    );
  },
};

export const MultipleFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          maxFiles={5}
          onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
        >
          {files.length > 0 ? <DropzoneContent /> : <DropzoneEmptyState />}
        </Dropzone>
      </div>
    );
  },
};

export const ImagesOnly: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          accept={{
            'image/*': [],
          }}
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
        >
          {files.length > 0 ? <DropzoneContent /> : <DropzoneEmptyState />}
        </Dropzone>
      </div>
    );
  },
};

export const WithCustomEmptyState: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
        >
          {files.length > 0 ? (
            <DropzoneContent />
          ) : (
            <DropzoneEmptyState>
              <div className="flex flex-col items-center justify-center">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Upload icon"
                  >
                    <title>Upload files</title>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="my-2 font-medium">Drop your files here</p>
                <p className="text-muted-foreground">or click to browse</p>
              </div>
            </DropzoneEmptyState>
          )}
        </Dropzone>
      </div>
    );
  },
};

export const ShowingImagePreview: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDrop = (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
        }
      }
    };

    return (
      <div className="w-[400px]">
        <Dropzone
          src={files}
          accept={{
            'image/*': [],
          }}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-md">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                Drag and drop or click to replace
              </p>
            </div>
          ) : (
            <DropzoneEmptyState />
          )}
        </Dropzone>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-[400px]">
        <Dropzone disabled>
          <DropzoneEmptyState />
        </Dropzone>
      </div>
    );
  },
};

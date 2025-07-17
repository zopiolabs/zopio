import { Button } from '@repo/design-system/ui/button';
import {
  Cropper,
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from '@repo/design-system/ui/imageCrop';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Image from 'next/image';
// SPDX-License-Identifier: MIT
import { useRef, useState } from 'react';

const meta: Meta<typeof Cropper> = {
  title: 'ui/ImageCrop',
  component: Cropper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Image cropper component based on react-image-crop and shadcn-ui, with reset and apply actions.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Cropper>;

export const Basic: Story = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cropped, setCropped] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setCropped(null);
          }
        }}
        data-testid="file-input"
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="mb-2"
      >
        Upload Image
      </Button>
      {file && (
        <ImageCrop
          file={file}
          onCrop={setCropped}
          aspect={1}
          maxImageSize={1024 * 1024 * 2}
        >
          <ImageCropContent className="rounded border" />
          <div className="mt-2 flex gap-2">
            <ImageCropApply />
            <ImageCropReset />
          </div>
        </ImageCrop>
      )}
      {cropped && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-xs">Cropped Preview</span>
          <Image
            src={cropped}
            alt="Cropped preview"
            className="max-h-[200px] max-w-[200px] rounded border object-contain"
            data-testid="cropped-preview"
          />
        </div>
      )}
    </div>
  );
};

Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story:
        'Upload an image, crop it, reset, and apply. Cropped image is previewed below.',
    },
  },
};

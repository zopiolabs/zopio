/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Crop, Download, RotateCcw, Upload } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  ImageCrop,
  ImageCropButton,
  ImageCropCanvas,
  ImageCropControls,
  cropImage,
  useImageCrop,
} from '@repo/design-system/ui/image-crop';
import { Label } from '@repo/design-system/ui/label';
import Image from 'next/image';

/**
 * A component that allows users to crop images with customizable aspect ratios and circular cropping options.
 */
const meta: Meta<typeof ImageCrop> = {
  title: 'ui/Image Crop',
  component: ImageCrop,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the crop container',
    },
    aspectRatio: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Aspect ratio constraint (width/height)',
    },
    circular: {
      control: { type: 'boolean' },
      description: 'Enable circular cropping',
    },
    maxFileSize: {
      control: { type: 'number' },
      description: 'Maximum file size in bytes',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample image URL for demos
const SAMPLE_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjQwMCB4IDMwMDwvdGV4dD4KPC9zdmc+';

/**
 * Basic image crop with default settings.
 */
export const Default: Story = {
  render: () => {
    const [croppedImage, setCroppedImage] = useState<string>('');

    const _handleCrop = async () => {
      // This would be handled by the crop button in a real implementation
    };

    return (
      <div className="space-y-4">
        <ImageCrop src={SAMPLE_IMAGE} onCrop={setCroppedImage}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
            <ImageCropButton variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </ImageCropButton>
          </ImageCropControls>
        </ImageCrop>

        {croppedImage && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Cropped Result:</h4>
            <Image
              src={croppedImage}
              alt="Cropped"
              className="max-w-xs rounded border"
            />
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
        <ImageCrop src={SAMPLE_IMAGE} size="sm">
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <ImageCrop src={SAMPLE_IMAGE} size="md">
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <ImageCrop src={SAMPLE_IMAGE} size="lg">
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>
    </div>
  ),
};

/**
 * Square aspect ratio (1:1).
 */
export const SquareAspectRatio: Story = {
  render: () => {
    const [croppedImage, setCroppedImage] = useState<string>('');

    return (
      <div className="space-y-4">
        <ImageCrop src={SAMPLE_IMAGE} aspectRatio={1} onCrop={setCroppedImage}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
            <span className="text-muted-foreground text-sm">1:1 Square</span>
          </ImageCropControls>
        </ImageCrop>

        {croppedImage && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Square Crop:</h4>
            <Image
              src={croppedImage}
              alt="Square crop"
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>
    );
  },
};

/**
 * Circular crop for avatars.
 */
export const CircularCrop: Story = {
  render: () => {
    const [croppedImage, setCroppedImage] = useState<string>('');

    return (
      <div className="space-y-4">
        <ImageCrop
          src={SAMPLE_IMAGE}
          circular
          aspectRatio={1}
          onCrop={setCroppedImage}
        >
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
            <span className="text-muted-foreground text-sm">
              Circular Avatar
            </span>
          </ImageCropControls>
        </ImageCrop>

        {croppedImage && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Avatar:</h4>
            <Image
              src={croppedImage}
              alt="Avatar"
              className="h-24 w-24 rounded-full border"
            />
          </div>
        )}
      </div>
    );
  },
};

/**
 * Different aspect ratios.
 */
export const AspectRatios: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">16:9 Widescreen</h4>
        <ImageCrop src={SAMPLE_IMAGE} aspectRatio={16 / 9}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">4:3 Standard</h4>
        <ImageCrop src={SAMPLE_IMAGE} aspectRatio={4 / 3}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">3:2 Photo</h4>
        <ImageCrop src={SAMPLE_IMAGE} aspectRatio={3 / 2}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
          </ImageCropControls>
        </ImageCrop>
      </div>
    </div>
  ),
};

/**
 * Custom controls and buttons.
 */
export const CustomButtons: Story = {
  render: () => {
    const [croppedImage, setCroppedImage] = useState<string>('');

    return (
      <div className="space-y-4">
        <ImageCrop src={SAMPLE_IMAGE} onCrop={setCroppedImage}>
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
            <ImageCropButton variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </ImageCropButton>
            <ImageCropButton variant="ghost">
              <Download className="mr-2 h-4 w-4" />
              Download
            </ImageCropButton>
          </ImageCropControls>
        </ImageCrop>

        {croppedImage && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Result:</h4>
            <Image
              src={croppedImage}
              alt="Cropped"
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>
    );
  },
};

/**
 * File upload integration.
 */
export const FileUpload: Story = {
  render: () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [croppedImage, setCroppedImage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-muted-foreground text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-primary-foreground file:text-sm hover:file:bg-primary/90"
          />
        </div>

        {imageSrc && (
          <ImageCrop src={imageSrc} onCrop={setCroppedImage}>
            <ImageCropCanvas />
            <ImageCropControls>
              <CropButton />
              <ImageCropButton
                variant="outline"
                onClick={() => setImageSrc('')}
              >
                Clear
              </ImageCropButton>
            </ImageCropControls>
          </ImageCrop>
        )}

        {croppedImage && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Cropped Image:</h4>
            <Image
              src={croppedImage}
              alt="Cropped"
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>
    );
  },
};

/**
 * Profile picture editor.
 */
export const ProfilePictureEditor: Story = {
  render: () => {
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-muted-foreground/25 border-dashed bg-muted">
            {croppedImage ? (
              <Image
                src={croppedImage}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile Picture'}
          </Button>
        </div>

        {isEditing && (
          <ImageCrop
            src={SAMPLE_IMAGE}
            circular
            aspectRatio={1}
            onCrop={(url) => {
              setCroppedImage(url);
              setIsEditing(false);
            }}
          >
            <ImageCropCanvas />
            <ImageCropControls>
              <CropButton />
              <ImageCropButton
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </ImageCropButton>
            </ImageCropControls>
          </ImageCrop>
        )}
      </div>
    );
  },
};

/**
 * Batch image processing.
 */
export const BatchProcessing: Story = {
  render: () => {
    const [images] = useState([
      { id: 1, src: SAMPLE_IMAGE, name: 'Image 1' },
      { id: 2, src: SAMPLE_IMAGE, name: 'Image 2' },
      { id: 3, src: SAMPLE_IMAGE, name: 'Image 3' },
    ]);
    const [currentImage, setCurrentImage] = useState(0);
    const [croppedImages, setCroppedImages] = useState<string[]>([]);

    const handleCrop = (url: string) => {
      setCroppedImages((prev) => {
        const newImages = [...prev];
        newImages[currentImage] = url;
        return newImages;
      });

      // Move to next image
      if (currentImage < images.length - 1) {
        setCurrentImage(currentImage + 1);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Batch Crop Images</h3>
          <span className="text-muted-foreground text-sm">
            {currentImage + 1} of {images.length}
          </span>
        </div>

        <div className="flex gap-2">
          {images.map((_, index) => (
            <Button
              key={index}
              variant={index === currentImage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentImage(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <ImageCrop
          src={images[currentImage].src}
          aspectRatio={1}
          onCrop={handleCrop}
        >
          <ImageCropCanvas />
          <ImageCropControls>
            <CropButton />
            <span className="text-muted-foreground text-sm">
              {images[currentImage].name}
            </span>
          </ImageCropControls>
        </ImageCrop>

        {croppedImages.length > 0 && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium text-sm">Processed Images:</h4>
            <div className="flex gap-2">
              {croppedImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Cropped ${index + 1}`}
                  className="h-16 w-16 rounded border object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * No image state.
 */
export const NoImage: Story = {
  render: () => (
    <ImageCrop>
      <ImageCropCanvas />
      <ImageCropControls>
        <ImageCropButton disabled>
          <Crop className="mr-2 h-4 w-4" />
          Crop
        </ImageCropButton>
        <ImageCropButton variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </ImageCropButton>
      </ImageCropControls>
    </ImageCrop>
  ),
};

// Custom crop button component for stories
const CropButton = () => {
  const { image, cropArea, circular, onCrop } = useImageCrop();

  const handleCrop = async () => {
    if (image && onCrop) {
      const croppedUrl = await cropImage(image, cropArea, circular);
      onCrop(croppedUrl);
    }
  };

  return (
    <ImageCropButton onClick={handleCrop} disabled={!image}>
      <Crop className="mr-2 h-4 w-4" />
      Crop
    </ImageCropButton>
  );
};

/**
 * Using the image crop context hook.
 */
const CropInfo = () => {
  const { image, cropArea, circular, aspectRatio } = useImageCrop();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Image:</span>
          <div>{image ? `${image.width}x${image.height}` : 'None'}</div>
        </div>
        <div>
          <span className="font-medium">Crop Area:</span>
          <div>
            {Math.round(cropArea.width)}x{Math.round(cropArea.height)}
          </div>
        </div>
        <div>
          <span className="font-medium">Circular:</span>
          <div>{circular ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Aspect Ratio:</span>
          <div>{aspectRatio ? aspectRatio.toFixed(2) : 'Free'}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <ImageCrop src={SAMPLE_IMAGE} aspectRatio={16 / 9}>
        <ImageCropCanvas />
        <ImageCropControls>
          <CropButton />
        </ImageCropControls>
        <CropInfo />
      </ImageCrop>
    </div>
  ),
};

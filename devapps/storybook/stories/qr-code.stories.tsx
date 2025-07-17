/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import { QRCode } from '@repo/design-system/ui/qr-code';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';

/**
 * QR Code is a component that generates a QR code from a string.
 * It uses shadcn/ui CSS variables --foreground and --background by default,
 * but also supports custom foreground and background colors.
 */
const meta = {
  title: 'ui/QR Code',
  component: QRCode,
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'text',
      description: 'The data to encode in the QR code',
    },
    foreground: {
      control: 'color',
      description: 'Foreground color of the QR code (optional)',
    },
    background: {
      control: 'color',
      description: 'Background color of the QR code (optional)',
    },
    robustness: {
      control: { type: 'select', options: ['L', 'M', 'Q', 'H'] },
      description: 'Error correction level (L: 7%, M: 15%, Q: 25%, H: 30%)',
    },
  },
  args: {
    data: 'https://www.kibo-ui.com/components/qr-code',
    robustness: 'M',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QRCode>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic QR code with default settings.
 */
export const Default: Story = {
  render: (args) => (
    <div className="h-64 w-64">
      <QRCode {...args} />
    </div>
  ),
};

/**
 * QR code with different sizes.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-8">
      <div className="h-32 w-32">
        <QRCode {...args} />
      </div>
      <div className="h-64 w-64">
        <QRCode {...args} />
      </div>
      <div className="h-96 w-96">
        <QRCode {...args} />
      </div>
    </div>
  ),
};

/**
 * QR code with custom colors.
 */
export const CustomColors: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      <div className="h-64 w-64">
        <QRCode {...args} foreground="#000000" background="#ffffff" />
      </div>
      <div className="h-64 w-64">
        <QRCode {...args} foreground="#ff0000" background="#ffffff" />
      </div>
      <div className="h-64 w-64">
        <QRCode {...args} foreground="#0000ff" background="#ffff00" />
      </div>
      <div className="h-64 w-64">
        <QRCode {...args} foreground="#ffffff" background="#000000" />
      </div>
    </div>
  ),
};

/**
 * QR code with different robustness levels.
 */
export const Robustness: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="h-64 w-64">
          <QRCode {...args} robustness="L" />
        </div>
        <p className="text-muted-foreground text-sm">
          Level L (7% error correction)
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-64 w-64">
          <QRCode {...args} robustness="M" />
        </div>
        <p className="text-muted-foreground text-sm">
          Level M (15% error correction)
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-64 w-64">
          <QRCode {...args} robustness="Q" />
        </div>
        <p className="text-muted-foreground text-sm">
          Level Q (25% error correction)
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-64 w-64">
          <QRCode {...args} robustness="H" />
        </div>
        <p className="text-muted-foreground text-sm">
          Level H (30% error correction)
        </p>
      </div>
    </div>
  ),
};

/**
 * Interactive QR code generator.
 */
export const Interactive: Story = {
  render: () => {
    // This is a client component that needs useState
    const InteractiveExample = () => {
      const [data, setData] = useState(
        'https://www.kibo-ui.com/components/qr-code'
      );
      const [robustness, setRobustness] = useState<'L' | 'M' | 'Q' | 'H'>('M');
      const [foreground, setForeground] = useState('#000000');
      const [background, setBackground] = useState('#ffffff');

      return (
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="h-64 w-64">
            <QRCode
              data={data}
              robustness={robustness}
              foreground={foreground}
              background={background}
            />
          </div>
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-data">Data</Label>
              <Input
                id="qr-data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Enter data to encode"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-robustness">Error Correction Level</Label>
              <Select
                value={robustness}
                onValueChange={(value) =>
                  setRobustness(value as 'L' | 'M' | 'Q' | 'H')
                }
              >
                <SelectTrigger id="qr-robustness">
                  <SelectValue placeholder="Select robustness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">
                    Level L (7% error correction)
                  </SelectItem>
                  <SelectItem value="M">
                    Level M (15% error correction)
                  </SelectItem>
                  <SelectItem value="Q">
                    Level Q (25% error correction)
                  </SelectItem>
                  <SelectItem value="H">
                    Level H (30% error correction)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-foreground">Foreground Color</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-foreground"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  placeholder="#000000"
                />
                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="h-10 w-10 rounded-md p-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-background">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-background"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#ffffff"
                />
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-10 w-10 rounded-md p-1"
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <InteractiveExample />;
  },
};

/**
 * QR code with a custom style.
 */
export const CustomStyle: Story = {
  render: (args) => (
    <div className="h-64 w-64 rounded-lg border-2 border-primary bg-gradient-to-br from-background to-muted p-4 shadow-lg">
      <QRCode {...args} />
    </div>
  ),
};

/**
 * QR code with a responsive container.
 */
export const Responsive: Story = {
  render: (args) => (
    <div className="aspect-square w-full max-w-md">
      <QRCode {...args} />
    </div>
  ),
};

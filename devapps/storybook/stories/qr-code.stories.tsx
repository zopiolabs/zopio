/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import { QRCode, QRCodeServer } from '@repo/design-system/ui/qr-code';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';

/**
 * QR Code component that generates QR codes from any string data.
 */
const meta: Meta<typeof QRCode> = {
  title: 'ui/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The string to encode in the QR code',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the QR code',
    },
    errorCorrectionLevel: {
      control: { type: 'select' },
      options: ['L', 'M', 'Q', 'H'],
      description: 'Error correction level',
    },
    foregroundColor: {
      control: { type: 'color' },
      description: 'Color of the QR code pattern',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Background color of the QR code',
    },
    includeMargin: {
      control: { type: 'boolean' },
      description: 'Include margin around the QR code',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default QR code.
 */
export const Default: Story = {
  args: {
    value: 'https://example.com',
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <QRCode value="Small QR Code" size="sm" />
        <p className="mt-2 text-muted-foreground text-xs">Small</p>
      </div>
      <div className="text-center">
        <QRCode value="Medium QR Code" size="md" />
        <p className="mt-2 text-muted-foreground text-xs">Medium</p>
      </div>
      <div className="text-center">
        <QRCode value="Large QR Code" size="lg" />
        <p className="mt-2 text-muted-foreground text-xs">Large</p>
      </div>
      <div className="text-center">
        <QRCode value="Extra Large QR Code" size="xl" />
        <p className="mt-2 text-muted-foreground text-xs">Extra Large</p>
      </div>
    </div>
  ),
};

/**
 * Custom colors.
 */
export const CustomColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <QRCode
          value="Blue QR Code"
          foregroundColor="#3b82f6"
          backgroundColor="#eff6ff"
        />
        <p className="mt-2 text-muted-foreground text-xs">Blue theme</p>
      </div>
      <div className="text-center">
        <QRCode
          value="Green QR Code"
          foregroundColor="#10b981"
          backgroundColor="#f0fdf4"
        />
        <p className="mt-2 text-muted-foreground text-xs">Green theme</p>
      </div>
      <div className="text-center">
        <QRCode
          value="Red QR Code"
          foregroundColor="#ef4444"
          backgroundColor="#fef2f2"
        />
        <p className="mt-2 text-muted-foreground text-xs">Red theme</p>
      </div>
      <div className="text-center">
        <QRCode
          value="Purple QR Code"
          foregroundColor="#8b5cf6"
          backgroundColor="#faf5ff"
        />
        <p className="mt-2 text-muted-foreground text-xs">Purple theme</p>
      </div>
    </div>
  ),
};

/**
 * Error correction levels.
 */
export const ErrorCorrection: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <QRCode value="Low error correction" errorCorrectionLevel="L" />
        <p className="mt-2 text-muted-foreground text-xs">Low (L) - ~7%</p>
      </div>
      <div className="text-center">
        <QRCode value="Medium error correction" errorCorrectionLevel="M" />
        <p className="mt-2 text-muted-foreground text-xs">Medium (M) - ~15%</p>
      </div>
      <div className="text-center">
        <QRCode value="Quartile error correction" errorCorrectionLevel="Q" />
        <p className="mt-2 text-muted-foreground text-xs">
          Quartile (Q) - ~25%
        </p>
      </div>
      <div className="text-center">
        <QRCode value="High error correction" errorCorrectionLevel="H" />
        <p className="mt-2 text-muted-foreground text-xs">High (H) - ~30%</p>
      </div>
    </div>
  ),
};

/**
 * With and without margins.
 */
export const Margins: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="text-center">
        <div className="border-2 border-muted-foreground/20 border-dashed p-2">
          <QRCode value="With margin" includeMargin={true} />
        </div>
        <p className="mt-2 text-muted-foreground text-xs">With margin</p>
      </div>
      <div className="text-center">
        <div className="border-2 border-muted-foreground/20 border-dashed p-2">
          <QRCode value="Without margin" includeMargin={false} />
        </div>
        <p className="mt-2 text-muted-foreground text-xs">Without margin</p>
      </div>
    </div>
  ),
};

/**
 * Interactive QR code generator.
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('https://example.com');
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
    const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [foregroundColor, setForegroundColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <QRCode
            value={value}
            size={size}
            errorCorrectionLevel={errorLevel}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="qr-value">Content</Label>
            <Input
              id="qr-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text or URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-size">Size</Label>
            <Select
              value={size}
              onValueChange={(value: 'sm' | 'md' | 'lg' | 'xl') =>
                setSize(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-error">Error Correction</Label>
            <Select
              value={errorLevel}
              onValueChange={(value: 'L' | 'M' | 'Q' | 'H') =>
                setErrorLevel(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (L)</SelectItem>
                <SelectItem value="M">Medium (M)</SelectItem>
                <SelectItem value="Q">Quartile (Q)</SelectItem>
                <SelectItem value="H">High (H)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-fg">Foreground Color</Label>
            <div className="flex gap-2">
              <Input
                id="qr-fg"
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="h-10 w-16"
              />
              <Input
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-bg">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="qr-bg"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-16"
              />
              <Input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Common use cases.
 */
export const UseCases: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Website URL</h3>
        <div className="rounded-lg border p-4 text-center">
          <QRCode value="https://example.com" size="lg" />
          <p className="mt-2 text-muted-foreground text-sm">
            Scan to visit website
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Info</h3>
        <div className="rounded-lg border p-4 text-center">
          <QRCode
            value="BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Company
TEL:+1234567890
EMAIL:john@example.com
END:VCARD"
            size="lg"
          />
          <p className="mt-2 text-muted-foreground text-sm">
            Scan to add contact
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">WiFi Network</h3>
        <div className="rounded-lg border p-4 text-center">
          <QRCode value="WIFI:T:WPA;S:MyNetwork;P:MyPassword;;" size="lg" />
          <p className="mt-2 text-muted-foreground text-sm">
            Scan to connect to WiFi
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">SMS Message</h3>
        <div className="rounded-lg border p-4 text-center">
          <QRCode value="sms:+1234567890:Hello from QR code!" size="lg" />
          <p className="mt-2 text-muted-foreground text-sm">Scan to send SMS</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Server-side rendering example.
 */
export const ServerSide: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <h3 className="font-semibold text-lg">Server Component</h3>
      <p className="text-muted-foreground text-sm">
        This QR code is rendered server-side with explicit colors
      </p>
      <QRCodeServer
        value="Server-side rendered QR code"
        size="lg"
        foregroundColor="#000000"
        backgroundColor="#ffffff"
      />
    </div>
  ),
};

/**
 * Styled with custom CSS.
 */
export const Styled: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="text-center">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <QRCode
            value="Styled QR Code 1"
            className="mx-auto rounded-lg shadow-lg"
            foregroundColor="#1e40af"
            backgroundColor="#ffffff"
          />
        </div>
        <p className="mt-2 text-muted-foreground text-xs">
          With gradient background
        </p>
      </div>

      <div className="text-center">
        <div className="rounded-lg bg-black p-4">
          <QRCode
            value="Styled QR Code 2"
            className="mx-auto rounded-lg border-2 border-white"
            foregroundColor="#ffffff"
            backgroundColor="#000000"
          />
        </div>
        <p className="mt-2 text-muted-foreground text-xs">
          Dark theme with border
        </p>
      </div>

      <div className="text-center">
        <div className="rounded-lg bg-gradient-to-br from-pink-50 to-rose-100 p-4">
          <QRCode
            value="Styled QR Code 3"
            className="mx-auto rounded-full shadow-xl"
            foregroundColor="#e11d48"
            backgroundColor="#ffffff"
          />
        </div>
        <p className="mt-2 text-muted-foreground text-xs">
          Circular with shadow
        </p>
      </div>
    </div>
  ),
};

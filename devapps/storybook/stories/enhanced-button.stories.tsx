/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Download, Heart, Send, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Card } from '@repo/design-system/ui';
import { EnhancedButton } from '@repo/design-system/ui';

/**
 * EnhancedButton extends the standard Button with loading states, icons, and positioning options.
 */
const meta: Meta<typeof EnhancedButton> = {
  title: 'ui/EnhancedButton',
  component: EnhancedButton,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    isLoading: {
      control: 'boolean',
    },
    loadingText: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Button',
    isLoading: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default primary variant of the EnhancedButton.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary variant with reduced emphasis.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Outline variant for secondary actions.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Ghost variant for minimal visual impact.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Small size button for compact UI elements.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Large size button for prominent actions.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Button with left-positioned icon.
 */
export const WithLeftIcon: Story = {
  args: {
    icon: <Heart />,
    iconPosition: 'left',
    children: 'Like',
  },
};

/**
 * Button with right-positioned icon.
 */
export const WithRightIcon: Story = {
  args: {
    icon: <Settings />,
    iconPosition: 'right',
    children: 'Settings',
  },
};

/**
 * Button in loading state with custom loading text.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    loadingText: 'Loading...',
    children: 'Submit',
  },
};

/**
 * Complete demo showcasing all variants and features.
 */
export const CompleteDemo: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
      {}
    );

    function handleClick(id: string) {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }

    return (
      <div className="flex min-h-[400px] w-full items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-6">
          <div className="space-y-8">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Variants</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col space-y-2">
                  <span className="font-medium text-sm">Primary</span>
                  <EnhancedButton
                    variant="primary"
                    onClick={() => handleClick('primary')}
                    isLoading={loadingStates.primary}
                    loadingText="Saving..."
                  >
                    Save
                  </EnhancedButton>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-medium text-sm">Secondary</span>
                  <EnhancedButton
                    variant="secondary"
                    onClick={() => handleClick('secondary')}
                    isLoading={loadingStates.secondary}
                    loadingText="Loading..."
                  >
                    Load Data
                  </EnhancedButton>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-medium text-sm">Outline</span>
                  <EnhancedButton
                    variant="outline"
                    onClick={() => handleClick('outline')}
                    isLoading={loadingStates.outline}
                    loadingText="Downloading..."
                  >
                    Download
                  </EnhancedButton>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-medium text-sm">Ghost</span>
                  <EnhancedButton
                    variant="ghost"
                    onClick={() => handleClick('ghost')}
                    isLoading={loadingStates.ghost}
                    loadingText="Deleting..."
                  >
                    Delete
                  </EnhancedButton>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <EnhancedButton
                  size="sm"
                  onClick={() => handleClick('small')}
                  isLoading={loadingStates.small}
                  icon={<Heart className="h-3 w-3" />}
                >
                  Small
                </EnhancedButton>
                <EnhancedButton
                  size="md"
                  onClick={() => handleClick('medium')}
                  isLoading={loadingStates.medium}
                  icon={<Download className="h-4 w-4" />}
                >
                  Medium
                </EnhancedButton>
                <EnhancedButton
                  size="lg"
                  onClick={() => handleClick('large')}
                  isLoading={loadingStates.large}
                  icon={<Send className="h-5 w-5" />}
                >
                  Large
                </EnhancedButton>
              </div>
            </div>

            {/* With Icons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">With Icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <EnhancedButton
                  onClick={() => handleClick('icon-left')}
                  isLoading={loadingStates['icon-left']}
                  icon={<Heart className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Like
                </EnhancedButton>
                <EnhancedButton
                  onClick={() => handleClick('icon-right')}
                  isLoading={loadingStates['icon-right']}
                  icon={<Settings className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Settings
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  onClick={() => handleClick('icon-outline')}
                  isLoading={loadingStates['icon-outline']}
                  icon={<Trash2 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Remove
                </EnhancedButton>
              </div>
            </div>

            {/* Loading States */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Loading States</h3>
              <div className="flex flex-wrap items-center gap-4">
                <EnhancedButton
                  onClick={() => handleClick('loading-1')}
                  isLoading={loadingStates['loading-1']}
                  loadingText="Processing..."
                >
                  Process
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  onClick={() => handleClick('loading-2')}
                  isLoading={loadingStates['loading-2']}
                  loadingText="Uploading..."
                  icon={<Send className="h-4 w-4" />}
                >
                  Upload
                </EnhancedButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

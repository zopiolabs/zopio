/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  DialogStack,
  DialogStackButton,
  createDialog,
  useDialogStack,
} from '@repo/design-system/ui/dialog-stack';

/**
 * A component that manages multiple overlapping dialogs with stacking, maximizing, and focus management.
 */
const meta: Meta<typeof DialogStack> = {
  title: 'ui/Dialog Stack',
  component: DialogStack,
  tags: ['autodocs'],
  argTypes: {
    backdrop: {
      control: { type: 'select' },
      options: ['default', 'dark', 'light', 'none'],
      description: 'Backdrop styling for dialogs',
    },
    maxDialogs: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of dialogs allowed',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic dialog stack with simple dialogs.
 */
export const Default: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <DialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Different backdrop styles.
 */
export const BackdropStyles: Story = {
  render: () => {
    const [backdrop, setBackdrop] = useState<
      'default' | 'dark' | 'light' | 'none'
    >('default');

    return (
      <div className="space-y-4 p-8">
        <div className="flex gap-2">
          <Button
            onClick={() => setBackdrop('default')}
            className={`rounded border px-3 py-1 text-sm ${
              backdrop === 'default'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
          >
            Default
          </Button>
          <Button
            onClick={() => setBackdrop('dark')}
            className={`rounded border px-3 py-1 text-sm ${
              backdrop === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
          >
            Dark
          </Button>
          <Button
            onClick={() => setBackdrop('light')}
            className={`rounded border px-3 py-1 text-sm ${
              backdrop === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
          >
            Light
          </Button>
          <Button
            onClick={() => setBackdrop('none')}
            className={`rounded border px-3 py-1 text-sm ${
              backdrop === 'none'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            }`}
          >
            None
          </Button>
        </div>

        <DialogStack backdrop={backdrop}>
          <DialogControls />
        </DialogStack>
      </div>
    );
  },
};

/**
 * Different dialog sizes.
 */
export const DialogSizes: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <SizeDialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Dialog with maximize functionality.
 */
export const MaximizableDialogs: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <MaximizeDialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Non-closable dialogs.
 */
export const NonClosableDialogs: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <NonClosableDialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Dialog limit demonstration.
 */
export const DialogLimit: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack maxDialogs={3}>
        <LimitDialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Complex dialog content.
 */
export const ComplexContent: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <ComplexDialogControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Notification-style dialogs.
 */
export const NotificationDialogs: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack backdrop="none">
        <NotificationControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Modal workflow with multiple steps.
 */
export const WorkflowDialogs: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <WorkflowControls />
      </DialogStack>
    </div>
  ),
};

/**
 * Dialog with custom actions.
 */
export const CustomActions: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <CustomActionControls />
      </DialogStack>
    </div>
  ),
};

// Basic dialog controls component
const DialogControls = () => {
  const { openDialog, closeAllDialogs, dialogs } = useDialogStack();

  const openSimpleDialog = () => {
    openDialog(
      createDialog(
        'Simple Dialog',
        <div className="space-y-4">
          <p>This is a simple dialog with some content.</p>
          <p>You can close it using the X button or press Escape.</p>
        </div>
      )
    );
  };

  const openAnotherDialog = () => {
    openDialog(
      createDialog(
        'Another Dialog',
        <div className="space-y-4">
          <p>This is another dialog that will stack on top.</p>
          <p>Click on background dialogs to bring them to front.</p>
        </div>
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <DialogStackButton onClick={openSimpleDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Open Dialog
        </DialogStackButton>

        <DialogStackButton variant="outline" onClick={openAnotherDialog}>
          Open Another
        </DialogStackButton>

        <DialogStackButton
          variant="destructive"
          onClick={closeAllDialogs}
          disabled={dialogs.length === 0}
        >
          Close All ({dialogs.length})
        </DialogStackButton>
      </div>

      <div className="text-muted-foreground text-sm">
        Open dialogs: {dialogs.length}
      </div>
    </div>
  );
};

// Size dialog controls
const SizeDialogControls = () => {
  const { openDialog } = useDialogStack();

  const sizes = [
    { key: 'sm', label: 'Small' },
    { key: 'md', label: 'Medium' },
    { key: 'lg', label: 'Large' },
    { key: 'xl', label: 'Extra Large' },
    { key: '2xl', label: '2X Large' },
    { key: 'full', label: 'Full Width' },
  ] as const;

  const openSizedDialog = (size: (typeof sizes)[number]['key']) => {
    openDialog(
      createDialog(
        `${sizes.find((s) => s.key === size)?.label} Dialog`,
        <div className="space-y-4">
          <p>This is a {size} sized dialog.</p>
          <p>Different sizes help accommodate various content types.</p>
          <div className="rounded bg-muted p-4">
            <p className="text-sm">Size: {size}</p>
          </div>
        </div>,
        { size }
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {sizes.map(({ key, label }) => (
          <DialogStackButton
            key={key}
            variant="outline"
            onClick={() => openSizedDialog(key)}
          >
            {label}
          </DialogStackButton>
        ))}
      </div>
    </div>
  );
};

// Maximize dialog controls
const MaximizeDialogControls = () => {
  const { openDialog } = useDialogStack();

  const openMaximizableDialog = () => {
    openDialog(
      createDialog(
        'Maximizable Dialog',
        <div className="space-y-4">
          <p>
            This dialog can be maximized using the maximize button in the
            header.
          </p>
          <p>When maximized, it will take up most of the screen space.</p>
          <div className="rounded bg-muted p-4">
            <h4 className="mb-2 font-medium">Features:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Click maximize button to expand</li>
              <li>• Click minimize button to restore</li>
              <li>• Maintains content and functionality</li>
            </ul>
          </div>
        </div>,
        { maximizable: true }
      )
    );
  };

  const openNonMaximizableDialog = () => {
    openDialog(
      createDialog(
        'Fixed Size Dialog',
        <div className="space-y-4">
          <p>This dialog cannot be maximized.</p>
          <p>The maximize button is hidden for this dialog.</p>
        </div>,
        { maximizable: false }
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <DialogStackButton onClick={openMaximizableDialog}>
          <Settings className="mr-2 h-4 w-4" />
          Maximizable Dialog
        </DialogStackButton>

        <DialogStackButton variant="outline" onClick={openNonMaximizableDialog}>
          Fixed Size Dialog
        </DialogStackButton>
      </div>
    </div>
  );
};

// Non-closable dialog controls
const NonClosableDialogControls = () => {
  const { openDialog, closeAllDialogs } = useDialogStack();

  const openNonClosableDialog = () => {
    openDialog(
      createDialog(
        'Important Notice',
        <div className="space-y-4">
          <p>This dialog cannot be closed with the X button or Escape key.</p>
          <p>Use the "Acknowledge" button below to close it.</p>
          <DialogStackButton
            onClick={() => closeAllDialogs()}
            className="w-full"
          >
            Acknowledge
          </DialogStackButton>
        </div>,
        { closable: false }
      )
    );
  };

  return (
    <div className="space-y-4">
      <DialogStackButton onClick={openNonClosableDialog}>
        <AlertTriangle className="mr-2 h-4 w-4" />
        Open Non-Closable Dialog
      </DialogStackButton>
    </div>
  );
};

// Dialog limit controls
const LimitDialogControls = () => {
  const { openDialog, dialogs } = useDialogStack();

  const openNumberedDialog = () => {
    const number = dialogs.length + 1;
    openDialog(
      createDialog(
        `Dialog #${number}`,
        <div className="space-y-4">
          <p>This is dialog number {number}.</p>
          <p>
            Maximum of 3 dialogs allowed. Oldest will be closed automatically.
          </p>
          <div className="rounded bg-muted p-4 text-sm">
            Current dialogs: {dialogs.length + 1}
          </div>
        </div>
      )
    );
  };

  return (
    <div className="space-y-4">
      <DialogStackButton onClick={openNumberedDialog}>
        <Plus className="mr-2 h-4 w-4" />
        Add Dialog ({dialogs.length}/3)
      </DialogStackButton>

      <div className="text-muted-foreground text-sm">
        Try opening more than 3 dialogs to see the limit in action.
      </div>
    </div>
  );
};

// Complex dialog controls
const ComplexDialogControls = () => {
  const { openDialog } = useDialogStack();

  const openFormDialog = () => {
    openDialog(
      createDialog(
        'User Settings',
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <span className="mb-1 block font-medium text-sm">Name</span>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <span className="mb-1 block font-medium text-sm">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <span className="mb-1 block font-medium text-sm">Bio</span>
              <textarea
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <DialogStackButton variant="outline">Cancel</DialogStackButton>
            <DialogStackButton>Save Changes</DialogStackButton>
          </div>
        </div>,
        { size: 'lg' }
      )
    );
  };

  return (
    <div className="space-y-4">
      <DialogStackButton onClick={openFormDialog}>
        <Settings className="mr-2 h-4 w-4" />
        Open Settings Form
      </DialogStackButton>
    </div>
  );
};

// Notification controls
const NotificationControls = () => {
  const { openDialog } = useDialogStack();

  const showSuccess = () => {
    openDialog(
      createDialog(
        'Success',
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p>Operation completed successfully!</p>
        </div>,
        { size: 'sm', closable: true, maximizable: false }
      )
    );
  };

  const showError = () => {
    openDialog(
      createDialog(
        'Error',
        <div className="flex items-center space-x-3">
          <X className="h-5 w-5 text-red-500" />
          <p>Something went wrong. Please try again.</p>
        </div>,
        { size: 'sm', closable: true, maximizable: false }
      )
    );
  };

  const showInfo = () => {
    openDialog(
      createDialog(
        'Information',
        <div className="flex items-center space-x-3">
          <Info className="h-5 w-5 text-blue-500" />
          <p>Here's some important information for you.</p>
        </div>,
        { size: 'sm', closable: true, maximizable: false }
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <DialogStackButton onClick={showSuccess}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Success
        </DialogStackButton>

        <DialogStackButton variant="destructive" onClick={showError}>
          <X className="mr-2 h-4 w-4" />
          Error
        </DialogStackButton>

        <DialogStackButton variant="outline" onClick={showInfo}>
          <Info className="mr-2 h-4 w-4" />
          Info
        </DialogStackButton>
      </div>
    </div>
  );
};

// Workflow controls
const WorkflowControls = () => {
  const { openDialog } = useDialogStack();

  const startWorkflow = () => {
    // Step 1
    openDialog(
      createDialog(
        'Step 1: Welcome',
        <div className="space-y-4">
          <p>Welcome to the setup wizard!</p>
          <p>This workflow will guide you through the setup process.</p>
          <div className="flex justify-end">
            <DialogStackButton onClick={() => openStep2()}>
              Next: Basic Info
            </DialogStackButton>
          </div>
        </div>,
        { closable: false }
      )
    );
  };

  const openStep2 = () => {
    openDialog(
      createDialog(
        'Step 2: Basic Information',
        <div className="space-y-4">
          <div>
            <span className="mb-1 block font-medium text-sm">Company Name</span>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogStackButton variant="outline">Back</DialogStackButton>
            <DialogStackButton onClick={() => openStep3()}>
              Next: Preferences
            </DialogStackButton>
          </div>
        </div>,
        { closable: false }
      )
    );
  };

  const openStep3 = () => {
    openDialog(
      createDialog(
        'Step 3: Preferences',
        <div className="space-y-4">
          <p>Configure your preferences:</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">Enable notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">Auto-save changes</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <DialogStackButton variant="outline">Back</DialogStackButton>
            <DialogStackButton>Complete Setup</DialogStackButton>
          </div>
        </div>,
        { closable: false }
      )
    );
  };

  return (
    <div className="space-y-4">
      <DialogStackButton onClick={startWorkflow}>
        Start Setup Wizard
      </DialogStackButton>
    </div>
  );
};

// Custom action controls
const CustomActionControls = () => {
  const { openDialog } = useDialogStack();

  const openCustomDialog = () => {
    openDialog({
      title: 'Custom Dialog',
      content: (
        <div className="space-y-4">
          <p>This dialog has custom close and maximize handlers.</p>
          <div className="rounded bg-muted p-4 text-sm">
            <p>Custom behaviors:</p>
            <ul className="mt-2 space-y-1">
              <li>• Close handler executes custom logic</li>
              <li>• Maximize handler shows alert</li>
            </ul>
          </div>
        </div>
      ),
      onClose: () => {
        // Custom close handler called - logged for demo purposes
      },
      onMaximize: (maximized) => {
        alert(`Dialog ${maximized ? 'maximized' : 'restored'}`);
      },
    });
  };

  return (
    <div className="space-y-4">
      <DialogStackButton onClick={openCustomDialog}>
        Open Custom Dialog
      </DialogStackButton>

      <div className="text-muted-foreground text-sm">
        Check browser console for close events.
      </div>
    </div>
  );
};

/**
 * Using the dialog stack context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="p-8">
      <DialogStack>
        <ContextInfo />
        <DialogControls />
      </DialogStack>
    </div>
  ),
};

// Context info component
const ContextInfo = () => {
  const { dialogs, getTopDialog } = useDialogStack();
  const topDialog = getTopDialog();

  return (
    <div className="mb-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Total Dialogs:</span>
          <div>{dialogs.length}</div>
        </div>
        <div>
          <span className="font-medium">Top Dialog:</span>
          <div>{topDialog?.title || 'None'}</div>
        </div>
      </div>
      {dialogs.length > 0 && (
        <div className="mt-2">
          <span className="font-medium">Dialog Stack:</span>
          <div className="mt-1 space-y-1">
            {dialogs.map((dialog, index) => (
              <div key={dialog.id} className="text-xs">
                {index + 1}. {dialog.title} (z: {dialog.zIndex})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

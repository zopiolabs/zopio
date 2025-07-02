/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import type React from 'react';
import type { ReactNode } from 'react';

// Mock components for design system - replace with actual imports when available
const Button = ({
  children,
  variant,
  size,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  variant?: string;
  size?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    disabled={disabled}
    className={className}
  >
    {children}
  </button>
);

const DropdownMenu = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const DropdownMenuTrigger = ({
  asChild,
  children,
}: { asChild?: boolean; children: ReactNode }) => <div>{children}</div>;
const DropdownMenuContent = ({
  align,
  children,
}: { align?: string; children: ReactNode }) => <div>{children}</div>;
const DropdownMenuItem = ({
  onClick,
  disabled,
  className,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    disabled={disabled}
    className={className}
  >
    {children}
  </button>
);

const Tooltip = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const TooltipTrigger = ({
  asChild,
  children,
}: { asChild?: boolean; children: ReactNode }) => <div>{children}</div>;
const TooltipContent = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);

// Mock icons - replace with actual imports when available
const MoreHorizontal = ({ className }: { className?: string }) => (
  <span className={className}>•••</span>
);
const Eye = ({ className }: { className?: string }) => (
  <span className={className}>👁️</span>
);
const Edit = ({ className }: { className?: string }) => (
  <span className={className}>✏️</span>
);
const Trash = ({ className }: { className?: string }) => (
  <span className={className}>🗑️</span>
);
const Copy = ({ className }: { className?: string }) => (
  <span className={className}>📋</span>
);
const Download = ({ className }: { className?: string }) => (
  <span className={className}>⬇️</span>
);
const Upload = ({ className }: { className?: string }) => (
  <span className={className}>⬆️</span>
);

import { useCrudTranslation } from '../i18n';
import type { FieldValue } from './types';

export interface Action {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * Label for the action
   */
  label: string;

  /**
   * Icon component for the action
   */
  icon?: React.ReactNode;

  /**
   * Tooltip text for the action
   */
  tooltip?: string;

  /**
   * Action handler function
   */
  onClick: (data: Record<string, FieldValue>) => void;

  /**
   * Whether the action is disabled
   */
  disabled?: boolean | ((data: Record<string, FieldValue>) => boolean);

  /**
   * Whether the action is hidden
   */
  hidden?: boolean | ((data: Record<string, FieldValue>) => boolean);

  /**
   * CSS class for the action
   */
  className?: string;

  /**
   * Button variant
   */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether the action requires confirmation
   */
  requireConfirmation?: boolean;

  /**
   * Confirmation message
   */
  confirmationMessage?: string;

  /**
   * Additional props for the action
   */
  [key: string]: unknown;
}

export interface AutoActionsProps {
  /**
   * Data for the current record
   */
  data: Record<string, FieldValue>;

  /**
   * List of available actions
   */
  actions: Action[];

  /**
   * Maximum number of visible actions before overflow
   */
  maxVisibleActions?: number;

  /**
   * Whether to show labels for visible actions
   */
  showLabels?: boolean;

  /**
   * Whether to show icons for actions
   */
  showIcons?: boolean;

  /**
   * Alignment of the actions
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Direction of the actions
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * CSS class for the container
   */
  className?: string;

  /**
   * CSS class for each action button
   */
  actionClassName?: string;
}

/**
 * AutoActions renders a set of action buttons for CRUD operations.
 * Supports visible buttons with overflow in dropdown menu.
 */
export function AutoActions({
  data,
  actions,
  maxVisibleActions = 3,
  showLabels = false,
  showIcons = true,
  align = 'end',
  direction = 'horizontal',
  className = '',
  actionClassName = '',
}: AutoActionsProps) {
  const { t } = useCrudTranslation();

  // Filter out hidden actions
  const visibleActions = actions.filter((action) => {
    if (typeof action.hidden === 'function') {
      return !action.hidden(data);
    }
    return !action.hidden;
  });

  // Determine which actions to show directly and which to put in dropdown
  const primaryActions = visibleActions.slice(0, maxVisibleActions);
  const overflowActions = visibleActions.slice(maxVisibleActions);

  // Check if an action is disabled
  const isDisabled = (action: Action): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(data);
    }
    return !!action.disabled;
  };

  // Handle action click with optional confirmation
  const handleActionClick = (action: Action) => {
    if (action.requireConfirmation) {
      if (
        window.confirm(
          action.confirmationMessage || t('actions.confirmationDefault')
        )
      ) {
        action.onClick(data);
      }
    } else {
      action.onClick(data);
    }
  };

  // Render a single action button
  const renderActionButton = (action: Action) => {
    const button = (
      <Button
        key={action.id}
        variant={action.variant || 'outline'}
        size={action.size || 'sm'}
        onClick={() => handleActionClick(action)}
        disabled={isDisabled(action)}
        className={`${actionClassName} ${action.className || ''}`}
      >
        {showIcons && action.icon && (
          <span className={showLabels ? 'mr-2' : ''}>{action.icon}</span>
        )}
        {showLabels && action.label}
      </Button>
    );

    if (action.tooltip) {
      return (
        <Tooltip key={action.id}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{action.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  // Default icons for common actions
  const getDefaultIcon = (actionId: string): ReactNode | null => {
    switch (actionId) {
      case 'view':
        return <Eye className="mr-2 h-4 w-4" />;
      case 'edit':
        return <Edit className="mr-2 h-4 w-4" />;
      case 'delete':
        return <Trash className="mr-2 h-4 w-4" />;
      case 'duplicate':
        return <Copy className="mr-2 h-4 w-4" />;
      case 'export':
        return <Download className="mr-2 h-4 w-4" />;
      case 'import':
        return <Upload className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  // Add default icons if not provided
  const actionsWithIcons = visibleActions.map((action) => ({
    ...action,
    icon: action.icon || getDefaultIcon(action.id),
  }));

  return (
    <div
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${
        align === 'center'
          ? 'justify-center'
          : align === 'end'
            ? 'justify-end'
            : 'justify-start'
      } gap-2 ${className}`}
    >
      {primaryActions.map((action) =>
        renderActionButton({
          ...action,
          icon: action.icon || getDefaultIcon(action.id),
        })
      )}

      {overflowActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              {showLabels && <span className="ml-2">{t('actions.more')}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflowActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() =>
                  handleActionClick({
                    ...action,
                    icon: action.icon || getDefaultIcon(action.id),
                  })
                }
                disabled={isDisabled(action)}
                className={action.className}
              >
                {action.icon || getDefaultIcon(action.id)}
                <span className="ml-2">{action.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

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
import type * as React from 'react';
import { type ReactNode, useState } from 'react';

// Mock components for design system - replace with actual imports when available
const Card = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
const CardContent = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const CardHeader = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const CardTitle = ({ children }: { children: ReactNode }) => (
  <h2>{children}</h2>
);
const CardDescription = ({ children }: { children: ReactNode }) => (
  <p>{children}</p>
);

const Table = ({ children }: { children: ReactNode }) => (
  <table>{children}</table>
);
const TableHeader = ({ children }: { children: ReactNode }) => (
  <thead>{children}</thead>
);
const TableBody = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);
const TableRow = ({ children }: { children: ReactNode }) => <tr>{children}</tr>;
const TableHead = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => (
  <th className={className}>{children}</th>
);
const TableCell = ({
  children,
  className,
  colSpan,
}: { children: ReactNode; className?: string; colSpan?: number }) => (
  <td className={className} colSpan={colSpan}>
    {children}
  </td>
);

const Select = ({
  children,
  value,
  onValueChange,
  id,
}: {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  id?: string;
}) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
  >
    {children}
  </select>
);
const SelectTrigger = ({
  children,
  className,
  id,
}: { children: ReactNode; className?: string; id?: string }) => (
  <div className={className} id={id}>
    {children}
  </div>
);
const SelectValue = ({
  children,
  placeholder,
}: { children?: ReactNode; placeholder?: string }) => (
  <span>{children || placeholder}</span>
);
const SelectContent = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const SelectItem = ({
  children,
  value,
}: { children: ReactNode; value: string }) => (
  <option value={value}>{children}</option>
);

const Popover = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);
const PopoverTrigger = ({
  children,
  asChild,
}: { children: ReactNode; asChild?: boolean }) => <div>{children}</div>;
const PopoverContent = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const Button = ({
  children,
  variant,
  size,
  onClick,
  disabled,
  className,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  variant?: string;
  size?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={className}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const Badge = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => (
  <span className={className}>{children}</span>
);

const Calendar = ({
  mode,
  selected,
  onSelect,
  initialFocus,
  id,
}: {
  mode?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  initialFocus?: boolean;
  id?: string;
}) => (
  <div>
    <input
      type="date"
      value={selected?.toISOString().split('T')[0] || ''}
      onChange={(e) =>
        onSelect?.(e.target.value ? new Date(e.target.value) : undefined)
      }
      id={id}
    />
  </div>
);

const Input = ({
  placeholder,
  value,
  onChange,
  className,
  id,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
    id={id}
  />
);

// Mock icons - replace with actual imports when available
const ChevronLeft = ({ className }: { className?: string }) => (
  <span className={className}>←</span>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <span className={className}>→</span>
);
const CalendarIcon = ({ className }: { className?: string }) => (
  <span className={className}>📅</span>
);
const Filter = ({ className }: { className?: string }) => (
  <span className={className}>🔍</span>
);
const Search = ({ className }: { className?: string }) => (
  <span className={className}>🔎</span>
);
const Eye = ({ className }: { className?: string }) => (
  <span className={className}>👁️</span>
);
const ArrowUpDown = ({ className }: { className?: string }) => (
  <span className={className}>↕️</span>
);

import { useCrudTranslation } from '../i18n';
import type { FieldValue } from './types';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'import'
  | 'login'
  | 'logout'
  | string;

export interface AuditLogEntry {
  /**
   * Unique identifier for the audit log entry
   */
  id: string | number;

  /**
   * Timestamp of the action
   */
  timestamp: string | Date;

  /**
   * User who performed the action
   */
  user: {
    id: string | number;
    name: string;
    email?: string;
    avatar?: string;
  };

  /**
   * Type of action performed
   */
  action: AuditAction;

  /**
   * Entity type that was affected
   */
  entityType: string;

  /**
   * Entity ID that was affected
   */
  entityId?: string | number;

  /**
   * Changes made (for update actions)
   */
  changes?: {
    field: string;
    oldValue?: FieldValue;
    newValue?: FieldValue;
  }[];

  /**
   * IP address of the user
   */
  ipAddress?: string;

  /**
   * User agent of the browser/client
   */
  userAgent?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

export interface AuditLogFilter {
  /**
   * Start date for filtering
   */
  startDate?: Date;

  /**
   * End date for filtering
   */
  endDate?: Date;

  /**
   * User IDs to filter by
   */
  users?: (string | number)[];

  /**
   * Actions to filter by
   */
  actions?: AuditAction[];

  /**
   * Entity types to filter by
   */
  entityTypes?: string[];

  /**
   * Entity IDs to filter by
   */
  entityIds?: (string | number)[];

  /**
   * Search query
   */
  search?: string;
}

export interface AutoAuditLogViewProps {
  /**
   * Audit log entries to display
   */
  entries: AuditLogEntry[];

  /**
   * Total number of entries (for pagination)
   */
  total: number;

  /**
   * Current page
   */
  page: number;

  /**
   * Number of entries per page
   */
  pageSize: number;

  /**
   * Function to handle page change
   */
  onPageChange: (page: number) => void;

  /**
   * Function to handle page size change
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Current filters
   */
  filters?: AuditLogFilter;

  /**
   * Function to handle filter change
   */
  onFilterChange?: (filters: AuditLogFilter) => void;

  /**
   * Available actions for filtering
   */
  availableActions?: AuditAction[];

  /**
   * Available entity types for filtering
   */
  availableEntityTypes?: string[];

  /**
   * Available users for filtering
   */
  availableUsers?: { id: string | number; name: string }[];

  /**
   * Function to handle viewing details of an entry
   */
  onViewDetails?: (entry: AuditLogEntry) => void;

  /**
   * Whether the component is loading
   */
  isLoading?: boolean;

  /**
   * Title for the audit log view
   */
  title?: string;

  /**
   * Description for the audit log view
   */
  description?: string;

  /**
   * Whether to show the card wrapper
   */
  showCard?: boolean;

  /**
   * Whether to show filters
   */
  showFilters?: boolean;

  /**
   * CSS class for the component
   */
  className?: string;

  /**
   * Locale for date formatting
   */
  locale?: string;
}

/**
 * AutoAuditLogView displays a table of audit log entries with filtering and pagination.
 * Shows who did what, when, and to which entity.
 */
export function AutoAuditLogView({
  entries,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  filters = {},
  onFilterChange,
  availableActions = [
    'create',
    'update',
    'delete',
    'view',
    'export',
    'import',
    'login',
    'logout',
  ],
  availableEntityTypes = [],
  availableUsers = [],
  onViewDetails,
  isLoading = false,
  title,
  description,
  showCard = true,
  showFilters = true,
  className = '',
  locale,
}: AutoAuditLogViewProps) {
  const { t } = useCrudTranslation();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [localFilters, setLocalFilters] = useState<AuditLogFilter>(filters);

  // Format date for display
  const formatDate = (date: Date | string): string => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get action label and color
  const getActionInfo = (
    action: AuditAction
  ): { label: string; color: string } => {
    const actionMap: Record<string, { label: string; color: string }> = {
      create: {
        label: t('auditLog.actions.create', { defaultValue: 'Create' }),
        color: 'bg-green-100 text-green-800',
      },
      update: {
        label: t('auditLog.actions.update', { defaultValue: 'Update' }),
        color: 'bg-blue-100 text-blue-800',
      },
      delete: {
        label: t('auditLog.actions.delete', { defaultValue: 'Delete' }),
        color: 'bg-red-100 text-red-800',
      },
      view: {
        label: t('auditLog.actions.view', { defaultValue: 'View' }),
        color: 'bg-gray-100 text-gray-800',
      },
      export: {
        label: t('auditLog.actions.export', { defaultValue: 'Export' }),
        color: 'bg-purple-100 text-purple-800',
      },
      import: {
        label: t('auditLog.actions.import', { defaultValue: 'Import' }),
        color: 'bg-indigo-100 text-indigo-800',
      },
      login: {
        label: t('auditLog.actions.login', { defaultValue: 'Login' }),
        color: 'bg-yellow-100 text-yellow-800',
      },
      logout: {
        label: t('auditLog.actions.logout', { defaultValue: 'Logout' }),
        color: 'bg-orange-100 text-orange-800',
      },
    };

    return (
      actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-800' }
    );
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
    setShowFilterPanel(false);
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    setShowFilterPanel(false);
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Render filter panel
  const renderFilterPanel = () => {
    if (!showFilterPanel) return null;

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            {t('auditLog.filters.title', { defaultValue: 'Filter Audit Logs' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Date range filter */}
            <div>
              <label
                htmlFor="start-date"
                className="mb-1 block font-medium text-sm"
              >
                {t('auditLog.filters.dateRange')}
              </label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.startDate ? (
                        formatDate(localFilters.startDate).split(',')[0]
                      ) : (
                        <span>{t('auditLog.filters.startDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.startDate}
                      onSelect={(date) =>
                        setLocalFilters({
                          ...localFilters,
                          startDate: date || undefined,
                        })
                      }
                      initialFocus
                      id="start-date"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.endDate ? (
                        formatDate(localFilters.endDate).split(',')[0]
                      ) : (
                        <span>{t('auditLog.filters.endDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.endDate}
                      onSelect={(date) =>
                        setLocalFilters({
                          ...localFilters,
                          endDate: date || undefined,
                        })
                      }
                      initialFocus
                      id="end-date"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Actions filter */}
            <div>
              <label
                htmlFor="action-filter"
                className="mb-1 block font-medium text-sm"
              >
                {t('auditLog.filters.actions')}
              </label>
              <Select
                value={
                  localFilters.actions?.length === 1
                    ? localFilters.actions[0]
                    : ''
                }
                onValueChange={(value: AuditAction) =>
                  setLocalFilters({
                    ...localFilters,
                    actions: value ? [value] : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('auditLog.filters.selectAction')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {t('auditLog.filters.allActions')}
                  </SelectItem>
                  {availableActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {getActionInfo(action).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entity types filter */}
            {availableEntityTypes.length > 0 && (
              <div>
                <label
                  htmlFor="entity-type-filter"
                  className="mb-1 block font-medium text-sm"
                >
                  {t('auditLog.filters.entityTypes')}
                </label>
                <Select
                  id="entity-type-filter"
                  value={
                    localFilters.entityTypes?.length === 1
                      ? localFilters.entityTypes[0]
                      : ''
                  }
                  onValueChange={(value: string) =>
                    setLocalFilters({
                      ...localFilters,
                      entityTypes: value ? [value] : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('auditLog.filters.selectEntityType')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('auditLog.filters.allEntityTypes')}
                    </SelectItem>
                    {availableEntityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`entities.${type}`, { defaultValue: type })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Users filter */}
            {availableUsers.length > 0 && (
              <div>
                <label
                  htmlFor="user-filter"
                  className="mb-1 block font-medium text-sm"
                >
                  {t('auditLog.filters.users')}
                </label>
                <Select
                  id="user-filter"
                  value={
                    localFilters.users?.length === 1
                      ? String(localFilters.users[0])
                      : ''
                  }
                  onValueChange={(value: string) =>
                    setLocalFilters({
                      ...localFilters,
                      users: value ? [value] : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('auditLog.filters.selectUser')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('auditLog.filters.allUsers')}
                    </SelectItem>
                    {availableUsers.map((user) => (
                      <SelectItem key={String(user.id)} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Search filter */}
            <div>
              <label
                htmlFor="search-filter"
                className="mb-1 block font-medium text-sm"
              >
                {t('auditLog.filters.search')}
              </label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-500" />
                <Input
                  id="search-filter"
                  placeholder={t('auditLog.filters.searchPlaceholder')}
                  value={localFilters.search || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      search: e.target.value || undefined,
                    })
                  }
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={resetFilters}>
              {t('auditLog.filters.reset')}
            </Button>
            <Button onClick={applyFilters}>
              {t('auditLog.filters.apply')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render content
  const content = (
    <div className={className}>
      {showFilters && (
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {t('auditLog.filters.toggle', { defaultValue: 'Filters' })}
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">
              {t('auditLog.showing', {
                start: Math.min((page - 1) * pageSize + 1, total),
                end: Math.min(page * pageSize, total),
                total,
              })}
            </span>

            {onPageSizeChange && (
              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {showFilters && renderFilterPanel()}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <div className="flex items-center">
                  {t('auditLog.columns.timestamp')}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                {t('auditLog.columns.user')}
              </TableHead>
              <TableHead className="w-[100px]">
                {t('auditLog.columns.action')}
              </TableHead>
              <TableHead>{t('auditLog.columns.entity')}</TableHead>
              <TableHead className="w-[100px] text-right">
                {t('auditLog.columns.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('auditLog.loading')}
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('auditLog.noEntries')}
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const actionInfo = getActionInfo(entry.action);

                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {formatDate(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {entry.user.avatar && (
                          <img
                            src={entry.user.avatar}
                            alt={entry.user.name}
                            className="mr-2 h-6 w-6 rounded-full"
                          />
                        )}
                        <span>{entry.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionInfo.color}>
                        {actionInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {t(`entities.${entry.entityType}`, {
                            defaultValue: entry.entityType,
                          })}
                        </span>
                        {entry.entityId && (
                          <span className="ml-1 text-gray-500">
                            #{entry.entityId}
                          </span>
                        )}
                      </div>
                      {entry.changes && entry.changes.length > 0 && (
                        <div className="mt-1 text-gray-500 text-xs">
                          {entry.changes.length} {t('auditLog.fieldsChanged')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {onViewDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('auditLog.pagination.previous')}
          </Button>

          <span className="text-gray-500 text-sm">
            {t('auditLog.pagination.pageInfo', {
              current: page,
              total: totalPages,
            })}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            {t('auditLog.pagination.next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  // Wrap in card if requested
  if (showCard) {
    return (
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

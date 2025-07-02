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
import { useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type {
  AutoTableProps,
  FieldValue,
  TableColumn,
  TableFilter,
} from '../types';

/**
 * AutoTable renders a table from column definitions and row data.
 * Supports pagination, sorting, filtering, and row selection.
 */
export function AutoTable({
  columns,
  data,
  rowActions,
  bulkActions,
  pagination,
  sorting,
  filters = [],
  onFilterChange,
  isLoading = false,
  emptyState,
  selectable = false,
  onSelectionChange,
  rowKey = 'id',
  className = '',
}: AutoTableProps) {
  const { t } = useCrudTranslation();
  const [selectedRows, setSelectedRows] = useState<
    Record<string, FieldValue>[]
  >([]);
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>(filters);
  const [filterOpen, setFilterOpen] = useState(false);

  // Handle row selection
  const handleRowSelect = (
    row: Record<string, FieldValue>,
    checked: boolean
  ) => {
    const newSelectedRows = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r[rowKey] !== row[rowKey]);

    setSelectedRows(newSelectedRows);
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  // Handle select all rows
  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = checked ? [...data] : [];
    setSelectedRows(newSelectedRows);
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  // Check if a row is selected
  const isRowSelected = (row: Record<string, FieldValue>) => {
    return selectedRows.some((r) => r[rowKey] === row[rowKey]);
  };

  // Handle column sort
  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !sorting) return;

    const newDirection =
      sorting.column === column.key && sorting.direction === 'asc'
        ? 'desc'
        : 'asc';

    sorting.onSort(column.key, newDirection);
  };

  // Apply a filter
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(activeFilters);
      setFilterOpen(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    if (onFilterChange) {
      onFilterChange([]);
      setFilterOpen(false);
    }
  };

  // Render filter panel
  const renderFilterPanel = () => {
    if (!filterOpen) return null;

    return (
      <div className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-md">
        <h3 className="mb-3 font-medium text-lg">{t('table.filters.title')}</h3>

        {/* Filter controls would go here */}
        <div className="space-y-4">
          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.key} className="flex items-center space-x-2">
                <label htmlFor={`filter-${col.key}`} className="w-1/4">
                  {col.title}
                </label>
                <select
                  className="w-1/4 rounded-md border px-2 py-1"
                  id={`filter-${col.key}-operator`}
                  value={
                    activeFilters.find((f) => f.column === col.key)?.operator ||
                    'eq'
                  }
                  onChange={(e) => {
                    const existing = activeFilters.find(
                      (f) => f.column === col.key
                    );
                    const newOperator = e.target
                      .value as TableFilter['operator'];
                    if (existing) {
                      setActiveFilters(
                        activeFilters.map((f) =>
                          f.column === col.key
                            ? { ...f, operator: newOperator }
                            : f
                        )
                      );
                    } else {
                      setActiveFilters([
                        ...activeFilters,
                        { column: col.key, operator: newOperator, value: '' },
                      ]);
                    }
                  }}
                >
                  <option value="eq">
                    {t('table.filters.operators.equals')}
                  </option>
                  <option value="contains">
                    {t('table.filters.operators.contains')}
                  </option>
                  <option value="gt">
                    {t('table.filters.operators.greaterThan')}
                  </option>
                  <option value="lt">
                    {t('table.filters.operators.lessThan')}
                  </option>
                </select>

                <input
                  type="text"
                  id={`filter-${col.key}`}
                  className="w-2/4 rounded-md border px-2 py-1"
                  value={
                    typeof activeFilters.find((f) => f.column === col.key)
                      ?.value === 'string'
                      ? (activeFilters.find((f) => f.column === col.key)
                          ?.value as string)
                      : ''
                  }
                  onChange={(e) => {
                    const existing = activeFilters.find(
                      (f) => f.column === col.key
                    );
                    if (existing) {
                      setActiveFilters(
                        activeFilters.map((f) =>
                          f.column === col.key
                            ? { ...f, value: e.target.value }
                            : f
                        )
                      );
                    } else {
                      setActiveFilters([
                        ...activeFilters,
                        {
                          column: col.key,
                          operator: 'eq',
                          value: e.target.value,
                        },
                      ]);
                    }
                  }}
                  placeholder={t('table.filters.value')}
                  aria-labelledby={`filter-${col.key}-label`}
                />
              </div>
            ))}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            onClick={clearFilters}
          >
            {t('table.filters.clear')}
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1 text-sm text-white"
            onClick={applyFilters}
          >
            {t('table.filters.apply')}
          </button>
        </div>
      </div>
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;

    const { page, pageSize, total, onPageChange, onPageSizeChange } =
      pagination;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
      <div className="mt-4 flex flex-col items-center justify-between text-sm sm:flex-row">
        <div className="mb-2 sm:mb-0">
          {t('table.pagination.showing', { start, end, total })}
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="page-size" className="mr-2">
              {t('table.pagination.rowsPerPage')}
            </label>
            <select
              id="page-size"
              className="rounded-md border px-2 py-1"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label={t('table.pagination.previous')}
            >
              &larr;
            </button>

            <span className="px-2">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label={t('table.pagination.next')}
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render table toolbar
  const renderToolbar = () => {
    const hasFilterableColumns = columns.some((col) => col.filterable);

    return (
      <div className="mb-4 flex items-center justify-between">
        {/* Bulk actions */}
        {selectable && selectedRows.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              {t('table.selected', { count: selectedRows.length })}
            </span>
            {bulkActions}
          </div>
        )}

        {/* Filter toggle */}
        {hasFilterableColumns && onFilterChange && (
          <button
            type="button"
            className="flex items-center rounded-md border border-gray-300 px-3 py-1 text-sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
              <title>Filter</title>
            </svg>
            {t('table.filters.title')}
            {activeFilters.length > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs">
                {activeFilters.length}
              </span>
            )}
          </button>
        )}
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (data.length > 0 || isLoading) return null;

    return (
      <div className="rounded-md bg-gray-50 py-8 text-center">
        {emptyState || (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-3 h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
              <title>No data</title>
            </svg>
            <p className="text-gray-500">{t('table.noData')}</p>
          </>
        )}
      </div>
    );
  };

  // Render loading state
  const renderLoadingState = () => {
    if (!isLoading) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
        <div className="flex items-center">
          <svg
            className="mr-2 h-5 w-5 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
            <title>Loading</title>
          </svg>
          <span>{t('table.loading')}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {renderToolbar()}
      {renderFilterPanel()}

      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label={t('table.selectAll')}
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col)}
                  onKeyDown={(e) => {
                    if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(col);
                    }
                  }}
                  tabIndex={col.sortable ? 0 : undefined}
                  role={col.sortable ? 'button' : undefined}
                  style={{ width: col.width }}
                  aria-sort={
                    sorting?.column === col.key
                      ? sorting.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    <span className={col.align === 'right' ? 'ml-auto' : ''}>
                      {col.title}
                    </span>

                    {col.sortable && sorting && (
                      <span className="ml-1">
                        {sorting.column === col.key ? (
                          sorting.direction === 'asc' ? (
                            '↑'
                          ) : (
                            '↓'
                          )
                        ) : (
                          <span className="text-gray-300">↕</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {rowActions && (
                <th className="px-4 py-3 text-right">
                  {t('table.actions.title')}
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, idx) => (
              <tr
                key={row[rowKey]?.toString() || idx}
                className="hover:bg-gray-50"
                aria-selected={isRowSelected(row)}
              >
                {selectable && (
                  <td className="whitespace-nowrap px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={isRowSelected(row)}
                      onChange={(e) => handleRowSelect(row, e.target.checked)}
                      aria-label={t('table.selectRow')}
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] || '')}
                  </td>
                ))}

                {rowActions && (
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderEmptyState()}
      {renderLoadingState()}
      {renderPagination()}
    </div>
  );
}

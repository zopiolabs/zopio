/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import type React from 'react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/ui/table';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
];

/**
 * Powerful table and datagrids built using TanStack Table.
 */
const meta: Meta<typeof Table> = {
  title: 'ui/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the table.
 */
export const Default: Story = {};

/**
 * A draggable table where rows can be reordered by drag and drop.
 */
export const Draggable: Story = {
  render: () => {
    const [items, setItems] = useState(invoices);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => (e: React.DragEvent) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverIndex(index);
    };

    const handleDragLeave = () => {
      setDragOverIndex(null);
    };

    const handleDrop = (dropIndex: number) => (e: React.DragEvent) => {
      e.preventDefault();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];

      // Remove the dragged item
      newItems.splice(draggedIndex, 1);

      // Insert at the new position
      const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
      newItems.splice(insertIndex, 0, draggedItem);

      setItems(newItems);
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    const handleDragEnd = () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Drag and drop rows to reorder them.
        </p>
        <Table>
          <TableCaption>
            A list of your recent invoices (draggable).
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((invoice, index) => (
              <TableRow
                key={invoice.invoice}
                draggable
                isDragOver={dragOverIndex === index}
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver(index)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

/**
 * A table with selective draggable rows.
 */
export const SelectiveDraggable: Story = {
  render: () => {
    const [items, setItems] = useState(invoices);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => (e: React.DragEvent) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverIndex(index);
    };

    const handleDragLeave = () => {
      setDragOverIndex(null);
    };

    const handleDrop = (dropIndex: number) => (e: React.DragEvent) => {
      e.preventDefault();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];

      newItems.splice(draggedIndex, 1);
      const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
      newItems.splice(insertIndex, 0, draggedItem);

      setItems(newItems);
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    const handleDragEnd = () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Only paid invoices can be dragged and reordered.
        </p>
        <Table>
          <TableCaption>
            A list of your recent invoices (selective draggable).
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((invoice, index) => {
              const isDraggable = invoice.paymentStatus === 'Paid';
              return (
                <TableRow
                  key={invoice.invoice}
                  draggable={isDraggable}
                  isDragOver={dragOverIndex === index}
                  onDragStart={isDraggable ? handleDragStart(index) : undefined}
                  onDragOver={isDraggable ? handleDragOver(index) : undefined}
                  onDragLeave={isDraggable ? handleDragLeave : undefined}
                  onDrop={isDraggable ? handleDrop(index) : undefined}
                  onDragEnd={isDraggable ? handleDragEnd : undefined}
                  className={isDraggable ? '' : 'opacity-60'}
                >
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  },
};

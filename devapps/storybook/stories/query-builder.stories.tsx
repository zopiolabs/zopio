/**
 * SPDX-License-Identifier: MIT
 */

import { QueryBuilder } from '@repo/design-system/ui/query-builder-v0';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof QueryBuilder> = {
  title: 'ui/QueryBuilder',
  component: QueryBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible query builder component that supports various field types, operators, and grouping functionality.',
      },
    },
  },
  argTypes: {
    initialLogicalOperator: {
      control: { type: 'select' },
      options: ['AND', 'OR'],
      description: 'Initial logical operator for the query',
    },
    initialIsNot: {
      control: { type: 'boolean' },
      description: 'Initial state of the NOT toggle',
    },
    selectOptions: {
      control: { type: 'object' },
      description: 'Options for select field types',
    },
    multiselectOptions: {
      control: { type: 'object' },
      description: 'Options for multiselect field types',
    },
    fieldOptions: {
      control: { type: 'object' },
      description: 'Options for field comparison types',
    },
    onQueryChange: {
      action: 'queryChanged',
      description: 'Callback fired when query changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  args: {},
};

export const Empty: Story = {
  args: {
    initialItems: [],
  },
};

export const WithPrefilledData: Story = {
  args: {
    initialItems: [
      { id: '1', fieldType: 'text', operator: '=', value: 'John Doe' },
      { id: '2', fieldType: 'select', operator: '=', value: 'Option 2' },
      { id: '3', fieldType: 'checkbox', operator: '=', value: true },
      { id: '4', fieldType: 'date', operator: '=', value: '2024-01-15' },
    ],
    initialLogicalOperator: 'OR',
    initialIsNot: true,
  },
};

export const WithGroups: Story = {
  args: {
    initialItems: [
      { id: '1', fieldType: 'text', operator: '=', value: 'Search term' },
      {
        id: '2',
        type: 'group',
        logicalOperator: 'OR',
        isNot: false,
        children: [
          { id: '3', fieldType: 'select', operator: '=', value: 'Option 1' },
          {
            id: '4',
            fieldType: 'text',
            operator: 'contains',
            value: 'keyword',
          },
        ],
      },
      { id: '5', fieldType: 'checkbox', operator: '=', value: true },
    ],
  },
};

export const AllFieldTypes: Story = {
  args: {
    initialItems: [
      { id: '1', fieldType: 'text', operator: '=', value: 'Sample text' },
      { id: '2', fieldType: 'select', operator: '=', value: 'Option 2' },
      { id: '3', fieldType: 'checkbox', operator: '=', value: true },
      { id: '4', fieldType: 'radio', operator: '=', value: 'Option A' },
      {
        id: '5',
        fieldType: 'textarea',
        operator: '=',
        value: 'Multi-line\ntext content',
      },
      {
        id: '6',
        fieldType: 'multiselect',
        operator: 'in',
        value: ['option1', 'option3'],
      },
      { id: '7', fieldType: 'date', operator: '=', value: '2024-01-15' },
      {
        id: '8',
        fieldType: 'datetime',
        operator: '=',
        value: '2024-01-15T10:30',
      },
      { id: '9', fieldType: 'time', operator: '=', value: '14:30' },
      {
        id: '10',
        fieldType: 'field',
        operator: '=',
        value: { field: 'name', comparison: 'text' },
      },
    ],
  },
};

export const BetweenOperators: Story = {
  args: {
    initialItems: [
      {
        id: '1',
        fieldType: 'text',
        operator: 'between',
        value: { from: 'A', to: 'Z' },
      },
      {
        id: '2',
        fieldType: 'select',
        operator: 'between',
        value: { from: 'Option 1', to: 'Option 3' },
      },
      {
        id: '3',
        fieldType: 'date',
        operator: 'between',
        value: { from: '2024-01-01', to: '2024-12-31' },
      },
    ],
  },
};

export const CustomOptions: Story = {
  args: {
    selectOptions: ['Red', 'Green', 'Blue', 'Yellow', 'Purple'],
    multiselectOptions: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    fieldOptions: ['name', 'email', 'phone', 'address', 'company'],
    initialItems: [
      { id: '1', fieldType: 'select', operator: '=', value: 'Red' },
      {
        id: '2',
        fieldType: 'multiselect',
        operator: 'in',
        value: ['tag1', 'tag3'],
      },
      {
        id: '3',
        fieldType: 'field',
        operator: '=',
        value: { field: 'email', comparison: 'text' },
      },
    ],
  },
};

export const ComplexQuery: Story = {
  args: {
    initialLogicalOperator: 'AND',
    initialIsNot: false,
    initialItems: [
      { id: '1', fieldType: 'text', operator: 'contains', value: 'important' },
      {
        id: '2',
        type: 'group',
        logicalOperator: 'OR',
        isNot: false,
        children: [
          { id: '3', fieldType: 'select', operator: '=', value: 'Option 1' },
          { id: '4', fieldType: 'select', operator: '=', value: 'Option 3' },
        ],
      },
      {
        id: '5',
        type: 'group',
        logicalOperator: 'AND',
        isNot: true,
        children: [
          { id: '6', fieldType: 'checkbox', operator: '=', value: false },
          { id: '7', fieldType: 'date', operator: '>', value: '2024-01-01' },
        ],
      },
      {
        id: '8',
        fieldType: 'multiselect',
        operator: 'in',
        value: ['option1', 'option2'],
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    onQueryChange: (_items, _logicalOperator, _isNot) => {
      // Parameters intentionally unused in this story
    },
  },
};

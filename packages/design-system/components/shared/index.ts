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
/**
 * Shared Components
 *
 * This file exports all shared components that can be used across both
 * crud/ui and view-builder modules for consistent styling and behavior.
 */

export { FormField, type FormFieldProps } from './FormField';
export {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from './SelectField';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from './Card';

// Utility function for class name merging
export const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

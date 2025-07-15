/**
 * SPDX-License-Identifier: MIT
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

/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared Components
 *
 * This file exports all shared components that can be used across both
 * crud/ui and view-builder modules for consistent styling and behavior.
 */

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from "./Card";
export { FormField, type FormFieldProps } from "./FormField";
export {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from "./SelectField";

// Utility function for class name merging
export const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

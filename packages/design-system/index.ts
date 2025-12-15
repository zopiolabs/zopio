/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Main entry point for the design system
 *
 * This file re-exports all components, utilities, and providers
 * from the design system package in a clean and organized way.
 */

export * from "./lib/fonts";

// Re-export utility functions and libraries
export * from "./lib/utils";
// Re-export all providers
export * from "./providers";
// Re-export all UI components
export * from "./ui";

// Re-export colors as a namespace to avoid naming conflicts
import * as colorExports from "./lib/colors";
export const colors = colorExports;
